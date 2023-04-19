const bookshelf = require('../bookshelf');

// create a product model
// A Bookshelf Model represents one table in your database

// the first parameter: the name of the Model
const Product = bookshelf.model('Product',{
    // indicate the table that this product is linked to
    tableName:"products",  
    // relationships in Bookshelf are defined via functions
    // the name of the function is the name of the relationship
    category(){
        // one Product model belongs to one Category model
        return this.belongsTo('Category')
    }
});

const Category = bookshelf.model('Category',{
    "tableName":"categories",
    // for the relationship to work in Bookshelf, the foregin key column must be
    // <singular_form_of_table>_id
    products(){
        return this.hasMany('Product')
    }
})


module.exports = { Product , Category}