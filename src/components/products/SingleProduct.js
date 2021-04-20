import { Call } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import { callApi } from "../../api";
import { Button } from "@material-ui/core";

import "./SingleProduct.css";

const SingleProduct = ({
  id,
  name,
  price,
  imageurl,
  instock,
}) => {

 
  if (!instock) {
    return null;
  }
  return (
    <div className="product-card">
      <div className="product-image">
        <Link to={`/products/${id}`}>
          <img src={imageurl} className="product-image" alt={name} />
        </Link>
      </div>
      <div className="product-card-detail">
      <div className="product-header-container">
      <Link to={`/products/${id}`} style={{ textDecoration: 'none' }}>
        {name}
      </Link>
      </div>
      <div className="product-price">${price}</div>
      </div>
    </div>
  );
};

export default SingleProduct;
