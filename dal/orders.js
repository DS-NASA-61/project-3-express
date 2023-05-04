const async = require("hbs/lib/async");
const { OrderItem, Order, OrderStatus } = require("../models");

async function createOrder(orderData) {
    const order = new Order(orderData);
    await order.save();

    return order
}

async function createOrderItem(orderItemData) {
    const orderItem = new OrderItem(orderItemData)
    await orderItem.save();

    return orderItem
}

async function getAllOrders() {
    const orders = await Order.collection().orderBy('id', 'DESC').fetch({
        require: false,
        withRelated: [
            'users',
            'orderStatus',
            'orderItems',
        ]
    });

    return orders;
}

async function getAllOrderStatuses() {
    const orderStatuses = await OrderStatus.fetchAll().map((status) => {
        return [status.get('id'), status.get('order_status')];
    });
    orderStatuses.unshift([0, '---Select Order Status---']);

    return orderStatuses;
};

async function searchOrders() {
    let searchQuery  = Order.collection();

    if (form.data.order_id && form.data.order_id != "0") {
        searchQuery.where('id', '=', `${form.data.order_id}`)
    }

    if (form.data.username) {
        if (process.env.DB_DRIVER == 'mysql') {
            query
                .query('join', 'users', 'users.id', 'user_id')
                .where('name', 'like', `%${form.data.username}%`);
        } else {
            query
                .query('join', 'users', 'users.id', 'user_id')
                .where('name', 'ilike', `%${form.data.username}%`);
        }
    }

    if (form.data.user_email) {
        if (process.env.DB_DRIVER == 'mysql') {
            query
                .query('join', 'users', 'users.id', 'user_id')
                .where('email', 'like', `%${form.data.user_email}%`);
        } else {
            query
                .query('join', 'users', 'users.id', 'user_id')
                .where('email', 'ilike', `%${form.data.user_email}%`);
        }
    }

    if (form.data.order_status_id && form.data.order_status_id != 0) {
        query.where('order_status_id', '=', form.data.order_status_id);
    }

    if (form.data.order_date_from) {
        query.where('order_date', '>=', form.data.order_date_from);
    }

    if (form.data.order_date_to) {
        query.where('order_date', '<=', form.data.order_date_to);
    }

    const orders = await query.fetch({
        withRelated: [
            'users',
            'orderStatus',
            'orderItems',
        ]
    });

    return orders;
}

async function getOrderById(orderId) {
    return await Order.where({
        id: orderId
    }).fetch({
        require: false,
        withRelated: ['users', 'orderStatus', 'orderItems',]
    })
}

async function updateOrder(orderId, orderData) {
    // Get order
    const order = await getOrderById(orderId);

    // Set delivery date and order status
    order.set(orderData);
    await order.save();
    return true;
};

async function getOrdersByUserId(userId) {
    return await Order.where({
        user_id: userId
    }).fetchAll({
        require: false,
        withRelated: ['orderStatus']
    })
}



module.exports = {
    createOrder,
    createOrderItem,
    getAllOrders,
    getAllOrderStatuses,
    searchOrders,
    getOrderById,
    updateOrder,
    getOrdersByUserId
};