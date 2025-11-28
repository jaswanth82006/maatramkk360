import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api-maatramkk360.vercel.app/api',
});

export default api;
