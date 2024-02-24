const {app} = require('../src/app');
const request = require("supertest");

describe('GET /api/v1/characters', () => {
    test('should respond whit a 200 status code', async() => {
        const response = await request(app).get('/api/v1/characters').send();
        expect(response.statusCode).toBe(200);
    });
    test('should have a content-type : application/json', async()=>{
        const response = await request(app).get('/api/v1/characters').send();
        expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("json")
        );
    });
});

describe('GET /api/v1/characters/create', () => {
    test('should respond whit a 200 status code', async() => {
        const response = await request(app).get('/api/v1/characters/create').send();
        expect(response.statusCode).toBe(200);
    });
    test('should have a content-type : application/json', async()=>{
        const response = await request(app).get('/api/v1/characters/create').send();
        expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("json")
        );
    });
});

describe('POST /api/v1/characters', () => {
    describe('When send a correct file format',()=>{
        const testContact = {
            "properties":{
                "character_id": "0",
                "firstname": "test firtsname",
                "lastname": "test lastname",
                "status_character": "test status",
                "character_species": "test species",
                "character_gender": "test gender",
            }
        };
        test('should respond whit a 201 status code', async() => {
            const response = await request(app).post('/api/v1/characters').send(testContact);
            // console.log(response);
            expect(response.statusCode).toBe(201);
        });
        test('should have a content-type : application/json in headers', async()=>{
            const response = await request(app).post('/api/v1/characters').send(testContact);
            expect(response.headers["content-type"]).toEqual(
                expect.stringContaining("application/json")
            );
        });
        test('should respond whit an data', async()=>{
            const response = await request(app).post('/api/v1/characters').send(testContact);
            expect(response.body.data).toBeDefined();
        });
    });

    describe('When send an empty file or incorrect format',()=>{
        test('should respond whit a 400 status code', async() => {
            const response = await request(app).post('/api/v1/characters').send();
            expect(response.statusCode).toBe(400);
        });
    });
});
