import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from 'react-router-dom';
import "./SingleProduct.css";

const SingleProduct = ({ id, name, price, imageurl, instock }) => {
  const [cart, setCart] = useState([]);

  const history = useHistory();

  if (!instock){
    return null 
  }

  const handleClick = () => {
    let currentProduct = {
      id: {id},
      name: {name},
      price: {price},
      imageurl: {imageurl},
      instock: {instock}
    }
    setCart([...cart, currentProduct]);
    console.log(cart);
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
    <button onClick={() => {handleClick()}}>Add To Cart</button>
    <div className="product-image">
    </div>
    </div>
  );
};

export default SingleProduct;
