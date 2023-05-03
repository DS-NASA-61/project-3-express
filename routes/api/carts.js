const express = require('express');
const router = express.Router();
const cartServices = require('../../services/cart_services');
const { checkIfAuthenticatedWithJWT } = require('../../middlewares');


router.get('/', checkIfAuthenticatedWithJWT, async function (req, res) {
  const user = req.user; // from JWT token
  // Get user's cart
  try {
    const cartItems = await cartServices.getCart(user.id);
    res.status(200).json({
      cartItems: cartItems
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:productId/add', checkIfAuthenticatedWithJWT, async function (req, res) {
  const userId = req.user.id;
  const productId = req.params.productId;
  const quantity = req.body.quantity;

  if (!userId || !productId || !quantity) {
    res.status(400).json({ error: 'Invalid product' });
    return;
  }

  // Add product to user's cart
  try {
    const result = await cartServices.addToCart(
      userId,
      productId,
      quantity
    );
    if (result) {
      res.status(200).json({ message: 'Item successfully added to cart' });
    } else {
      res.status(400).json({ error: 'n error occurred while adding to cart' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:productId/update', checkIfAuthenticatedWithJWT, async function (req, res) {
  const userId = req.user.id;
  const productId = req.params.productId;
  const quantity = req.body.quantity;

  if (!userId || !productId || !quantity) {
    res.status(400).json({ error: 'Invalid product' });
    return;
  }

  // Update quantity of cart item
  try {
    const result = await cartServices.updateQuantity(userId, productId, quantity);
    if (result) {
      res.status(200).json({ message: 'Item quantity succesfully updated' })
    }
    else {
      res.status(400).json({ error: 'An error occurred while updating' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:productId/delete', checkIfAuthenticatedWithJWT, async function (req, res) {
  const userId = req.user.id;
  const productId = req.params.productId;

  if (!userId || !productId) {
    res.status(400).json({ error: 'Invalid product' });
  }

  // Delete product from user's cart
  try {
    const result = await cartServices.removeFromCart(userId, productId);
    if (result) {
      res.status(200).json({ message: 'Item successfully removed from cart' });
    }
    else {
      res.status(400).json({ error: 'An error occurred while removing from cart' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;