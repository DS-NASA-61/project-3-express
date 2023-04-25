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

const columnNames = ['country'];
const rowsToInsert = [
  ['Australia'],
  ['Belgium'],
  ['Canada'],
  ['Denmark'],
  ['England'],
  ['Finland'],
  ['France'],
  ['India'],
  ['Ireland'],
  ['Israel'],
  ['Japan'],
  ['New Zealand'],
  ['Norway'],
  ['Sweden'],
  ['Switzerland'],
  ['Taiwan'],
  ['The Netherlands'],
  ['USA'],
  ['Wales'],
];

exports.up = function(db) {
  return Promise.all(
    rowsToInsert.map((row)=>db.insert('countries', columnNames, row))
  );
};

exports.down = function(db) {
  return Promise.all(
    rowsToInsert.map((row)=>db.delete('countries',{columnNames:row}))
  );
};

exports._meta = {
  "version": 1
};
