const express = require('express');
const { Product, Category, Brand, Country, Region, Product_Image } = require('../models');
const { createProductForm, bootstrapField, wrapForm, createSearchForm } = require('../forms');
const { getAllCategories,
    createNewProduct,
    getProductById,
    getAllFlavorProfile,
    updateProduct,
    getProductImage,
    getProductThumbnail,
    getAllBrandNames,
    getAllCountries,
    getAllRegions,
    getAllDistilleries,
    getAllPackages,
    createNewProductImage
} = require('../dal/products');
const { checkIfAuthenticated } = require('../middlewares');
const async = require('hbs/lib/async');
const router = express.Router();


router.get('/', async (req, res) => {

    try {
        const [allCategories, allFlavorProfiles, allBrandNames, allCountries, allRegions, allDistilleries] = await Promise.all([
            getAllCategories(),
            getAllFlavorProfile(),
            getAllBrandNames(),
            getAllCountries(),
            getAllRegions(),
            getAllDistilleries()
        ]);
    
        const allArrays = [allCategories, allFlavorProfiles, allBrandNames, allCountries, allRegions, allDistilleries];
    
        allArrays.forEach((array) => {
            array.unshift([0, "------"]);
        });
    
        const searchForm = createSearchForm(
            ...allArrays
        );
    
        // the query to fetch EVERYTHING
        let searchQuery = Product.collection(); // => SELECT * FROM products WHERE 1
    
        searchForm.handle(req, {
            "success": async function (form) {
                if (form.data.brand_id && form.data.brand_id != '0') {
                    searchQuery.where('brand_id', '=', form.data.brand_id)
                }
                if (form.data.name) {
                    // add in: AND WHERE name LIKE '%<somename>%'
                    searchQuery.where('name', 'LIKE', '%' + form.data.name + '$')
                }
                if (form.data.country_id && form.data.country_id != '0') {
                    searchQuery.where('country_id', '=', form.data.country_id)
                }
                if (form.data.region_id && form.data.region_id != '0') {
                    searchQuery.where('region_id', '=', form.data.region_id)
                }
                if (form.data.category_id && form.data.category_id != '0') {
                    searchQuery.where('category_id', '=', form.data.category_id)
                }
                if (form.data.distillery_id && form.data.distillery_id != '0') {
                    searchQuery.where('distillery_id', '=', form.data.distillery_id)
                }
                if (form.data.distillery_id && form.data.distillery_id != '0') {
                    searchQuery.where('distillery_id', '=', form.data.distillery_id)
                }
                if (form.data.min_cost) {
                    q.where('cost', '>=', form.data.min_cost);
                }
                if (form.data.max_cost) {
                    q.where('cost', '<=', form.data.max_cost);
                }
                if (form.data.min_age) {
                    q.where('cost', '>=', form.data.min_age);
                }
                if (form.data.max_age) {
                    q.where('cost', '<=', form.data.max_age);
                }
                if (form.data.min_strength) {
                    q.where('cost', '>=', form.data.min_strength);
                }
                if (form.data.max_strength) {
                    q.where('cost', '<=', form.data.max_strength);
                }
                if (form.data.flavor_profiles) {
                    // JOIN flavor_profiles ON products.id = products_flavor_profiles.product_id
                    q.query('join', 'products_flavor_profiles', 'products.id', 'product_id')
                        .where('flavor_profiles_id', 'in', form.data.flavor_profiles.split(','))
                }
    
                // .collection() -- access all the rows
                // .fetch() -- execute the query
                let products = await searchQuery.fetch({
                    withRelated: ['category', 'flavor_profiles', 'brand', 'country', 'region', 'package', 'distillery', 'product_image']
                });
    
                console.log("products-->", products.toJSON())
    
                // if we want the results to be in an array of objects form
                // we have to call .toJSON on the results
                res.render('products/index', {
                    'products': products.toJSON(),
                    'form': wrapForm(form),
                })
            },
    
            "empty": async function(form){
                const products = await searchQuery.fetch({
                    withRelated: ['category', 'flavor_profiles', 'brand', 'country', 'region', 'package', 'distillery', 'product_image']
                });
                res.render('products/index', {
                    'products': products.toJSON(),
                    'form': wrapForm(form),
                })
            },
    
            "error":  async function(form){
                const products = await searchQuery.fetch({
                    withRelated: ['category', 'flavor_profiles', 'brand', 'country', 'region', 'package', 'distillery', 'product_image']
                });
                res.render('products/index', {
                    'products': products.toJSON(),
                    'form': wrapForm(form),
                })
            },
        })
    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong')
    }
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
    const allCountries = await getAllCountries();
    const allRegions = await getAllRegions();
    const allDistilleries = await getAllDistilleries();
    const allPackages = await getAllPackages();
    const allProductImages = await getProductImage();
    const allProductThumbnails = await getProductThumbnail();

    const form = createProductForm(
        allCategories,
        allFlavorProfiles,
        allBrandNames,
        allCountries,
        allRegions,
        allDistilleries,
        allPackages,
        allProductImages,
        allProductThumbnails);

    res.render('products/create', {
        // 'form': form.toHTML(bootstrapField),
        'form': wrapForm(form),
        'cloudinaryName': process.env.CLOUDINARY_NAME,
        'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
        'cloudinaryPreset': process.env.CLOUDINARY_PRESET,

    })

})

// process submitted form
router.post('/create', checkIfAuthenticated, async (req, res) => {

    const allCategories = await getAllCategories();
    const allFlavorProfiles = await getAllFlavorProfile();
    const allBrandNames = await getAllBrandNames();
    const allCountries = await getAllCountries();
    const allRegions = await getAllRegions();
    const allDistilleries = await getAllDistilleries();
    const allPackages = await getAllPackages();
    const allProductImages = await getProductImage();
    const allProductThumbnails = await getProductThumbnail();


    const form = createProductForm(
        allCategories,
        allFlavorProfiles,
        allBrandNames,
        allCountries,
        allRegions,
        allDistilleries,
        allPackages,
        allProductImages,
        allProductThumbnails
    );


    form.handle(req, {
        "success": async (form) => {
            try {
                // if the form has no errors
                // to access the data in the form, we use form.data

                // if we create a new instance of a model
                // const x = new ModelX();
                // then the x refers to ONE ROW IN THE TABLE
                // use the form data to create a new instance of the Product model, and then save it.
                const product = await createNewProduct(form.data);
                console.log("form.data:", form.data)
                // after saving the product, associate the flavor profile with it
                // note: form.data.flavor_profiles is a comma-separated string of 
                // flavor profile IDs that were selected in the form when creating a new product.
                // The attach() method is used to add a new relationship between the 
                // Product model and one or more FlavorProfile models. and is for many to 
                // many relationship

                if (form.data.image_url) {
                    const productImage = await createNewProductImage(form.data.image_url, form.data.thumbnail_url, product.id)
                    await productImage.save({ product_id: product.id }, { patch: true });
                    console.log("productImage", productImage)
                    console.log("product.id", product.id)
                }


                if (form.data.flavor_profiles) {
                    product.flavor_profiles().attach(form.data.flavor_profiles.split(','))
                }

                req.flash('success', 'Product created successfully!');
                res.redirect('/products');
            } catch (error) {
                console.log(error);
                req.flash('error', 'Failed to create product.');
                res.redirect('/products');
            }
        },

        "empty": async (form) => {
            // if the form is empty (no data provided)
            req.flash('error', 'Form cannot be empty.');
            res.render('products/create', {
                'form': wrapForm(form),
                'cloudinaryName': process.env.CLOUDINARY_NAME,
                'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
                'cloudinaryPreset': process.env.CLOUDINARY_PRESET,
            });
        },

        "error": async (form) => {
            // if the form has errors in validation 
            req.flash('error', 'Form has errors.');
            res.render('products/create', {
                'form': wrapForm(form),
                'cloudinaryName': process.env.CLOUDINARY_NAME,
                'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
                'cloudinaryPreset': process.env.CLOUDINARY_PRESET,
            })
        }
    })
})

router.get('/:productId/update', async (req, res) => {

    // fetch all the categories and flaovr profiles
    const allCategories = await getAllCategories();
    const allFlavorProfiles = await getAllFlavorProfile();
    const allBrandNames = await getAllBrandNames();
    const allCountries = await getAllCountries();
    const allRegions = await getAllRegions();
    const allDistilleries = await getAllDistilleries();
    const allPackages = await getAllPackages();
    const allProductImages = await getProductImage();
    const allProductThumbnails = await getProductThumbnail();

    // fetch one row using Bookshelf
    const product = await getProductById(req.params.productId);

    // fetch productForm object with the necessary fields
    const productForm = createProductForm(
        allCategories,
        allFlavorProfiles,
        allBrandNames,
        allCountries,
        allRegions,
        allDistilleries,
        allPackages,
        allProductImages,
        allProductThumbnails);

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

    // get all the selected images of the product
    // let selectedProductImages = await product.related('product_image').toJSON();
    // productForm.fields.product_image.value = selectedProductImages;

    res.render('products/update', {
        'product': product.toJSON(),
        'form': wrapForm(form),
        'cloudinaryName': process.env.CLOUDINARY_NAME,
        'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
        'cloudinaryPreset': process.env.CLOUDINARY_PRESET,
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
                'form': wrapForm(form),
                'cloudinaryName': process.env.CLOUDINARY_NAME,
                'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
                'cloudinaryPreset': process.env.CLOUDINARY_PRESET,
            })

        },
        "error": async (form) => {
            res.render('products/update', {
                'form': wrapForm(form),
                'cloudinaryName': process.env.CLOUDINARY_NAME,
                'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
                'cloudinaryPreset': process.env.CLOUDINARY_PRESET,
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