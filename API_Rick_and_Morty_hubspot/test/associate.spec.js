const {app} = require('../src/app');
const request = require("supertest");

describe('GET /api/v1/associates', () => {
    test('should respond whit a 200 status code', async() => {
        const response = await request(app).get('/api/v1/associates').send();
        expect(response.statusCode).toBe(200);
    }, 30000);
});
