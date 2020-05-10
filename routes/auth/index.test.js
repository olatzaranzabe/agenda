const request = require('supertest');
const app = require('../../app');

// const http = require('jest-http');
// jest.use(http);

// const time = require('../util/time');
// const sinon = require('sinon');
// sinon.stub(time, 'setTimeout');

describe('Sample Test', () => {
  it('should test that true === true', () => {
    expect(true).toBe(true);
  });
});

jest.useFakeTimers();
describe('user login', () => {
  it('should return 200 and token for valid credentials', async () => {
    const valid_input = {
      email: 'john@wick.com',
      password: 'secret'
    };
    const res = await request(app)
      .post('/login')
      .send(valid_input);
    await expect(res.statusCode).toEqual(200);
    await expect(res.body).toHaveProperty('post');
    await expect(res.body.token).to.exist;
  });
});
