
//If you create a function that can be sused accross components, please put in here. 
import { callApi } from "./index";

// Fetch user data
export const fetchUserData = async (token) => {
    try {
        const data = await callApi({
            url: 'users/me',
            token: token
        });

        return data;
    } catch(error) {
        console.error(error);
    };
};
