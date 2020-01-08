"use strict";

/**
 * Upload.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const fs = require("fs");
const crypto = require("crypto");
const _ = require("lodash");
const toArray = require("stream-to-array");
const uuid = require("uuid/v4");

function niceHash(buffer) {
  return crypto
    .createHash("sha256")
    .update(buffer)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\//g, "-")
    .replace(/\+/, "_");
}

module.exports = {
  bufferize: async pizzas => {
    if (_.isEmpty(pizzas) === 0) {
      throw "Missing pizzas.";
    }

    // pizzas is always an array to map on
    pizzas = _.isArray(pizzas) ? pizzas : [pizzas];

    const createBuffer = async stream => {
      const parts = await toArray(fs.createReadStream(stream.path));
      const buffers = parts.map(part =>
        _.isBuffer(part) ? part : Buffer.from(part)
      );

      const buffer = Buffer.concat(buffers);

      return {
        tmpPath: stream.path,
        name: stream.name,
        sha256: niceHash(buffer),
        hash: uuid().replace(/-/g, ""),
        ext:
          stream.name.split(".").length > 1
            ? `.${_.last(stream.name.split("."))}`
            : "",
        buffer,
        mime: stream.type,
        size: (stream.size / 1000).toFixed(2)
      };
    };

    // transform all pizzas in buffer
    return Promise.all(pizzas.map(stream => createBuffer(stream)));
  },

  async upload(pizzas, config) {
    // Get upload provider settings to configure the provider to use.
    const provider = _.find(strapi.plugins.importer.config.providers, {
      provider: config.provider
    });

    if (!provider) {
      throw new Error(
        `The provider package isn't installed. Please run \`npm install strapi-provider-upload-${config.provider}\``
      );
    }

    const actions = await provider.init(config);

    // upload a single pizza
    const uploadPizza = async pizza => {
      await actions.upload(pizza);

      // Remove buffer to don't save it.
      delete pizza.buffer;
      pizza.provider = provider.provider;

      const res = await this.add(pizza);

      // Remove temp pizza
      if (pizza.tmpPath) {
        fs.unlinkSync(pizza.tmpPath);
      }
      return res;
    };

    // Execute upload function of the provider for all pizzas.
    return Promise.all(pizzas.map(pizza => uploadPizza(pizza)));
  },

  add(values) {
    return strapi.query("pizza", "importer").create(values);
  },

  fetchAll(params) {
    return strapi.query("pizza", "importer").find(params);
  },

  count(params) {
    return strapi.query("pizza", "importer").count(params);
  }
};
