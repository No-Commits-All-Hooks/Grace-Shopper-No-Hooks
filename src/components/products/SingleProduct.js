import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from 'react-router-dom';
import "./SingleProduct.css";

const SingleProduct = ({ id, name, price, imageurl, instock }) => {
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
    <div className="product-image">
    </div>
    </div>
  );
};

export default SingleProduct;
