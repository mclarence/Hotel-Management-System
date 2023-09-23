import axios from 'axios';
import startServer from "./startServer";

beforeAll(() => {
  axios.defaults.baseURL = 'http://localhost:3333';
  return startServer();
})
describe('GET /', () => {
  it('should return a message', async () => {
    const res = await axios.get(`/api`);

    expect(res.status).toBe(200);
  });
});
