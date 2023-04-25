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

const columnNames = ['description'];
const rowsToInsert = [
  ['With Box'],
  ['None'],
  ['Original tube of cardboard or metal'],
];

exports.up = function(db) {
  return Promise.all(
    rowsToInsert.map((row)=>db.insert('packages', columnNames, row))
  );
};

exports.down = function(db) {
  return Promise.all(
    rowsToInsert.map((row)=>db.delete('packages',{columnNames:row}))
  );
};

exports._meta = {
  "version": 1
};
