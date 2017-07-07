'use strict';

const joi = require('joi');

module.exports = function validator(schema) {
  return function (ctx, next) {
    return next().then(() => {
      joi.assert(ctx.res.body, schema);
    });
  };
};