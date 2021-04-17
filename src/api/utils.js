
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