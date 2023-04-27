const { Cart_Item } = require('../models');

// get the items in the shopping cart of this particular userId 
async function getCart(userId) {
    return await Cart_Item.collection().where({
        user_id: userId
    }).fetch({
        require: false,
        withRelated: ['product', 'product.name']
    })
}

// check if a specific product exists in a user's shopping cart
async function getCartItemByUserAndProduct(userId, productId) {
    return await Cart_Item.where({
        'user_id': userId,
        'product_id': productId
    }).fetch({
        require: false
    })
}

// add item to cart, aka add rows to Cart_Item table/model
async function addItemToCart(userId, productId, quantity) {
    let cartItem = new Cart_Item({
        'user_id': userId,
        'product_id': productId,
        'quantity': quantity
    })
    await cartItem.save();
    return cartItem;
}

// update quantity
async function updateQuantity(userId, productId, quantity) {
    const cartItem = await getCartItemByUserAndProduct(userId, productId);
    if (cartItem) {
        cartItem.set('quantity', quantity);
        await cartItem.save();
        return true;
    }
    return false;
}

// remove item from cart
async function removeFromCart(userId, productId){
    let cartItem = await getCartItemByUserAndProduct(userId, productId);
    if (cartItem) {
        await cartItem.destroy();
        return true;
    }
    return false;
}



module.exports = {
    getCart,
    getCartItemByUserAndProduct,
    addItemToCart,
    updateQuantity,
    removeFromCart
}