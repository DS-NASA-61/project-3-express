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
  return db.createTable('customers', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true,
      notNull: true
    },
    username: {
      type: 'string',
      length: 20,
      notNull: true
    },
    first_name: {
      type: 'string',
      length: 45,
      notNull: true
    },
    last_name: {
      type: 'string',
      length: 45,
      notNull: true
    },
    email: {
      type: 'string',
      length: 320,
      notNull: true
    },
    password: {
      type: 'string',
      length: 100,
      notNull: true
    },
    contact_number: {
      type: 'string',
      length: 15
    }
  });
};

exports.down = function(db) {
  return db.dropTable('customers');
};

exports._meta = {
  "version": 1
};
