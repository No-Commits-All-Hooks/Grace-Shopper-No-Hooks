import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import SingleProduct from "./SingleProduct";
import { Paper, Button, makeStyles } from "@material-ui/core";
import "./SingleProduct.css";


const ManageProducts = ({ allProducts, userData }) => {
const {products} = allProducts; 
const history = useHistory(); 

return (
  <main className="all-products-container">

      <section className="admin-buttons">
      <div>Manage Product Page</div>
     <Button 
            variant="outlined"
            color="primary"
            size="small"
             onClick ={() => history.push(`/admin`)}>
               Admin Page
               </Button>
               <Button 
            variant="outlined"
            color="primary"
            size="small"
             onClick ={() => history.push(`/manageproducts`)}>
               Add Products
               </Button>    
     </section>          
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
export default ManageProducts; 