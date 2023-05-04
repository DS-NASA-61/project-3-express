'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.addForeignKey('orders', 'order_statuses', 'orders_order_status_fk', {
    'order_status_id': 'id'
  }, {
    onDelete: 'restrict',
    onUpdate: 'restrict'
  });
};

exports.down = function (db) {
  return db.removeForeignKey('orders','orders_order_status_fk');
};

exports._meta = {
  "version": 1
};
