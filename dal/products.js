const async = require('hbs/lib/async');
const { Category, Product } = require('../models');

async function getAllCategories(){
    const allCategories = (await Category.fetchAll()).map((category)=>{
        return [category.get('id'), category.get('name')];
    })
    return allCategories;
}

async function createNewProduct(productData){
    const product = new Product();  // creating a new row in the Product table
            product.set('name', productData.name);
            product.set('age', productData.age);
            product.set('cost', productData.cost);
            product.set('strength', productData.strength);
            product.set('volume', productData.volume);
            product.set('description', productData.description);
            product.set('stock', productData.stock);
            product.set('category_id', productData.category_id);
            // remember to save
            await product.save();
            return product;
}

async function getProductById(id){
    const product = await Product.where({
        "id":id
    }).fetch({
        requied:true,
        //tags and category models are fetched and returned along with the main Product model.
        //as they are the name of the relationship
        withRelated:['category']
    })
    return product
}

module.exports = {
    getAllCategories,
    createNewProduct,
    getProductById
}