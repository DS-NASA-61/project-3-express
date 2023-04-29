const cartDataLayer = require('../dal/cartItems')
const productDataLayer = require('../dal/products');

// apply business logic here

// check if stock is sufficient
async function getCurrentStock(productId) {
    const product = await productDataLayer.getProductById(productId);
    return parseInt(product.get('stock'));
}

async function getCart(userId) {

    let cartItems = await cartDataLayer.getCart(userId);

    let removedProducts = [];
    for (let i = 0; i < cartItems.length; i++) {
        const cartItem = cartItems.models[i].toJSON();
        // toJSON() method can be used on individual model instances, not directly on the Collection.
        // cartItems is a Bookshelf Collection, so can't use .toJson() based on console.log(cartItems)
        // cartItems.models is model instance array, which is why can call toJSON() on cartItems.models[i].
        const productId = cartItem.product_id;
        const currentStock = await getCurrentStock(productId);

        // If the stock of a product has reached 0, 
        // remove the product from the cart
        if (currentStock === 0) {
            await cartDataLayer.removeFromCart(userId, productId);
            removedProducts.push(cartItem);
            cartItems.splice(i, 1);
            i--; // Adjust the index to account for the removed item
        }
    }

    // inform the user of the removal
    if (removedProducts.length > 1) {
        console.log('The following products have been removed from your cart due to stock unavailability:');
        removedProducts.forEach((product) => {
            console.log(`- ${product.name}`);
        });
    }

    return cartItems;
}

async function addToCart(userId, productId, quantity) {
    try {
        // check if item to be added is already in user's cart
        const cartItem = await cartDataLayer.getCartItemByUserAndProduct(userId, productId);;

        // get current stock of the product
        const stock = await getCurrentStock(productId);

        // check currently if stock sufficient
        if (cartItem) {
            // Get the current quantity in the cart
            const currentQuantity = parseInt(cartItem.get('quantity'));

            // Check if the total quantity of the cart item does not exceed the stock
            if (currentQuantity + quantity > stock) {
                return false;
            }

            // Update the quantity if there is enough stock
            await cartDataLayer.updateQuantity(userId, productId, cartItem.get('quantity') + quantity);
        }
        else {
            // Check if there is enough stock for the requested quantity
            if (quantity > stock) {
                return false;
            }
            // Create a new cart item if there is enough stock
            await cartDataLayer.addItemToCart(userId, productId, quantity);
        }
        return true;

    } catch (error) {
        console.log(error);
        return false;
    }

}

async function updateQuantity(userId, productId, newQuantity) {
    // make sure that there's enough stock
    const stock = await getCurrentStock(productId);
    // If updated quantity exceeds stock, reject
    if (newQuantity > stock) {
        return false;
    }
    return await cartDataLayer.updateQuantity(userId, productId, newQuantity);
}

async function removeFromCart(userId, productId) {
    // todo: indicate the user's interest in the product type
    // todo: add this item to the list of removed items
    // and when there's enough send an email with a discount code
    return await cartDataLayer.removeFromCart(userId, productId);
}

// to empty cart is to remove all cart items associated with the given userId. 
async function emptyCart(userId) {
    try {
        await cartDataLayer.removeAllCartItemsByUser(userId);
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = {
    getCurrentStock,
    getCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    emptyCart
}