const express = require("express");
const router = express.Router();
const cartServices = require('../services/cart_services');
const { checkIfAuthenticated } = require('../middlewares');

router.get('/', [checkIfAuthenticated], async (req, res) => {
    const cartItems = await cartServices.getCart(req.session.user.id);
    return res.render('cart/index', {
        cartItems: cartItems.toJSON()
    })
})

router.get('/:productId/add', [checkIfAuthenticated], async function (req, res) {
    const success = await cartServices.addToCart(req.session.user.id, req.params.productId, 1);
    if(success){
        req.flash("success", "Item added to cart");
        res.redirect('/cart/');
    }
    else{
        req.flash("error", "No more stock available for this item")
        res.redirect(`/products/`);
    }
})

module.exports = router;