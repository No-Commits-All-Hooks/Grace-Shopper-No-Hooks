// export const BASE_URL = 'YOUR WORKING HEROKU URL HERE'

//For now I am leaving it just as this, but you can imagine you could use process.env || heroku URL when you all set that up
export const BASE_URL = 'http://localhost:5000/api/';

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
    console.log('request url: ', BASE_URL + url);
    console.log('options: ', options);
    const response = await fetch(BASE_URL + url, options);
    const data = await response.json();
    console.log('data: ', data);
    if (data.error) throw data.error;
    return data;
  } catch (error) {
    console.error('ERROR: ', error);
  }
};
