const helper = require('../helper');
const server = require('../server');
const supertest = require('supertest');
const { disconnect } = require('process');
const request = supertest(server);

test('basic test of getting file details', () => {
    const path = 'teleport/'
    const file = 'aaa.txt'
    
    helper.getDetails(path, file, 0).then(data => {
        expect(data).toStrictEqual({
            name: 'aaa.txt',
            size: 38,
            type: 'file',
            id: 0,
        })
    })
})

//these will only pass in a windows environment. Path validation MUST be updated when run in docker to use forward slashes instead
test('path validation test 1', () => {
    const path = '/slash/first/and/last/';
    const safePath = helper.validatePath(path);
    expect(safePath).toStrictEqual('teleport/slash/first/and/last/');
})

test('path validation test 2', () => {
    const path = 'no/slash/first/and/last';
    const safePath = helper.validatePath(path);
    expect(safePath).toStrictEqual('teleport/no/slash/first/and/last');
})

test('directory traversal', () => {
    const path = 'not/on/my/../../../watch';
    const safePath = helper.validatePath(path);
    expect(safePath).toStrictEqual('Access denied')
})

test('poison null byte', () => {
    const path = 'not/on/my/../../../../../../watch\0'
    const safePath = helper.validatePath(path);
    expect(safePath).toStrictEqual('Access denied');
})

test('reach server', async () => {
    try{
        const res = await request.get('/test');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('hello from server!')
    } catch (err) {
        console.log(err)
    }
        
})

test('bad login', async () => {
    try{
        const res = await request.post('/login').send({username: "Sam", password: "12"});
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Login failed; invalid user ID or password")
        expect(res.body.loggedIn).toBe(false);
    } catch (err) {
        console.log("error: " + err)
        expect(true).toBe(false)
    }
})

test('unauthenticated file request', async () => {
    try{
        const res = await request.post('/directory').send({path: "/directories/bin"});
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("no active user session")
    } catch (err) {
        console.log("Error: " + err)
        expect(true).toBe(false)
    }
})