import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import "./SingleDetail.css";
import { Paper, Button, makeStyles } from "@material-ui/core";

import { addProductOrder, createOrder, updateData, deleteReview, fetchCart } from "../../api/utils";
import { Alert, AlertTitle } from '@material-ui/lab';


const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const SingleDetail = ({
  allProducts,
  userCart,
  setUserCart,
  guestCart,
  setGuestCart,
  token,
  userData,
  myOrders,
  setMyOrders,
  refreshAllProducts

}) => {
  const [quantity, setQuantity] = useState(1);
  const [myOrderProduct, setMyOrderProducts] = useState([]);

  const classes = useStyles();
  const { products } = allProducts;
  const history = useHistory();
  let { productId } = useParams();
  productId = parseInt(productId);

  const product = products
    ? products.find((product) => Number(productId) === Number(product.id))
    : null;

  console.log("productId", productId);
  console.log("USER data SINGLE DETAIL", userData);

  console.log('PRODUCT', product)
  // console.log('TOKEN SINGLE DETAIL', token)
  console.log('USER DATA SINGLE DETAIL', userData)

  // console.log('Guest Cart SINGLE DETAIL', guestCart)
  console.log("userCart single detail file", userCart);


  // find order w/ created status to later update

  // console.log('orderProducts SINGLE DETAIL', orderProducts)

const addProduct = async (product) => {

    //if no user logged in
    if (!userData.username) {
      let newProductToAdd = guestCart.find(function (product) {
        return product.id === productId;
      });
      console.log("new product to add exists", newProductToAdd);
      if (newProductToAdd) {
        newProductToAdd.quantity++;
      } else if (!newProductToAdd) {
        newProductToAdd = {
          ...product,
          quantity: Number(quantity),
        };
        console.log("new product to added ", newProductToAdd);
      }
      alert("Product Added to Cart");
      let guestCopy = [...guestCart];
      guestCopy.push(newProductToAdd);
      setGuestCart(guestCopy);

      console.log("guest cart local", guestCart);
    } 
      else if (userData && userData.username) {

      const findOrder = myOrders? myOrders.find((order) => (order.status = "created")) : null;
      console.log("ORDER FOUND:", findOrder);

      //create order for user
      if (!findOrder) {

        let newUserCart = await createOrder(token);
        console.log("New Cart created SINGLE DETAIL", newUserCart);

        const bodyProduct = {
          productId: productId,
          price: product.price,
          quantity: quantity,
        };
        
        const newOrderProduct = await addProductOrder(newUserCart.id, bodyProduct, token);

        console.log("new Order Product added to new cart SINGLE DETAIL", newOrderProduct);
        const updatedUserCart= [...userCart]
        updatedUserCart.push(newOrderProduct);
        setMyOrders(newUserCart)
        setUserCart(updatedUserCart);
        // console.log("ORDER FOUND(should be the newly created order):", myOrders);

        // console.log("user cart from new create order SINGLE DETAIL", userCart);
        alert("Product Added to Cart");
      } else {
        //if logged in and created order exists

        const body = {
          productId: productId,
          price: product.price,
          quantity: quantity,
        };

        //get orderProducts from created order
        const orderProducts = findOrder ? findOrder.products : "";

        console.log("find order being passed in addProduct:", findOrder);

        const newOrderProduct = await addProductOrder(findOrder.id,body,token);

        console.log("updated product order testing should not be undefined:", newOrderProduct);

        // let userCopy = [...userCart];
        userCart.push(newOrderProduct);
        setUserCart(userCart);

        findOrder.products.push(newOrderProduct)

        setMyOrderProducts(orderProducts)
        setMyOrders(findOrder)

        console.log("updated copy user cart:  ", userCart);
        console.log("order should be updated:  ", findOrder);


        alert("Product Added to Cart");
      }
    }
  };

  if (!product) {
    return <div></div>;
  }
  return (
    <>
      <section className="return-home-button">
        <Button
          variant="outlined"
          onClick={() => {
            history.push(`/products`);
          }}
        >
          Return to all products
        </Button>
      </section>

        <div className='single-product-card'>
            <img src={product.imageurl} className="product-image-detail" alt={product.name} />
            <section className="product-details">
             <h1 className="product-name"> {product.name} </h1>
             <div><b>${product.price}</b></div>
             <div> Description: { product.description }</div>
             <div className="product-details-buttons">
             <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={addProduct}
          >
            Add To Cart
          </Button>
          <br></br>
             <Button 
            variant="outlined"
            color="primary"
            size="small"
             onClick ={() => history.push(`/products/${productId}/review/create`)}>
               Add A Review
               </Button>
               </div>
             </section>
             <section>
               
               {product.reviews.map(review => (
                 <div>
                   <h3>{review.title}</h3>
                   <br/>
                   <br/>
                   <p>{review.content}</p>
                   <br/>
                   <h4>Rating:</h4>
                   <p>{review.stars} Stars</p>
                   <br/>
                   <Button
                     variant="outlined"
                     color="primary"
                     size="small"
                     onClick = {() => history.push(`/products/${product.id}/review/${review.id}/edit`)}
                   >Edit</Button>
                   <Button
                     variant="outlined"
                     color="primary"
                     size="small"
                     onClick = {async () => {
                       deleteReview(review.id, token)
                       await refreshAllProducts()
                      }}
                   >Delete</Button>
                 </div>
               ))}
             </section>
        </div>

      </> 

    );

};

export default SingleDetail;
