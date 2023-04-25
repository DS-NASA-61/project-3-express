const async = require('hbs/lib/async');
const { Category, Product, Flavor_Profile, Product_Image, Brand, Country, Region } = require('../models');

async function getAllCategories() {
    const allCategories = (await Category.fetchAll()).map((category) => {
        return [category.get('id'), category.get('name')];
    })
    return allCategories;
}

async function getAllFlavorProfile() {
    const allFlavoProfiles = await Flavor_Profile.fetchAll().map(flavor_profile => {
        return [flavor_profile.get('id'), flavor_profile.get('name')]
    })
    return allFlavoProfiles;
}

async function createNewProduct(productData) {
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

async function getProductById(id) {
    const product = await Product.where({
        "id": id
    }).fetch({
        requied: true,
        //flavor_profiles and category models are fetched and returned along with the main Product model.
        //as they are the name of the relationship
        withRelated: ['category', 'flavor_profiles','country','region']
    })
    return product
}

async function updateProduct(product, productData) {
    product.set(productData);
    await product.save();
    return product;
}

async function getProductImage() {
    const allProductImages = (await Product_Image.fetchAll()).map((image) => {
        return [image.get('id'), image.get('image_url')]
    })
    return allProductImages;
}

async function getAllBrandNames() {
    const allBrandNames = (await Brand.fetchAll()).map((brand) => {
        return [brand.get('id'),
        brand.get('brand_name')]
    })
    return allBrandNames;
}

async function getAllCountries() {
    const allCountries =(await Country.fetchAll()).map(country=>{
        return [country.get('id'), country.get('country')]
    })
    return allCountries;
}

async function getAllRegions() {
    const allRegions =(await Region.fetchAll()).map(region => {
        return [region.get('id'), region.get('region')]
    })
    return allRegions;
}




module.exports = {
    getAllCategories,
    createNewProduct,
    getProductById,
    getAllFlavorProfile,
    updateProduct,
    getProductImage,
    getAllBrandNames,
    getAllCountries,
    getAllRegions
}