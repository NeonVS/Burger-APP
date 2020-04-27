import axios from 'axios';

const instance =axios.create({
    baseURL:'https://burger-app-6c70b.firebaseio.com/'
});

export default instance;