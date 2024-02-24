const {app} = require('../src/app');
const request = require("supertest");

describe('GET /task', () => {
    test('should respond whit a 200 status code', async() => {
        const response = await request(app).get('/task').send();
        // console.log(response);
        expect(response.statusCode).toBe(200);
    });
    test('should respond whit an array', async()=>{
        const response = await request(app).get('/task').send();
        expect(response.body).toBeInstanceOf(Array);
    });
});

describe('GET /api/v1/associates', () => {
    test('should respond whit a 200 status code', async() => {
        const response = await request(app).get('/api/v1/associates').send();
        expect(response.statusCode).toBe(200);
        // console.log(response);
    });
    // test('should respond whit an array', async()=>{
    //     const response = await request(app.app).get('/task').send();
    //     expect(response.body).toBeInstanceOf(Array);
    // });
});

describe('GET /api/v1/characters', () => {
    test('should respond whit a 200 status code', async() => {
        const response = await request(app).get('/api/v1/characters').send();
        // console.log(response);
        expect(response.statusCode).toBe(200);
    });
    test('should have a content-type : application/json', async()=>{
        const response = await request(app).get('/api/v1/characters').send();
        expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("json")
        );
    });
});

describe('POST /api/v1/characters', () => {
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
    test('should respond whit a 200 status code', async() => {
        const response = await request(app).post('/api/v1/characters').send(testContact);
        // console.log(response);
        expect(response.statusCode).toBe(201);
    });
    test('should have a content-type : application/json in headers', async()=>{
        const response = await request(app).post('/api/v1/characters').send(testContact);
        expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("json")
        );
    });
});

describe('GET /api/v1/locations', () => {
    test('should respond whit a 200 status code', async() => {
        const response = await request(app).get('/api/v1/locations').send();
        // console.log(response);
        expect(response.statusCode).toBe(200);
    });
    // test('should respond whit an array', async()=>{
    //     const response = await request(app.app).get('/task').send();
    //     expect(response.body).toBeInstanceOf(Array);
    // });
});

// describe('POST /api/v1/locations', () => {
//     test('should respond whit a 200 status code', async() => {
//         const response = await request(app).post('/api/v1/locations').send();
//         // console.log(response);
//         expect(response.statusCode).toBe(200);
//     });
//     // test('should respond whit an array', async()=>{
//     //     const response = await request(app.app).get('/task').send();
//     //     expect(response.body).toBeInstanceOf(Array);
//     // });
// });