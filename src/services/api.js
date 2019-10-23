import axios from 'axios';


const api = axios.create({
    baseURL: 'http://192.168.0.105/camara-backend/app',
    responseEncoding: 'utf8'
});

export default api;