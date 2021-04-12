import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { callApi } from "../../api";

const SingleOrder = ({cart, SetCart, orderId, userData})=> {

    //This function will be called when adding items to cart
    const addToCart = (el) => {
          SetCart([...cart], el);  
    };

//if person is logged in get their order

//if person is a guest display whats in the cart
//iterate over cart array and display product by searching by id


return (
    {userData.username  }


)




       
}





export default SingleOrder; 