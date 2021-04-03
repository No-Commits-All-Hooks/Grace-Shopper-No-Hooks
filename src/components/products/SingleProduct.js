import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";

import "./SingleProduct.css";

const SingleProduct = ({ allProducts }) => {

  const history = useHistory();
  const { productId } = useParams();
  const product = allProducts.find((product) => productId === product._id);

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.imageURL} className="image-size" alt={product.name} />
      </div>
      <div className="product-header-container">
        <h2>{product.name}</h2>
      </div>
      <div className="product-description">Description: {description}</div>
      <div className="product-price">{product.price}</div>
      <div className="product-stock">{product.inStock}</div>
      <button
      onClick = {() =>{
          history.push(`/products`)
      }}
      >Return to all products</button>
    </div>
  );
};

export default SingleProduct;
