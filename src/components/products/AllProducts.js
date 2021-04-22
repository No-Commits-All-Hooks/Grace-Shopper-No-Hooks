import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import SingleProduct from "./SingleProduct";
import { Paper, Button, makeStyles } from "@material-ui/core";

//search component? 



const AllProducts = ({ allProducts, userCart, setUserCart, guestCart, setGuestCart, userData, setProducts }) => {
    const history = useHistory();
    const {products}= allProducts;
   


  return (
    <main className="all-products-container">

      <div className="product-list">
        {products ? (
          products.map((product, index) => {
            return(
              <Paper>
              <SingleProduct
              key = {index}
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
              allProducts = {allProducts}
              setProducts = {setProducts}

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
