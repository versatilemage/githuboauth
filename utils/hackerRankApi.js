import axios from 'axios';

const BASE_URL = 'https://www.hackerrank.com/rest';
  
export const getUserInfo = async({username}) => {
    const response = await axios.get(`${BASE_URL}/users/${username}`);
    return response.data.model;
}
