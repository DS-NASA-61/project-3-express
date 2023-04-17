const bookshelf = require('../bookshelf');

// create a product model
// A Bookshelf Model represents one table in your database

// the first parameter: the name of the Model
const Product = bookshelf.model('Product',{
    "tableName":"products"  // indicate the table that this product is linked to
});


module.exports = { Product }