import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from 'react-router-dom';

import "./SingleProduct.css";

const SingleProduct = ({ product, id, name, price, imageurl, instock, userCart, setUserCart, setGuestCart, guestCart}) => {

  const addToCart = (el) => {
    // if no user add items to guest cart
    if(!user.data){ 
    guestCart.push(el);
    setGuestCart(guestCart);
    }
    // if logged in add items to logged in users cart
  else{

    userCart.push(el);
    setGuestCart(userCart);


  }  
  };
  console.log("anything in guestCart", guestCart)  
  console.log("anything in userCart", userCart)
  
  console.log("anyhting in product", product)   
  

  const history = useHistory();
  
  if (!instock){
    return null 
  }
  return (
    <div className="product-card">
    <div className="product-image">
    <Link to={`/product/${id}`}><img src={imageurl} className="product-image" alt={name}/></Link>
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
