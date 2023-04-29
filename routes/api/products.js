const express = require('express');
const async = require('hbs/lib/async');
const productDataLayer = require('../../dal/products');
const router = express.Router();

router.get('/', async function (req, res) {

    const searchFields = req.query;

    try {
        // use the DAL to retrieve all the products
        const products = await productDataLayer.searchProducts(searchFields);
        // in a RESTFul endpoint, we'll send back JSON data
        res.json({
            status: "success",
            data:products
        });
    } catch (error) {
        res.status(500); // Internal server error
        res.json({
            status: 'error',
            message: 'Unable to communicate with database'
        });
    }
});

router.get('/:product_id', async function(req,res){
    try {
        
    } catch (error) {
        res.status(500); // Internal server error
        res.json({
            status: 'error',
            message: 'Unable to communicate with database'
        });
    }
})


module.exports = router;