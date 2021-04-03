mport React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';


import './SingleProduct.css';

const SingleProduct = ({id, name, description, price, imageurl, instock, category}) => {


 return (
     <div className="product-card">

         <div className="product-header-container">
            <h2>{name}</h2>
        </div>
        <div className="product-description">
            {description}
        </div>
        <div className="product-price">


        {price}    
        </div>   
        <div className="product-image">

        <img src={imageurl} className="image-size" alt={name}/>    
        </div> 
        <div className="product-stock">
           {instock} 
        </div>


    </div>

 )   



};



export default SingleProduct;
