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

const columnNames = ['name'];
const rowsToInsert = [
  ['Macallan'],
  ['Glenlivet'],
  ['Talisker'],
  ['Lagavulin'],
  ['Highland Park'],
  ['Glenfiddich'],
  ['Laphroaig'],
  ['Balvenie'],
  ['Jameson'],
  ['Bushmills'],
  ['Tullamore Dew'],
  ["Jack Daniel's"],
  ['Woodford Reserve'],
  ['Wild Turkey'],
  ['Crown Royal'],
  ['Yamazaki'],
  ['Hibiki'],
  ['Kavalan'],
  ['Nant'],
  ['Brenne'],
];

exports.up = function(db) {
  return Promise.all(
    rowsToInsert.map((row)=>db.insert('distilleries', columnNames, row))
  );
};

exports.down = function(db) {
  return Promise.all(
    rowsToInsert.map((row)=>db.delete('distilleries',{columnNames:row}))
  );
};

exports._meta = {
  "version": 1
};
