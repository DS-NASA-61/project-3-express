const bookshelf = require('../bookshelf');

// create a product model
// A Bookshelf Model represents one table in your database

// the first parameter: the name of the Model
const Product = bookshelf.model('Product', {
    // indicate the table that this product is linked to
    tableName: "products",
    // relationships in Bookshelf are defined via functions
    // the name of the function is the name of the relationship
    category() {
        // one Product model belongs to one Category model
        return this.belongsTo('Category')
    },
    flavor_profiles() {
        return this.belongsToMany('Flavor_Profile');
    },
    brand(){
        return this.belongsTo('Brand')
    },
    product_image(){
        return this.hasMany('Product_Image')
    },
    country(){
        return this.belongsTo('Country')
    },
    region(){
        return this.belongsTo('Region')
    }
});

const Category = bookshelf.model('Category', {
    tableName: "categories",
    // for the relationship to work in Bookshelf, the foregin key column must be
    // <singular_form_of_table>_id
    products() {
        return this.hasMany('Product')
    }
})

const Flavor_Profile = bookshelf.model('Flavor_Profile', {
    tableName: "flavor_profiles",
    products() {
        return this.belongsToMany("Product");
    }
})

const User = bookshelf.model('User',{
    tableName: 'users'
})

const Product_Image = bookshelf.model('Product_Image',{
    tableName:'product_images',
    products() {
        return this.belongsTo('Product')
    }
})

const Brand = bookshelf.model('Brand',{
    tableName:'brands',
    products() {
        return this.hasMany('Product')
    }
})

const Country = bookshelf.model('Country',{
    tableName:'countries',
    products() {
        return this.hasMany('Product')
    }
})

const Region = bookshelf.model('Region',{
    tableName:'regions',
    products() {
        return this.hasMany('Product')
    }
})

module.exports = { 
    Product, 
    Category, 
    Flavor_Profile, 
    User, 
    Product_Image,
    Brand,
    Country,
    Region
}