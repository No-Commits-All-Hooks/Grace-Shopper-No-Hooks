import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from 'react-router-dom';

import "./SingleProduct.css";

const SingleProduct = ({ product, id, name, price, imageurl, instock, setUserCart, userCart, setGuestCart, guestCart, userData}) => {

  const addToCart = (el) => {

    if (!userData.username){ 
    guestCart.push(el);
    setGuestCart(guestCart);
    console.log("GuestCart after being set", guestCart)  
    }
    // if logged in add items to logged in users cart
  else {
    
    userCart.push(el);
    setUserCart(userCart);
    console.log("userCart after being set", userCart);
    }  
  };
  // console.log("anything in guestCart", guestCart)  
  // console.log("anything in userCart", userCart)
  
  

  const history = useHistory();
  
  if (!instock){
    return null 
  }
  return (
    <div className="product-card">
    <div className="product-image">
    <Link to={`/products/${id}`}><img src={imageurl} className="product-image" alt={name}/></Link>
    </div>
    <div className="product-header-container">
      <h2>{name}</h2>
    </div>
    <div className="product-price">${price}</div>
    <div><button onClick={() => addToCart(product)}>Add To Cart</button></div>

    </div>
  );
};

export default SingleProduct;
