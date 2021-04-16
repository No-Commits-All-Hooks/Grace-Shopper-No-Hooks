
//If you create a function that can be used accross components, please put in here. 

import { callApi } from "./index";

// Fetch user data
export const fetchUserData = async (token) => {
    try {
        const data = await callApi({
            url: 'users/me',
            token: token
        });
        console.log('FETCHUSERDATA', data)
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


  export const fetchCart = async (token) => {
    try {
        const data = await callApi({
          url: `orders/cart`,  
          token       
        });

        return data;
    } catch(error) {
        console.error(error);
    };
  };

  export const createOrder = async (token) =>{
      const tokenCheck = token? token : null
      try{
          const data = await callApi({
              url: '/orders',
              method: 'POST',
              token: tokenCheck
          })
          return data
      } catch(error){
        console.error(error);

      }
  }

export const fetchUserOrders = async (userId, token) => {
    try {const userOrders = await callApi({
      url: `users/${userId}/orders`,
      token,
    });

    console.log('USERORDERS IN FETCH', userOrders)
    return userOrders;
} catch (error){
    console.error(error);
}
  };


  export const addProductOrder = async (orderId, body, token) => {
    try {
      const newOrderProduct = await callApi({
        url: `orders/${orderId}/products`,
        method: 'POST',
        body: body,
        token: token,
      });
      return newOrderProduct;
    } catch(error) {
      console.error(error);
    };
  };

 