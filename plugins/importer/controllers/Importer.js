"use strict";

/**
 * Upload.js controller
 *
 * @description: A set of functions called "actions" of the `upload` plugin.
 */

const _ = require("lodash");

module.exports = {
  async upload(ctx) {
    const uploadService = strapi.plugins.importer.services.importer;

    // Retrieve provider configuration.
    const config = await strapi
      .store({
        environment: strapi.config.environment,
        type: "plugin",
        name: "importer"
      })
      .get({ key: "provider" });

    // Verify if the file upload is enable.
    if (config.enabled === false) {
      return ctx.badRequest(
        null,

        [
          {
            messages: [
              {
                id: "Upload.status.disabled",
                message: "File upload is disabled"
              }
            ]
          }
        ]
      );
    }

    // Extract optional relational data.
    const { refId, ref, source, field, path } = ctx.request.body || {};
    const { files = {} } = ctx.request.files || {};

    if (_.isEmpty(files)) {
      return ctx.badRequest(null, [
        {
          messages: [{ id: "Upload.status.empty", message: "Files are empty" }]
        }
      ]);
    }

    // Transform stream files to buffer
    const buffers = await uploadService.bufferize(files);

    const enhancedFiles = buffers.map(file => {
      if (file.size > config.sizeLimit) {
        return ctx.badRequest(null, [
          {
            messages: [
              {
                id: "Upload.status.sizeLimit",
                message: `${file.name} file is bigger than limit size!`,
                values: { file: file.name }
              }
            ]
          }
        ]);
      }

      // Add details to the file to be able to create the relationships.
      if (refId && ref && field) {
        Object.assign(file, {
          related: [
            {
              refId,
              ref,
              source,
              field
            }
          ]
        });
      }

      // Update uploading folder path for the file.
      if (path) {
        Object.assign(file, {
          path
        });
      }

      return file;
    });

    // Something is wrong (size limit)...
    if (ctx.status === 400) {
      return;
    }

    const uploadedFiles = await uploadService.upload(enhancedFiles, config);

    // Send 200 `ok`
    ctx.send(uploadedFiles);
  },

  async find(ctx) {
    const data = await strapi.plugins["importer"].services.importer.fetchAll(
      ctx.query
    );

    // Send 200 `ok`
    ctx.send(data);
  },

  async findOne(ctx) {
    const data = await strapi.plugins["importer"].services.importer.fetch(
      ctx.params
    );

    if (!data) {
      return ctx.notFound("file.notFound");
    }

    ctx.send(data);
  },

  async count(ctx) {
    const data = await strapi.plugins["importer"].services.importer.count(
      ctx.query
    );

    ctx.send({ count: data });
  }
};
