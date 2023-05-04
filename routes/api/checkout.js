const express = require('express');
const router = express.Router();
const { checkIfAuthenticated } = require('../../middlewares');
const cartServices = require('../../services/cart_services')
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


router.get('/', checkIfAuthenticated, async function (req, res) {
    // 1. get the items inside the shopping cart using userId sotored in session
    const cartItems = await cartServices.getCart(req.session.user.id)

    // 2. create line items (like an invoice)
    const lineItems = [];
    const meta = []; // store product id, and the quantity order (can consider storing the unit price)

    // item represents a single row in the cart_items table, 
    for (let item of cartItems) {

        // use related() method to retrieve product model associated with cart_item
        const product = item.related('products');

        const lineItem = {
            quantity: item.get('quantity'),
            price_data: {
                currency: 'SGD',
                unit_amount: product.get('cost'), // auto converted cent to dollar by stripe
                product_data: {
                    // object destructuring
                    // name: `${product.get('name')} (${product.get('age')} years old, ${product.get('strength')}% ABV, ${product.get('volume')}ml, Cask Type: ${product.get('cask_type')})`
                    name: `${product.get('name')}`
                }
            },
        };

        const imageUrls = item.related('products').related('product_image').map(model => model.get('image_url'));
            if (imageUrls) {
                lineItem.price_data.product_data.images = imageUrls;
            }

        lineItems.push(lineItem);

        meta.push({
            product_id: item.get('product_id'),
            quantity: item.get('quantity')
        });
    }

    // 3. create a payment session with Stripe by passing line items
    const metaData = JSON.stringify(meta);
    const payment = {
        payment_method_types: ['card', 'paynow', 'wechat_pay', 'alipay', 'grabpay'],
        mode: 'payment',
        billing_address_collection: 'required',
        shipping_address_collection: {
            allowed_countries: ['SG']
        },
        line_items: lineItems,
        success_url:
            process.env.STRIPE_SUCCESS_URL + '?sessionId={CHECKOUT_SESSION_ID}',
        cancel_url: process.env.STRIPE_ERROR_URL,
        metadata: {
            orders: metaData
        },
        shipping_options: [
            {
                shipping_rate_data: {
                    display_name: 'Standard Delivery',
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: 500,
                        currency: 'SGD'
                    },
                    delivery_estimate: {
                        minimum: {
                            unit: 'business_day',
                            value: '5'
                        },
                        maximum: {
                            unit: 'business_day',
                            value: '7'
                        }
                    }
                }
            },
            {
                shipping_rate_data: {
                    display_name: '	Express Shipping',
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: 1000,
                        currency: 'SGD'
                    },
                    delivery_estimate: {
                        minimum: {
                            unit: 'business_day',
                            value: '1'
                        },
                        maximum: {
                            unit: 'business_day',
                            value: '2'
                        }
                    }
                }
            }
        ],
    };

    const stripeSession = await Stripe.checkout.sessions.create(payment);
    res.status(200).json({
        'publishableKey': process.env.STRIPE_PUBLISHABLE_KEY,
        'sessionId': stripeSession.id
    })
});

module.exports = router;