import { Call } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import { callApi } from "../../api";
import { Button } from "@material-ui/core";
import EditProduct from "../products/EditProduct";
import { fetchAllProducts } from "../../api/utils";
import "./SingleProduct.css";

const SingleProduct = ({
  id,
  name,
  price,
  imageurl,
  instock,
  setUserCart,
  userCart,
  setGuestCart,
  guestCart,
  userData,
  setUserData,
  setProducts,
  allProducts,
  product
 
}) => {
  let [newProducts, setNewProducts] = useState([]);
  let {products} = allProducts;

  
  // this is how we open the editor
  const [ editorOpen, setEditorOpen ] = useState(false);
  const history = useHistory();
  //   console.log('USERCART single product', userCart)

  useEffect(async () => {
    products = await fetchAllProducts();
   if (products) {
     setProducts(products);
   }


 }, [editorOpen]);



 
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

      {editorOpen
            ? <EditProduct
                product = {product}
                setEditorOpen = {setEditorOpen} 
                editorOpen = {editorOpen}
                allProducts = {allProducts}
                setProducts = {setProducts}
                />
            : ''
            }

      {userData.isAdmin?
      <section>
      <Button 
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => {
              setEditorOpen(true);
              }}>
               Edit Product
               </Button>
               <Button 
            variant="outlined"
            color="primary"
            size="small"
             onClick ={() => history.push(`/products/${productId}/review/create`)}>
               Delete Product
               </Button>
       

      </section> : "" }
      </div>
    </div>
  );
};

export default SingleProduct;
