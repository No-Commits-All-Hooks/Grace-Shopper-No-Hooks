import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import SingleProduct from "./SingleProduct";
import { Paper, Button, makeStyles } from "@material-ui/core";
import "./SingleProduct.css";
import {fetchAllProducts} from "../../api/utils"
import { LeakAddTwoTone } from "@material-ui/icons";


const ManageProducts = ({ allProducts, userData, setProducts }) => {

const history = useHistory(); 
const [ editorOpen, setEditorOpen ] = useState(false);
const [ prodCreatorOpen, setProdCreatorOpen ] = useState(false);  



  let {products} = allProducts;

  useEffect(async () => {
     products = await fetchAllProducts();
    if (products) {
      setProducts(products);
    }


  }, [prodCreatorOpen]);



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
            onClick={() => {
              setProdCreatorOpen(true);
              }}>
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
            userData = {userData}
            editorOpen = {editorOpen}
            setEditorOpen = {setEditorOpen}
            allProducts = {allProducts}
            setProducts = {setProducts}
            product = {product}
            />
          </Paper>
          
          )
        })
      ) : (
        <h5>Are you an admin?</h5>
      )}
     {prodCreatorOpen
            ? <div>

              Show me a form to add a product
                </div> 
            : ''
            }

            


    </div>
  </main>
);
    


};
export default ManageProducts; 