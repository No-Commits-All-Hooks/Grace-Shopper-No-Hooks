import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

import "./AllProducts.css";
import SingleProduct from "./SingleProduct";

//search component? 

const AllProducts = ({ allProducts }) => {
    const history = useHistory();


  return (
    <main id="all-products-container">
      <div>
        <h1>Still need to add some stuff in here for All Products</h1>
      </div>
      <div className="product-list">
        {allProducts ? (
          allProducts.map((product) => {
// use SingleProduct component to show product details
            return(
              <SingleProduct
              key = {product.id}
              id = {product.id }
              name= {product.name}
              description= {product.description}
              price= {product.price}
              instock= {product.instock}
              imgURL= {product.imageurl}

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
