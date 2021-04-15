
//If you create a function that can be used accross components, please put in here. 

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

export const fetchAllProducts = async () => {
    const data = await callApi({
      url: "products",
    });
    return data;
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
        console.log('addToOrder',data)

        return data;

    } catch(error) {
        console.error(error);
    };
  };


  export const fetchCart = async () => {
    try {
        const data = await callApi({
          url: `/orders/carts`,         
        });
        console.log('FETCHCART DATA',data)

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


 