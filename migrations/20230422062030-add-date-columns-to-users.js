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
    db.addColumn('users','created_date',{
      type: "date",
      notNull: true
    }),
    db.addColumn('users','modified_date',{
      type: "date"
    }),
  ]);
};

exports.down = function(db) {
  return Promise.all([
    db.removeColumn('users','created_date',{
      type: "date",
      notNull: true
    }),
    db.removeColumn('users','modified_date',{
      type: "date"
    }),
  ]);
};

exports._meta = {
  "version": 1
};
