"use strict";

/**
 * Upload.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const fs = require("fs");
const _ = require("lodash");
const csv = require("fast-csv");

async function parseCsv(_files) {
  const files = _.isArray(_files) ? _files : [_files];

  const _parseCsv = stream => {
    return new Promise((resolve, reject) => {
      const protoPizzas = [];

      fs.createReadStream(stream.path)
        .pipe(csv.parse())
        .on("error", error => reject(error))
        .on("data", row => {
          protoPizzas.push({ name: row[0], ranking: Number(row[1]) });
        })
        .on("end", rowCount => resolve(protoPizzas));
    });
  };

  return Promise.all(files.map(stream => _parseCsv(stream)));
}

const isValid = arrData => {
  return _.every(arrData, data => {
    return _.isString(data.name) && _.isNumber(data.ranking);
  });
};

/* TODO: ver bien donde meter la query */
const persistQuery = {
  mongoose({ model }) {
    return arrData => {
      return model.insertMany(arrData);
    };
  }
};

async function persist(files) {
  const _parsedCsv = await parseCsv(files);
  const parsedCsv = _.flatten(_parsedCsv);
  if (!isValid(parsedCsv)) throw Error(parsedCsv);
  // TODO: unlinked temp file
  return strapi.query("pizza", "importer").custom(persistQuery)(parsedCsv);
}

module.exports = {
  persist,

  add(values) {
    return strapi.query("pizza", "importer").create(values);
  },

  fetchAll(params) {
    return strapi
      .query("pizza", "importer")
      .find({ _sort: "updatedAt:desc", ...params });
  },

  count(params) {
    return strapi.query("pizza", "importer").count(params);
  }
};
