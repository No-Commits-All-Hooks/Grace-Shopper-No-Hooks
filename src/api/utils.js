
//If you create a function that can be used accross components, please put in here. 
import { SettingsApplicationsRounded } from "@material-ui/icons";
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

//this will add products to an order
export const addToOrder = async (orderId, body, token) => {
    try {
        const data = await callApi({
          url: `orders/${orderId}/products`,
          method: 'POST',
          body: body,
          token: token
        });
  
        return data;
    } catch(error) {
        console.error(error);
    };
  };


  export const fetchCart = async (token) => {
    try {
        const data = await callApi({
          url: `orders/carts`,
         token
        });
        return data;
    } catch(error) {
        console.error(error);
    };
  };

export const fetchUserOrders = async (userId, token) => {
    try {const userOrders = await callApi({
      url: `users/${userId}/orders`,
      token,
    });
    return userOrders;
} catch (error){
    console.error(error);
}
  };