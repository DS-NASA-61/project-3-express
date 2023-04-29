const async = require('hbs/lib/async');
const { Category, Product, Flavor_Profile, Product_Image, Brand, Country, Region, Distillery, Package } = require('../models');

async function getAllProducts() {
    return await Product.fetchAll();
}

async function getAllCategories() {
    const allCategories = (await Category.fetchAll()).map((category) => {
        return [category.get('id'), category.get('name')];
    })
    return allCategories;
}

async function getAllFlavorProfile() {
    const allFlavorProfiles = await Flavor_Profile.fetchAll().map(flavor_profile => {
        return [flavor_profile.get('id'), flavor_profile.get('name')]
    })
    return allFlavorProfiles;
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
    product.set('brand_id', productData.brand_id);
    product.set('country_id', productData.country_id);
    product.set('region_id', productData.region_id);
    product.set('distillery_id', productData.distillery_id);
    product.set('package_id', productData.package_id);
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
        withRelated: ['category', 'flavor_profiles', 'country', 'region', 'distillery', 'package', 'product_image']
    })
    return product
}

async function updateProduct(product, productData) {
    product.set(productData);
    await product.save();
    return product;
}

// async function createNewProductImage(image){
//     const Product_Image = new Product_Image;
//     image.set('image_url', image.image_url);
//     image.set('thumbnail_url', image.thumbnail_url);
//     await image.save();
//     return image
// }
// same code but different way of writng as below
async function createNewProductImage(imageUrl, thumbnailUrl, productId) {
    const product_image = new Product_Image({
        image_url: imageUrl,
        thumbnail_Url: thumbnailUrl,
        product_id: productId,
    });  // creating a new row in the Product_Image table

    await product_image.save();
    return product_image
}


async function getProductImage() {
    const allProductImages = (await Product_Image.fetchAll()).map((image) => {
        return [image.get('id'), image.get('image_url')]
    })
    return allProductImages;
}

async function getProductThumbnail() {
    const allProductThumbnails = (await Product_Image.fetchAll()).map((image) => {
        return [image.get('id'), image.get('thumbnail_url')]
    })
    return allProductThumbnails;
}


async function getAllBrandNames() {
    const allBrandNames = (await Brand.fetchAll()).map((brand) => {
        return [brand.get('id'),
        brand.get('brand_name')]
    })
    return allBrandNames;
}

async function getAllCountries() {
    const allCountries = (await Country.fetchAll()).map(country => {
        return [country.get('id'), country.get('country')]
    })
    return allCountries;
}

async function getAllRegions() {
    const allRegions = (await Region.fetchAll()).map(region => {
        return [region.get('id'), region.get('region')]
    })
    return allRegions;
}

async function getAllDistilleries() {
    const allDistilleries = await Distillery.fetchAll().map(distillery => {
        return [distillery.get('id'), distillery.get('name')]
    })
    return allDistilleries;
}

async function getAllPackages() {
    const allPackages = await Package.fetchAll().map(package => {
        return [package.get('id'), package.get('description')]
    })
    return allPackages;
}


// for restful api product search
async function searchProducts(formData) {

    // .collection() -- access all the rows
    let searchQuery = Product.collection();

    if (formData) {
        if (formData.brand_id && formData.brand_id != '0') {
            searchQuery.where('brand_id', '=', formData.brand_id)
        }
        if (formData.name) {
            // add in: AND WHERE name LIKE '%<somename>%'
            searchQuery.where('name', 'LIKE', `%${formData.name}%`)
        }
        if (formData.country_id && formData.country_id != '0') {
            searchQuery.where('country_id', '=', formData.country_id)
        }
        if (formData.region_id && formData.region_id != '0') {
            searchQuery.where('region_id', '=', formData.region_id)
        }
        if (formData.category_id && formData.category_id != '0') {
            searchQuery.where('category_id', '=', formData.category_id)
        }
        if (formData.distillery_id && formData.distillery_id != '0') {
            searchQuery.where('distillery_id', '=', formData.distillery_id)
        }
        if (formData.min_cost) {
            searchQuery.where('cost', '>=', formData.min_cost);
        }
        if (formData.max_cost) {
            searchQuery.where('cost', '<=', formData.max_cost);
        }
        if (formData.min_age) {
            searchQuery.where('age', '>=', formData.min_age);
        }
        if (formData.max_age) {
            searchQuery.where('age', '<=', formData.max_age);
        }
        if (formData.min_strength) {
            searchQuery.where('strength', '>=', formData.min_strength);
        }
        if (formData.max_strength) {
            searchQuery.where('strength', '<=', formData.max_strength);
        }
        if (formData.flavor_profiles && formData.flavor_profiles != '0') {
            // JOIN flavor_profiles ON products.id = products_flaovr_profiles.product_id
            searchQuery.query('join', 'flavor_profiles_products', 'products.id', 'product_id')
                .where('flavor_profile_id', 'in', formData.flavor_profiles.split(','))
        }
    }

    
    // .fetch() -- execute the query
    const products = await searchQuery.fetch({
        withRelated: ['category', 'flavor_profiles', 'brand', 'country', 'region', 'package', 'distillery', 'product_image']
    });

    // if we want the results to be in an array of objects form, then
    // we need to call .toJSON on the results
    return products.toJSON();

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
    getAllRegions,
    getAllDistilleries,
    getAllPackages,
    createNewProductImage,
    getProductThumbnail,
    getAllProducts,
    searchProducts
}