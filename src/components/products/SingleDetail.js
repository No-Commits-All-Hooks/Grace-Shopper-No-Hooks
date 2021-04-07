import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import "./SingleDetail.css";


const SingleDetail = ({products}) => {

const {allProducts} = products;

const history= useHistory()
const {productId} = useParams();
const product = allProducts? allProducts.find((product) => Number(productId) === Number(product.id)) : null ;

// console.log("Allproduct:", allProducts);
// console.log("product:", product);


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
             </section>
        </div>
        </>
    )
}

export default SingleDetail;