import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

import "./AllProducts.css";
import SingleProduct from "./SingleProduct";

//search component? 

const AllProducts = ({ products, orders }) => {
    const history = useHistory();
    const {allProducts}= products;



  return (
    <main id="all-products-container">
      <div>
        <h1>Still need to add some stuff in here for All Products</h1>
      </div>
      <div className="product-list">
        {allProducts ? (
          allProducts.map((product) => {
            return(
              <SingleProduct
              key = {product.id}
              id = {product.id }
              name= {product.name}
              price= {product.price}
              instock= {product.instock}
              imageurl= {product.imageurl}

              />
            )
          })
        ) : (
          <h5>Completely Sold Out!</h5>
        )}
      </div>
    </main>
  );
};

export default AllProducts;
