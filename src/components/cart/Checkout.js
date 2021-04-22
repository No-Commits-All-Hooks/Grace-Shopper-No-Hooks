import React from "react";
import StripeCheckout from "react-stripe-checkout";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { Paper, Button, makeStyles } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { callApi } from "../../api";
import Cart from "./Cart";
import CartCard from "./CartCard";

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


const Checkout = ({myOrders,  userCart, setUserCart, guestCart, setGuestCart, token }) => {
const classes = useStyles();
const history = useHistory()

  console.log("guestCart:", guestCart);
  console.log('myOrders in cart', myOrders)
  console.log("userCart:", userCart);


const cartTotal = ()=>{
  if (userCart&& userCart.length>0){
  const userCartTotal= userCart.map(({price, quantity})=>{
      return Number(price) * Number(quantity)
    })
    const newTotal= userCartTotal.reduce((results, value) => {
        const corrertFormat= Number(results) + Number(value)
         return corrertFormat.toFixed(2)
        });
    return newTotal
  } else if (guestCart && guestCart.length>0){
     const guestCartTotal= guestCart.map(({price,quantity })=>{
      return (Number(price) *Number(quantity))
       
    })
    const newTotal= guestCartTotal.reduce((results, value) => {
      const corrertFormat= Number(results) + Number(value)
      return corrertFormat.toFixed(2)
        });
    console.log('inside cart function total', newTotal)
    return newTotal 
  }
}

const cancelOrder= async()=>{
    if (token) {
        userCart= []
        setUserCart(userCart)
        alert('Order Cancelled!')
        history.push('/')

    } else {
        localStorage.setItem("guestCart", JSON.stringify([]));
        setGuestCart([])
        alert('Order Cancelled!')
        history.push('/')
    }
}

  return (
    <div className="checkout-container">
        <h1>Checkout</h1>
      <CartCard
      myOrders= {myOrders}
       userCart={userCart}
       setUserCart={setUserCart}
       guestCart={guestCart}
       setGuestCart={setGuestCart}
       token={token}
      />
      { userCart.length>0 || guestCart.length>0 ?  
      (
      <div className="cart-checkout">
        <h2>Final Total: ${cartTotal()}</h2>
       { console.log('checkout  total', cartTotal())}
       <StripeCheckout token={onToken(100* cartTotal())} stripeKey={STRIPE_KEY} name="Fullstack Academy Shop" amount={100* cartTotal()} currency={CURRENCY} shippingAddress />
       <Button
                size="small"
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={cancelOrder}
>
                Cancel Order 
              </Button>
            </div>
        
      ): ""}
    </div>
  );
};



export default Checkout;
