'use strict';

const app = require('../../handler.js');
const chai = require('chai');
const assert = require('assert');
const expect = chai.expect;
let event;
let context;
let callback;

describe('Test get all spot function ', function() {
  it('should ', async () => {
    const result = await app.getAllPublicSpotsFunction(event, context, callback);

    expect(result).to.be.an('object');
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.an('string');

    const response = JSON.parse(result.body);

    expect(response).to.be.an('object');
    expect(response.message).to.be.equal('hello world');
    // expect(response.location).to.be.an("string");
  });
});
