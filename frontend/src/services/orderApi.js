import axios from 'axios';

const orderApi = axios.create({
  baseURL: 'http://localhost:5000/api/orders',
});

export default orderApi;
