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
  return db.removeForeignKey('products', 'product_brand_fk').then(() => {
    return db.changeColumn('products', 'brand_id', {
      type: 'int',
      unsigned: true,
      notNull: false, // allow null values
      defaultValue: null,
    })
  }).then(() => {
    return db.addForeignKey('products', 'brands', 'product_brand_fk', {
      "brand_id": "id"
    }, {
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT'
    })
  });
};

exports.down = function (db) {
  return db.removeForeignKey('products', 'product_brand_fk')
    .then(() => {
      return db.changeColumn('products', 'brand_id', {
        type: 'int',
        unsigned: true,
        notNull: true,
        defaultValue: 1,
      });
    });
};

exports._meta = {
  "version": 1
};
