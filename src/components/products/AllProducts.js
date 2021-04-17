import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

import "./AllProducts.css";
import SingleProduct from "./SingleProduct";
import { Paper, Button, makeStyles } from "@material-ui/core";

//search component? 



const AllProducts = ({ allProducts, userCart, setUserCart, guestCart, setGuestCart, userData }) => {
    const history = useHistory();
    const {products}= allProducts;

  console.log('USERCART single product', userCart)


  return (
    <main className="all-products-container">
      <div>

      </div>
      <div className="product-list">
        {products ? (
          products.map((product) => {
            return(
              <Paper>
              <SingleProduct
              key = {product.id}
              id = {product.id }
              name= {product.name}
              price= {product.price}
              instock= {product.instock}
              imageurl= {product.imageurl}
              setUserCart= {setUserCart}
              userCart = {userCart}
              setGuestCart = {setGuestCart}
              guestCart = {guestCart}
              product = {product}
              userData = {userData}
              />
            </Paper>
            
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
