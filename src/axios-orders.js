import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burgerbuilder-ddfaa.firebaseio.com/'
});

export default instance;