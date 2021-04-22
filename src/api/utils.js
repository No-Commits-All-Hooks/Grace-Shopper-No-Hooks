
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


export const fetchReviews = async (productId, token) => {
    try {
        const data = await callApi({
            url: `/products/${productId}`,
            token: token
        });

        return data;
    } catch(error) {
        console.error(error);
    }
}

export const createReview = async (title, content, stars, productId, token) => {
    try {
        const data = await callApi({
            url: `/products/${productId}/review/create`,
            method: 'POST',
            body: {
                title,
                content,
                stars
            },
            token: token
        });

        return data;
    } catch(error) {
        console.error(error);
    }
}

export const updateReview = async (reviewId, title, content, stars, token) => {
    try {
        const data = await callApi({
            url: `/products/review/${reviewId}/edit`,
            method: 'PATCH',
            body: {
                id: reviewId,
                title,
                content,
                stars
            },
            token: token
        });

        return data;
    } catch(error) {
        console.error(error);
    }
}

export const deleteReview = async (reviewId, token) => {
    try {
        const data = await callApi({
            url: `/products/review/${reviewId}/delete`,
            method: 'DELETE',
            token: token
        });

        return data;
    } catch(error) {
        console.error(error);
    }
}



export const fetchAllProducts = async () => {
    const data = await callApi({
      url: "products",
    });
    return data;
  };


  export const fetchCart = async (token) => {
    try {
        const data = await callApi({
          url: `orders/cart`,  
          token       
        });
        console.log('Fetch cart data in utils', data)

        return data;
    } catch(error) {
        console.error(error);
    };

  }



  export const createOrder = async (token) =>{
      try{
          const data = await callApi({
              url: 'orders',
              method: "POST",
              token:token,
          })
          return data
      } catch(error){
        console.error(error);

      }
  };

export const fetchUserOrders = async (userId, token) => {
    try {
        const userOrders = await callApi({
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

export const updateProductOrder= async (orderProductsId, body, token ) =>{
    const data = await callApi({
      url: `order_products/${orderProductsId}`,
      method: "PATCH",
      body: body,
      token: token,
  });
  console.log("data return from utils update", data)
  return data
}

export const fetchAllUsers = async (token) => {
  const allUsers = await callApi({
    url: "users",
    token
  });
  return allUsers;
};

export const fetchAllOrders = async (token) => {
  const allOrders = await callApi({
    url: "orders",
    token
  });
  return allOrders;
};


export const createProduct = async (body, token) => {
  try {
    const newProduct = await callApi({
      url: "product",
      method: "POST",
      body: body,
      token: token,
    });

    return newProduct;
  } catch (error) {
    console.error(error);
  }
};

export const productEditor = async (productId, body) => {
  try {
    const data = await callApi({
      url: `products/${productId}`,
      method: 'PATCH',
      body: body,
    });
    return data;

  } catch(error) {
    console.error(error);
  };
};
