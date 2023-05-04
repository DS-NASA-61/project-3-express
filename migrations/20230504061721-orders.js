'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('orders', {
    id: {
      type: 'int',
      unsigned: true,
      primaryKey: true,
      autoIncrement: true
    },
    total_cost: {
      type: 'int',
      unsigned: true,
      notNull: true
    },
    payment_type: {
      type: 'string',
      length: 50,
      notNull: true
    },
    receipt_url: {
      type: 'string',
      length: 2048,
      notNull: true
    },
    order_date: {
      type: 'datetime',
      notNull: true
    },
    delivery_date: {
      type: 'datetime',
      notNull: false
    },
    payment_intent: {
      type: 'string',
      length: 100,
      notNull: true
    },
    delivery_option: {
      type: 'string',
      length: 100,
      notNull: true
    },
    shipping_address_line1: {
      type: 'string',
      length: 100,
      notNull: true
    },
    shipping_address_line2: {
      type: 'string',
      length: 100,
      notNull: false
    },
    shipping_address_postal: {
      type: 'string',
      length: 10,
      notNull: true
    },
    shipping_address_country: {
      type: 'string',
      length: 2,
      notNull: true
    },
    billing_address_line1: {
      type: 'string',
      length: 100,
      notNull: true
    },
    billing_address_line2: {
      type: 'string',
      length: 100,
      notNull: false
    },
    billing_address_postal: {
      type: 'string',
      length: 10,
      notNull: true
    },
    billing_address_country: {
      type: 'string',
      length: 2,
      notNull: true
    },
    user_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'orders_user_fk',
        table: 'users',
        mapping: 'id',
        rules: {
          onDelete: 'restrict',
          onUpdate: 'restrict'
        }
      }
    },
    order_status_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      defaultValue: 1,
      foreignKey: {
        name: 'orders_order_status_fk',
        table: 'order_statuses',
        mapping: 'id',
        rules: {
          onDelete: 'restrict',
          onUpdate: 'restrict'
        }
      }
    }
  });
};

exports.down = function(db) {
  return db.dropTable('orders');
};

exports._meta = {
  "version": 1
};
