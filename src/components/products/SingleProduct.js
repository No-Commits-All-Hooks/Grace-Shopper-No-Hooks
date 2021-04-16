import { Call } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from 'react-router-dom';
import { callApi } from "../../api";

import "./SingleProduct.css";

const SingleProduct = ({ product, id, name, price, imageurl, instock, setUserCart, userCart, setGuestCart, guestCart, userData, setUseData}) => {
let [newProducts, setNewProducts]= useState([])

//   console.log('USERCART single product', userCart)

  const addToCart = (el) => {
    if (!userData.username){ 
    guestCart.push(el);
    setGuestCart(guestCart);
    console.log("GuestCart after being set", guestCart)  
    }
    // if logged in add items to logged in users cart
  else {

    // if (!userCart.products <0 ){
    //   newProducts = await createOrder

    // }
    let { products } = userCart;
      newProducts= products.push(el);

     console.log('products single product', products)

    //  console.log('newProducts single product', newProducts)
    const orderId= userCart.id
    console.log('orderId single product', orderId)

    setNewProducts([...products, newProducts]);
    
    // setUserCart([...userCart])

    }  
  };


  
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
    <div><button onClick={()=> addToCart(product)}>Add To Cart</button></div>

    </div>
  );
};

export default SingleProduct;
 