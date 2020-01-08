"use strict";

/**
 * Upload.js controller
 *
 * @description: A set of functions called "actions" of the `upload` plugin.
 */

const _ = require("lodash");

module.exports = {
  async upload(ctx) {
    try {
      const { files = {} } = ctx.request.files || {};
      const data = await strapi.plugins["importer"].services.importer.persist(
        files
      );
      ctx.send(data);
    } catch (err) {
      ctx.throw(400, err);
    }
  },

  async count(ctx) {
    ctx.send({ count: 1 });
  },

  async find(ctx) {
    const data = await strapi.plugins["importer"].services.importer.fetchAll(
      ctx.query
    );

    // Send 200 `ok`
    ctx.send(data);
  }
};
