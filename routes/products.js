const express = require('express');
const { Product, Category } = require('../models');
const { createProductForm, bootstrapField } = require('../forms');
const { getAllCategories, createNewProduct, getProductById } = require('../dal/products');
const router = express.Router();


router.get('/', async(req,res)=>{
    // .collection() -- access all the rows
    // .fetch() -- execute the query
    const products = await Product.collection().fetch({
        withRelated:['category']
    });
   
    // if we want the results to be in an array of objects form
    // we have to call .toJSON on the results
    res.render('products/index',{
        'products': products.toJSON()   
    })
})

// --- create ---
// render form
router.get('/create', async(req,res)=>{
    const allCategories = await getAllCategories();
    // createProductForm defined in forms taking in argument categories=[]
    const form = createProductForm(allCategories);
    res.render('products/create', {
        'form': form.toHTML(bootstrapField)
    })
})

// process submitted form
router.post('/create', async(req,res)=>{

    const allCategories = await getAllCategories();
    
    const form = createProductForm(allCategories);
    form.handle(req,{
        "success": async (form) => {
            // if the form has no errors
            // to access the data in the form, we use form.data

            // if we create a new instance of a model
            // const x = new ModelX();
            // then the x refers to ONE ROW IN THE TABLE
            // use the form data to create a new instance of the Product model, and then save it.
            const product = await createNewProduct(form.data);
            res.redirect('/products');

        },
        "empty": async (form) => {
            // if the form is empty (no data provided)
            res.render('products/create', {
                'form': form.toHTML(bootstrapField)
            });

        },
        "error": async (form) => {
            // if the form has errors in validation 
            res.render('products/create',{
                'form': form.toHTML(bootstrapField)
            })
        }
    } )
})

router.get('/:productId/update', async(req,res)=>{

     // fetch all the categories
     const allCategories = await getAllCategories();

    // fetch one row using Bookshelf
    const product = await getProductById(req.params.productId);
    
    const productForm = createProductForm(allCategories);
    productForm.fields.name.value = product.get('name');
    productForm.fields.age.value = product.get('age');
    productForm.fields.cost.value = product.get('cost');
    productForm.fields.strength.value = product.get('strength');
    productForm.fields.volume.value = product.get('volume');
    productForm.fields.description.value = product.get('description')
    productForm.fields.stock.value = product.get('stock');
    productForm.fields.category_id.value = product.get('category_id');

    res.render('products/update',{
        'product': product.toJSON(),
        'form': productForm.toHTML(bootstrapField)
    });
})

router.post('/:productId/update', async function(req,res){
    // fetch all the categories
    const allCategories = await getAllCategories();
    const productForm = createProductForm(allCategories);
    const product = await getProductById(req.params.productId);
    productForm.handle(req,{
        "success": async(form) => {
            product.set(form.data);
            product.save();
            res.redirect('/products');
        },
        "empty": async (form) => {
            res.render('products/update',{
                'form': productForm.toHTML(bootstrapField)
            })
        },
        "error": async (form) => {
            res.render('products/update',{
                'form': productForm.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:productId/delete', async function(req,res){
    const product = await Product.where({
        'id': req.params.productId
    }).fetch({
        'required': true
    });

    res.render('products/delete',{
        'product': product.toJSON()
    })
});

router.post('/:productId/delete', async function(req,res){
    const product = await Product.where({
        'id': req.params.productId
    }).fetch({
        'require': true
    });
    await product.destroy(); // remove the row
    res.redirect('/products');

})

module.exports = router;