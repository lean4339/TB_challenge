const chai = require('chai');
const { expect } = chai;
const chaiHttp = require('chai-http');
chai.use(chaiHttp)
const app = require('../index');
describe('App Status', async () => {
  it('should return 200 OK on GET /', async () => {
    const res = await chai.request(app).get('/files/data');
    expect(res).to.have.status(200);
  }).timeout(5000);
  it('should return 404 not found on GET /', async () => {
    const res = await chai.request(app).get('/pepe');
    expect(res).to.have.status(404);
    expect(res.body).to.have.property('error').equals('not found');
  }).timeout(5000);

  it('should return an array of objects with specific properties on GET /files/data', async () => {
    const res = await chai.request(app).get('/files/data');
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    const expectedProperties = ['file', 'lines'];
    res.body.forEach(obj => {
      expect(obj).to.include.keys(expectedProperties);
    });
  }).timeout(100000);

  it('should return a error message on GET query is not on the list', async () => {
    const res = await chai.request(app).get('/files/data?filename=pepe');
    expect(res).to.have.status(404);
    expect(res.body).to.have.property('error').equals('not found');
 

  }).timeout(100000);
  it('should return a error message on GET query is not on the list', async () => {
    const res = await chai.request(app).get('/files/data?fileName=test18.csv');
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    const expectedProperties = ['file', 'lines'];
    res.body.forEach(obj => {
      expect(obj).to.include.keys(expectedProperties);
    });
  }).timeout(100000);
  it('should return a list GET a files/list', async () => {
    const res = await chai.request(app).get('/files/list');
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
  }).timeout(100000);
});