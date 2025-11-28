import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api-maatramkk360.onrender.com/api',
});

export default api;
