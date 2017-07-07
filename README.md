# HTTP Transport Reponse Validator

This package aims to be a simple way to check whether a valid response body has been returned using `Joi`.

## Example

The following example checks that the correct keys and types are sent back in the response:

```
const httpTransport = require('http-transport');
const responseValidator = require('http-transport-response-validator');
const Joi = require('joi');

const schema = Joi.object({
  a: Joi.number().required(),
  b: Joi.number()
});

httpTransport
  .createClient()
  .use(responseValidator(schema))
  .get('http://www.example.com/')
  .asBody()
  .catch((err) => {
    // any validation errors can be caught here
  });
```