const express = require('express');
const { Product, Category, Brand, Country, Region } = require('../models');
const { createProductForm, bootstrapField } = require('../forms');
const { getAllCategories,
    createNewProduct,
    getProductById,
    getAllFlavorProfile,
    updateProduct,
    getProductImage,
    getAllBrandNames,
    getAllCountries,
    getAllRegions,
 } = require('../dal/products');
const { checkIfAuthenticated } = require('../middlewares');
const router = express.Router();


router.get('/', async (req, res) => {
    // .collection() -- access all the rows
    // .fetch() -- execute the query
    const products = await Product.collection().fetch({
        withRelated: ['category', 'flavor_profiles']
    });

    // if we want the results to be in an array of objects form
    // we have to call .toJSON on the results
    res.render('products/index', {
        'products': products.toJSON()
    })
})

// --- create ---
// placing checkIfAuthenticated as the second argument 
// of router.post() and router.get() methods, so it's executed before the 
// route handler, allowing the function to check if the user 
// is authenticated before allowing access to the route.
// render form
router.get('/create', checkIfAuthenticated, async (req, res) => {

    const allCategories = await getAllCategories();
    const allFlavorProfiles = await getAllFlavorProfile();
    const allBrandNames = await getAllBrandNames();
    const allProductImage = await getProductImage();
    const allCountries = await getAllCountries();
    const allRegions = await getAllRegions();
    // createProductForm defined in forms taking in argument categories=[]
    const form = createProductForm(allCategories, allFlavorProfiles, allBrandNames, allCountries, allRegions);

    res.render('products/create', {
        'form': form.toHTML(bootstrapField),
        'cloudinaryName': process.env.CLOUDINARY_NAME,
        'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
        'cloudinaryPreset': process.env.CLOUDINARY_PRESET,

    })
    console.log('allCountries choices',allCountries.choices)
    console.log('allRegions choices',allRegions.choices)


})

// process submitted form
router.post('/create', checkIfAuthenticated, async (req, res) => {

    const allCategories = await getAllCategories();
    const allFlavorProfiles = await getAllFlavorProfile();

    const form = createProductForm(allCategories, allFlavorProfiles);

    form.handle(req, {
        "success": async (form) => {
            // if the form has no errors
            // to access the data in the form, we use form.data

            // if we create a new instance of a model
            // const x = new ModelX();
            // then the x refers to ONE ROW IN THE TABLE
            // use the form data to create a new instance of the Product model, and then save it.
            const product = await createNewProduct(form.data);

            // after saving the product, associate the flavor profile with it
            // note: form.data.flavor_profiles is a comma delimited string
            if (form.data.flavor_profiles) {
                product.flavor_profiles().attach(form.data.flavor_profiles.split(','))
            }

            req.flash('success', 'Product created successfully!');
            res.redirect('/products');

        },
        "empty": async (form) => {
            // if the form is empty (no data provided)
            req.flash('error', 'Form cannot be empty.');
            res.render('products/create', {
                'form': form.toHTML(bootstrapField)
            });

        },
        "error": async (form) => {
            // if the form has errors in validation 
            req.flash('error', 'Form has errors.');
            res.render('products/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:productId/update', async (req, res) => {

    // fetch all the categories and flaovr profiles
    const allCategories = await getAllCategories();
    const allFlavorProfiles = await getAllFlavorProfile();

    // fetch one row using Bookshelf
    const product = await getProductById(req.params.productId);

    // fetch productForm object with the necessary fields
    const productForm = createProductForm(allCategories, allFlavorProfiles);

    // //get the productForm : the hard way
    // productForm.fields.name.value = product.get('name');
    // productForm.fields.age.value = product.get('age');
    // productForm.fields.cost.value = product.get('cost');
    // productForm.fields.strength.value = product.get('strength');
    // productForm.fields.volume.value = product.get('volume');
    // productForm.fields.description.value = product.get('description')
    // productForm.fields.stock.value = product.get('stock');
    // productForm.fields.category_id.value = product.get('category_id');

    // get the productForm : the simplified way -- using a loop
    const fieldToGet = ['name', 'age', 'cost', 'strength', 'volume', 'description', 'stock', 'category_id'];
    fieldToGet.forEach(field => {
        productForm.fields[field].value = product.get(field);
    })

    // get all the selected flavor profiles of the product
    // 'pluck' function only exists for bookshelf -- extracts out one key and put into an array
    let selectedFlavorProfiles = await product.related('flavor_profiles').pluck('id');  // example: [1,2,3,4]
    // put the selectedFlavorProfiles into the product fields
    productForm.fields.flavor_profiles.value = selectedFlavorProfiles;

    res.render('products/update', {
        'product': product.toJSON(),
        'form': productForm.toHTML(bootstrapField)
    });
})

router.post('/:productId/update', async function (req, res) {

    const productForm = createProductForm();

    const product = await getProductById(req.params.productId);

    productForm.handle(req, {
        "success": async (form) => {

            const { flavor_profiles, ...productData } = form.data; //destructuring and rest operator

            await updateProduct(product, productData);

            // begin the synchronization of tags
            const incomingFlavorProfiles = flavor_profiles.split(',');
            const existingFlavorProfiles = await product.related('flavor_profiles').pluck('id');
            // find flavor_profiles to remove
            let toRemove = existingFlavorProfiles.filter(t => incomingFlavorProfiles.includes(t) === false);
            await product.flavor_profiles().detach(toRemove);
            // find flavor_profiles to add
            let toAdd = incomingFlavorProfiles.filter(t => existingFlavorProfiles.includes(t) === false);
            await product.flavor_profiles().attach(toAdd)

            res.redirect('/products');

        },
        "empty": async (form) => {
            res.render('products/update', {
                'form': productForm.toHTML(bootstrapField)
            })

        },
        "error": async (form) => {
            res.render('products/update', {
                'form': productForm.toHTML(bootstrapField)
            })
            console.log(form);
        }

    })

})

router.get('/:productId/delete', async function (req, res) {
    const product = await Product.where({
        'id': req.params.productId
    }).fetch({
        'required': true
    });

    res.render('products/delete', {
        'product': product.toJSON()
    })
});

router.post('/:productId/delete', async function (req, res) {
    const product = await Product.where({
        'id': req.params.productId
    }).fetch({
        'require': true
    });
    await product.destroy(); // remove the row
    res.redirect('/products');

})

module.exports = router;