import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

import "./AllProducts.css";

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
          allProducts.map(({ id, name, imageURL }) => {
            <div key={id} className="product">
              <img src={imageURL} className="product-image" 
              onClick={()=>{
                  history.pushState(`/products/${id}`);
              }}
              />
              <h3>{name}</h3>
            </div>;
          })
        ) : (
          <h5>Completely Sold Out</h5>
        )}
      </div>
    </main>
  );
};

export default AllProducts;
