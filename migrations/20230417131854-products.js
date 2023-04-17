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
  return db.createTable('products', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true,
      notNull: true
    },
    name: {
      type: 'string',
      length: 255,
      notNull: true
    },
    age: {
      type: 'int',
      notNull: true
    },
    cost: {
      type: 'int',
      notNull: true
    },
    strength: {
      type: 'decimal',
      precision: 5,
      scale: 2,
      notNull: true
    },
    volume: {
      type: 'int',
      notNull: true
    },
    description: {
      type: 'text',
    },
    stock: {
      type: 'int',
      notNull: true
    },
    image_url: {
      type: 'string',
      length: 2048,
      notNull: true
    },
    thumbnail_url: {
      type: 'string',
      length: 2048
    },
    image_url_2: {
      type: 'string',
      length: 2048
    },
    thumbnail_url_2: {
      type: 'string',
      length: 2048
    },
    image_url_3: {
      type: 'string',
      length: 2048
    },
    thumbnail_url_3: {
      type: 'string',
      length: 2048
    }
  });
};

exports.down = function(db) {
  return db.dropTable('products');
};

exports._meta = {
  "version": 1
};
