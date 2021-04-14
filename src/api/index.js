
require('dotenv').config();
//For now I am leaving it just as this, but you can imagine you could use process.env || heroku URL when you all set that up

export const BASE_URL = process.env.API_URL || 'https://morning-fortress-53362.herokuapp.com/api/';



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
