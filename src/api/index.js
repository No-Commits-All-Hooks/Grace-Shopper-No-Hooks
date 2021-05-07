
require('dotenv').config();
//when you want to go live
export const BASE_URL = process.env.API_URL || 'http://localhost:5000/api/'; //when you want to go live


// 'http://localhost:5000/api/' use this if you want to go local

export const callApi = async ({ url, method, token, body }) => {
  console.log('callApi: ', { url, method, token, body });
  try {
    const options = {
      method: method ? method.toUpperCase() : 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
    // console.log('CALL API request url: ', BASE_URL + url);
    // console.log('CALL API options: ', options);
    const response = await fetch(BASE_URL + url, options);
    const data = await response.json();
 
    if (data.error) throw data.error;
    return data;
  } catch (error) {
    console.error('ERROR: ', error);
    // alert( `Error: ${error}`);
    return error;
  }
};
