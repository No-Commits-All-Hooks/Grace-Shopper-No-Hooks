import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from 'react-router-dom';
import "./SingleProduct.css";

const SingleProduct = ({ id, name, description, price, imageurl, instock }) => {

  const history = useHistory();
  // const { productId } = useParams();
  // const product = allProducts.find((product) => productId === product._id);

  return (
    <div className="product-card">
      <div className="product-image">
      <Link to={`/products/${id}`}><img src={imageurl} className="product-image" alt={name}/></Link>
      </div>
      <div className="product-header-container">
        <h2>{name}</h2>
      </div>
      <div className="product-description">Description: {description}</div>
      <div className="product-price">{price}</div>
      <div className="product-stock">{instock}</div>
      <div className="product-image">
      </div>
      <section className="button-actions">
      {/* <button
      onClick = {() =>{
          history.push(`/products`)
      }}
      >Return to all products</button> */}
    </section>
      
    </div>
  );
};

export default SingleProduct;
