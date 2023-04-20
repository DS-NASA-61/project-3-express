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
  return db.createTable('products_flavor_profiles', {
    id: { 
      type: 'int', 
      unsigned: true,
      primaryKey: true,  
      autoIncrement: true 
      },
    product_id: {
      type: 'int',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'products_flavor_profiles_product_fk',
        table: 'products',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    flavor_profile_id: {
      type: 'int',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'products_flavor_profiles_flavor_profiles_fk',
        table: 'flavor_profiles',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    }
  })
    ;
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  "version": 1
};
