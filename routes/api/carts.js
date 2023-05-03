const express = require('express');
const router = express.Router();
const cartServices = require('../../services/cart_services');
const { checkIfAuthenticated } = require('../../middlewares');


router.get('/', async function (req, res) {
    const user = req.user; // from JWT token
    // Get user's cart
    try {
      const cartItems = await cartServices.getCart(user.id);
      sendResponse(res, 200, {
        cartItems: cartItems
      });
    } catch (error) {
      console.log(error);
      sendDatabaseError(res);
    }
  });


module.exports = router;