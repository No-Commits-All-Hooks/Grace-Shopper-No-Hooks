import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { fetchAllProducts, productEditor } from "../../api/utils";
import "./EditProduct.css";
 


const EditProduct = ({token, product, setEditorOpen, editorOpen, allProducts, setProducts }) => {
// Set form initial use state
const [ name, setName ] = useState(product.name);
const [ description, setDescription ] = useState(product.description);
const [ price, setPrice ] = useState(product.price);
const [ imageURL, setImageURL ] = useState(product.imageurl);
const [ category, setCategory ] = useState(product.category);
const [ inStock, setInStock] = useState(product.instock);
const [respMessage, setRespMessage] = useState('');



const handleSubmit = async () =>{   
    // Create product object to pass into createProduct

    const newProductBody = {
        name: name,
        description: description,
        price: price, 
        imageurl: imageURL,
        instock: inStock,
        category: category,
    }
    
try{

    const newProduct = await productEditor( product.id, newProductBody, token);
    if (newProduct.name === 'Error') {
       
        setRespMessage(newProduct.message);
        setActCreatorOpen(true);
        
    } else
       {
        // allProducts = fetchAllProducts();
        // setProducts(allProducts); 
        setRespMessage("Succesfully edited product!");
        setEditorOpen(false);     

    }


} catch(error) {
    error;
};

 }
    return (
        <div className="product-creator">

       

            <h1>Update Product: <span className="blue-text">{product.name}</span></h1>
            {respMessage ? <div className="error-message"> { respMessage }</div> : ''}
            <form className="activity-form">

                <div className="fieldset">
                    <label htmlFor="name">Product Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        value={name}
                        onChange={(event) => {setName(event.target.value)}}/>
                </div>

                <div className="fieldset">
                    <label htmlFor="description">Product Description*</label>
                    <textarea 
                        rows="2"
                        id="description" 
                        value={description}
                        onChange={(event) => {setDescription(event.target.value)}}/>
                </div>
                <div className="fieldset">
                    <label htmlFor="price">Product Price*</label>
                    <input 
                        type="text" 
                        id="price" 
                        value={price}
                        onChange={(event) => {setPrice(event.target.value)}}/>
                </div>
                <div className="fieldset">
                    <label htmlFor="imageURL">Product Image address*</label>
                    <input 
                        type="text" 
                        id="imageURL" 
                        value={imageURL}
                        onChange={(event) => {setImageURL(event.target.value)}}/>
                </div>
                <div className="fieldset">
                    <label htmlFor="category">Product Category</label>
                    <input 
                        type="text" 
                        id="category" 
                        value={category}
                        onChange={(event) => {setCategory(event.target.value)}}/>
                </div>


                <section>    
                <button 
                    type="submit" 
                    className="primary"
                    onClick={(event) => {
                        event.preventDefault();
                        handleSubmit(false);
                        setName('');
                        setDescription('');
                        setPrice('');
                        setImageURL('');
                        setCategory('');

                    }}>Save</button> 
                    
                <button
                    className="secondary" 
                    onClick={() => {
                    setEditorOpen(false);
                    }}>Close</button>
            </section>
      
                </form>

        </div>

      );          






};

export default EditProduct;