import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { callApi } from "../../api";

const SingleOrder = ({cart, SetCart, orderId})=> {

    //This function will be called when adding items to cart
    const addToCart = (el) => {
          SetCart([...cart], el);  
    };
       
}



export default SingleOrder; 