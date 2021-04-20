import React from "react";
// import { callApi } from '../api/index';
import { useHistory, useParams } from "react-router-dom";
import "./Cart.css";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import { Paper, Button, makeStyles } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { callApi } from "../../api";
import { render } from "react-dom";
// import { deleteOrderProduct } from "../../api/utils";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    width: 100,
  },
}));

const STRIPE_KEY =
  "pk_test_51IftLtA9MPKzljzeSceH92fVneV3gu5NgdPP9ZEspdbi0qhxtRIypP37KO2e2ozpXwoswdPKRpfaTKYqk2vidPhR00u0MPhNrs";
const PAYMENT_URL = "http://localhost:5000/api/pay";
const CURRENCY = "USD";

const onToken = (amount) => async (token) => {
  console.log("Token is: ", token);
  try {
    const response = await axios.post(PAYMENT_URL, {
      source: token.id,
      currency: CURRENCY,
      amount,
    });
    console.log("Success!", response);
  } catch (error) {
    console.error(error);
  }
};


const Cart = ({myOrders,  userCart, setUserCart, guestCart, setGuestCart, token }) => {
const classes = useStyles();
const history = useHistory()

  console.log("userCart cart file:", userCart);
  console.log("guestCart:", guestCart);
  console.log('myOrders in cart', myOrders)

// const findCreatedOrder= myOrders? myOrders.find((order) => order.status = 'created') : null;
// const {products}= findCreatedOrder? findCreatedOrder : null
// console.log('findOrder products in cart', products)

const cartTotal = ()=>{

  if (userCart&& userCart.length>0){
  const userCartTotal= userCart.map(({price})=>{
      return Number(price)
    })
    const newTotal= userCartTotal.reduce((results, value) => {

      return Number(results) + Number(value)
        });
    return newTotal
  } else if (guestCart && guestCart.length>0){
     const guestCartTotal= guestCart.map(({price})=>{
      return (Number(price))
       
    })
    const newTotal= guestCartTotal.reduce((results, value) => {
      return Number(results) + Number(value)
    });
    console.log('inside cart function total', newTotal)
    return newTotal 
  }
}


  const removeOrderProduct = async (productId)=>{

    // const findCreatedOrder= myOrders? myOrders.find((order) => order.status = 'created') : null;
    // const {products}= findCreatedOrder? findCreatedOrder : null
    // console.log('findOrder products in cart', products)

    const data = await callApi ({
      url: `order_products/${productId}`,
      token: token, 
      method: 'DELETE'
    });
    const findUpdatedProducts= userCart.filter((product)=>{
      return product.id !== productId
    })
    alert("Product Deleted!");
   history.push("/cart");
   setUserCart(userCart);
    setGuestCart([...guestCart])
    history.push("/");


    console.log('data delete', data)

  }

  return (
    <div className="cart-container">

      {userCart && userCart.length> 0? (
        userCart.map((product, index) => {
          return (
            <div className="each-product-cart" key={index}>
              <img src={product.imageurl} width="150px" height="150px" />
              <h3>{product.name}</h3>
              <h4>${product.price}</h4>
              <h4>Quantity: {product.quantity}</h4>
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                className={classes.button}
                startIcon={<DeleteIcon />}
                onClick = {()=> removeOrderProduct(product.productId)}
              >
                Remove
              </Button>
            </div>
          );
        })
      ) : (
        ""
      )}
      {guestCart.length> 0? (
        guestCart.map(({id, imageurl, name, price, quantity,productId}) =>{
          return (
            <div className="each-product-cart" key={id}>
              <img src={imageurl} width="150px" height="150px" />
              <h3>{name}</h3>
              <h4>${price}</h4>
              <h4>Quantity:{quantity}</h4>
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                className={classes.button}
                startIcon={<DeleteIcon />}
                onClick = {()=> removeOrderProduct(productId)}
              >
                Remove
              </Button>
            </div>
          )
        })

      ) : ""}
      { userCart.length>0 || guestCart.length>0 ?  
      (
      <div className="cart-checkout">
        <h2>Total: ${cartTotal()}</h2>
       { console.log('checkout  total', cartTotal())}
       <StripeCheckout token={onToken(100* cartTotal())} stripeKey={STRIPE_KEY} name="Fullstack Academy Shop" amount={100* cartTotal()} currency={CURRENCY} shippingAddress />
            </div>
        
      ): ""}
    </div>
  );
};



export default Cart;
