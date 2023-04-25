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

const columnNames = ['region'];
const rowsToInsert = [
  ['Highlands'],
  ['Islands'],
  ['Islay'],
  ['Lowlands'],
  ['Speyside']
];

exports.up = function(db) {
  return Promise.all(
    rowsToInsert.map((row)=>db.insert('regions', columnNames, row))
  );
};

exports.down = function(db) {
  return Promise.all(
    rowsToInsert.map((row)=>db.delete('regions', {columnNames:row}))
  );
};

exports._meta = {
  "version": 1
};
