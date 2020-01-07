"use strict";

/**
 * Importer.js controller
 *
 * @description: A set of functions called "actions" of the `importer` plugin.
 */

module.exports = {
  /**
   * Default action.
   *
   * @return {Object}
   */

  index: async ctx => {
    // Add your own logic here.

    // Send 200 `ok`
    console.warn("PASO POR ACÄ");
    ctx.send({
      message: "ok"
    });
  }
};
