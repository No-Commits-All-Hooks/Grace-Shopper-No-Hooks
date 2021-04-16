import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import "./SingleDetail.css";
import { Paper, Button, makeStyles } from "@material-ui/core";
import { addProductOrder } from '../../api/utils';



const SingleDetail = ({allProducts, cart, setCart, token, userData}) => {

const {products} = allProducts;

const history= useHistory()
const {productId} = useParams();
const product = products? products.find((product) => Number(productId) === Number(product.id)) : null ;

console.log('TOKEN SINGLE DETAIL', token)


  if (!product){
      return <div></div>
  } 
  return (
      <>
        <section className="return-home-button">
        <button
      onClick = {() =>{
          history.push(`/products`)
      }}
      >Return to all products</button> 
        </section>
        <div className='single-product-card'>
            <img src={product.imageurl} className="product-image" alt={product.name}/>
            <section className="product-details">
             <h1> {product.name} </h1>
             <div>Price : ${product.price}</div>
             <div> Description: { product.description }</div>
            <Button 
                variant="contained"
                color="gray"
                size="small"

            onClick={()=> addToCart(product)}>Add To Cart</Button>
             </section>
        </div>
        </>
    )
}

export default SingleDetail;