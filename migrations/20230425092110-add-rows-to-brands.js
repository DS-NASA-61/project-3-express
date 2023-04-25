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
const columnNames = ['brand_name', 'brand_logo', 'thumbnail_url'];
const rowsToInsert = [
  ['1770 Glasgow',null,null],
  ['Balvenie',null,null],
  ['Glenallachie',null,null],
  ['Macallan',null,null],
  ["Jack Daniel's",null,null],
  ['Johnnie Walker',null,null],
  ['Crown Royal',null,null],
  ['Lagavulin',null,null],
  ['Laphroaig',null,null],
];

exports.up = function(db) {
  return Promise.all(
    rowsToInsert.map((row)=>db.insert('brands', columnNames, row))
  );
};

exports.down = function(db) {
  return Promise.all(
    rowsToInsert.map((row)=>db.delete('brands',{columnNames:row}))
  );
};

exports._meta = {
  "version": 1
};
