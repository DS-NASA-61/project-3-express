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
  return Promise.all([
    db.removeColumn('products', 'image_url'),
    db.removeColumn('products', 'thumbnail_url'),
    db.removeColumn('products', 'image_url_2'),
    db.removeColumn('products', 'thumbnail_url_2'),
    db.removeColumn('products', 'image_url_3'),
    db.removeColumn('products', 'thumbnail_url_3'),
  ]);
};

exports.down = function(db) {
  return  Promise.all([
    db.addColumn('products',
    'image_url',{
      type: 'string',
      length: 2048,
      notNull: true
    }),
    db.addColumn('products',
    'thumbnail_url',{
      type: 'string',
      length: 2048
    }),
    db.addColumn('products',
    'image_url_2',{
      type: 'string',
      length: 2048
    }),
    db.addColumn('products',
    'thumbnail_url_2',{
      type: 'string',
      length: 2048
    }),
    db.addColumn('products',
    'image_url_3',{
      type: 'string',
      length: 2048
    }),
    db.addColumn('products',
    'thumbnail_url_3',{
      type: 'string',
      length: 2048
    }),
  ]);
};

exports._meta = {
  "version": 1
};
