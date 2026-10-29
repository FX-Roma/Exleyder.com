'use strict';

const { afterEach, beforeEach, describe, it } = require('node:test');
const assert = require('node:assert/strict');
const contactHandler = require('../api/contact.js');

const ENV_KEYS = ['RESEND_API_KEY', 'CONTACT_TO_EMAIL', 'CONTACT_FROM_EMAIL'];
const previousEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));
const originalFetch = global.fetch;
let nextTestIp = 2;

const validPayload = {
  clientName: 'Alex Mercer',
  clientEmail: 'alex@example.com',
  serviceType: 'Full-Stack Development (MEAN/MERN)',
  projectMessage: 'I would like to discuss a new web application.',
  website: ''
};

function createResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };
}

function createRequest({ method = 'POST', body = validPayload, headers } = {}) {
  return {
    method,
    body,
    headers: headers || {
      'content-type': 'application/json',
      'x-forwarded-for': `192.0.2.${nextTestIp++}`
    }
  };
}

beforeEach(() => {
  process.env.RESEND_API_KEY = 're_test_key';
  process.env.CONTACT_TO_EMAIL = 'owner@example.com';
  process.env.CONTACT_FROM_EMAIL = 'Portfolio <contact@example.com>';
  global.fetch = async () => new Response(JSON.stringify({ id: 'test-message-id' }), {
    status: 200,
    headers: { 'content-type': 'application/json' }
  });
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (previousEnv[key] === undefined) delete process.env[key];
    else process.env[key] = previousEnv[key];
  }
  global.fetch = originalFetch;
});

describe('Vercel contact function', () => {
  it('rejects methods other than POST', async () => {
    const res = createResponse();

    await contactHandler(createRequest({ method: 'GET' }), res);

    assert.equal(res.statusCode, 405);
    assert.equal(res.headers.allow, 'POST');
    assert.equal(res.body.success, false);
  });

  it('rejects requests that are not JSON', async () => {
    const res = createResponse();

    await contactHandler(createRequest({ headers: { 'content-type': 'text/plain' } }), res);

    assert.equal(res.statusCode, 415);
  });

  it('validates email and service before calling Resend', async () => {
    let fetchCalled = false;
    global.fetch = async () => { fetchCalled = true; };
    const res = createResponse();

    await contactHandler(createRequest({
      body: { ...validPayload, clientEmail: 'not-an-email' }
    }), res);

    assert.equal(res.statusCode, 400);
    assert.equal(fetchCalled, false);
  });

  it('silently discards submissions that fill the honeypot', async () => {
    let fetchCalled = false;
    global.fetch = async () => { fetchCalled = true; };
    const res = createResponse();

    await contactHandler(createRequest({ body: { ...validPayload, website: 'bot-filled-this' } }), res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.equal(fetchCalled, false);
  });

  it('sends a text and HTML message and sets reply_to to the visitor', async () => {
    let capturedOptions;
    global.fetch = async (_url, options) => {
      capturedOptions = options;
      return new Response(JSON.stringify({ id: 'test-message-id' }), {
        status: 200,
        headers: { 'content-type': 'application/json' }
      });
    };
    const res = createResponse();

    await contactHandler(createRequest(), res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.equal(capturedOptions.headers.Authorization, 'Bearer re_test_key');
    const emailPayload = JSON.parse(capturedOptions.body);
    assert.deepEqual(emailPayload.to, ['owner@example.com']);
    assert.equal(emailPayload.reply_to, validPayload.clientEmail);
    assert.equal(typeof emailPayload.text, 'string');
    assert.equal(typeof emailPayload.html, 'string');
  });

  it('escapes HTML supplied by the visitor', async () => {
    let capturedOptions;
    global.fetch = async (_url, options) => {
      capturedOptions = options;
      return new Response(JSON.stringify({ id: 'test-message-id' }), { status: 200 });
    };
    const res = createResponse();

    await contactHandler(createRequest({
      body: { ...validPayload, clientName: '<script>alert(1)</script>', projectMessage: '<img src=x onerror=alert(1)>' }
    }), res);

    assert.equal(res.statusCode, 200);
    const emailPayload = JSON.parse(capturedOptions.body);
    assert.equal(emailPayload.html.includes('<script>'), false);
    assert.equal(emailPayload.html.includes('&lt;script&gt;'), true);
    assert.equal(emailPayload.html.includes('<img src=x'), false);
    assert.equal(emailPayload.html.includes('&lt;img src=x'), true);
  });

  it('does not leak provider errors and reports upstream failures', async () => {
    global.fetch = async () => new Response(JSON.stringify({ name: 'validation_error', message: 'private provider detail' }), {
      status: 422,
      headers: { 'content-type': 'application/json' }
    });
    const res = createResponse();

    await contactHandler(createRequest(), res);

    assert.equal(res.statusCode, 502);
    assert.equal(res.body.success, false);
    assert.equal(JSON.stringify(res.body).includes('private provider detail'), false);
  });


  it('rate limits repeated submissions from the same client IP', async () => {
    const headers = {
      'content-type': 'application/json',
      'x-forwarded-for': '198.51.100.45'
    };
    const outcomes = [];

    for (let attempt = 0; attempt < 6; attempt += 1) {
      const res = createResponse();
      await contactHandler(createRequest({ headers }), res);
      outcomes.push(res.statusCode);
    }

    assert.deepEqual(outcomes, [200, 200, 200, 200, 200, 429]);
  });

  it('requires all environment variables and never calls Resend when configuration is incomplete', async () => {
    delete process.env.RESEND_API_KEY;
    delete process.env.CONTACT_TO_EMAIL;
    delete process.env.CONTACT_FROM_EMAIL;
    let fetchCalled = false;
    global.fetch = async () => { fetchCalled = true; };
    const res = createResponse();

    await contactHandler(createRequest(), res);

    assert.equal(res.statusCode, 503);
    assert.equal(res.body.success, false);
    assert.equal(fetchCalled, false);
  });
});
