'use strict';

const assert = require('assert');
const httpTransport = require('http-transport');
const nock = require('nock');
const joi = require('joi');

const validator = require('../');

const api = nock('http://www.example.com');
const schema = joi.object({
  a: joi.number().required(),
  b: joi.number()
});

nock.disableNetConnect();

function createCache() {
  const cache = new Catbox.Client(new Memory());
  bluebird.promisifyAll(cache);

  return cache;
}

function requestWithValidator() {
  return httpTransport
    .createClient()
    .use(validator(schema))
    .get('http://www.example.com/')
    .asBody();
}

describe('HTTP Transport Response Validator', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('errors if it fails to validate the response', (done) => {
    api.get('/').reply(200, { b: 2 });

    requestWithValidator()
      .catch((err) => {
        assert.ok(err);
        assert.equal(err.message, '"a" is required');
        done();
      });
  });

  it('resolves normally if response is valid', () => {
    api.get('/').reply(200, { a: 1, b: 2 });

    return requestWithValidator()
      .then((body) => {
        assert.ok(body);
        assert.deepEqual(body, '{"a":1,"b":2}');
      });
  });
});