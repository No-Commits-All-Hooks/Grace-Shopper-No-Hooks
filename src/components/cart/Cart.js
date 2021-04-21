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
import { updateProductOrder } from "../../api/utils";

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

  console.log("guestCart:", guestCart);
  console.log('myOrders in cart', myOrders)

const cartTotal = ()=>{
  if (userCart&& userCart.length>0){
  const userCartTotal= userCart.map(({price, quantity})=>{
      return Number(price) * Number(quantity)
    })
    const newTotal= userCartTotal.reduce((results, value) => {

      return Number(results) + Number(value)
        });
    return newTotal
  } else if (guestCart && guestCart.length>0){
     const guestCartTotal= guestCart.map(({price,quantity })=>{
      return (Number(price) *Number(quantity))
       
    })
    const newTotal= guestCartTotal.reduce((results, value) => {
      return Number(results) + Number(value)
    });
    console.log('inside cart function total', newTotal)
    return newTotal 
  }
}

const updateQuantity= async (product, newQuantity)=>{

  console.log('product, event', newQuantity)
      if (token){
      const body={
        price: product.price,
        quantity: Number(newQuantity),
      }
      const data= await updateProductOrder(product.id, body, token)
      console.log(data);
    } else {
      const updatedGuestCart= [...guestCart]
      const orderProduct = updatedGuestCart.find((p) => {return p.id === product.id});
      orderProduct.quantity= Number(newQuantity)

      console.log('orderProduct inside quant', orderProduct)

      setGuestCart(updatedGuestCart)
      console.log('updated quantitity product', guestCart);
    }
}


  const removeOrderProduct = async (event)=>{
    console.log('event ', event )

    if (token){
    const data = await callApi ({
      url: `order_products/${event.id}`,
      token: token, 
      method: 'DELETE'
    });
    alert("Product Deleted!");
 console.log('data delete', data)

    const updatedUserCart= [...userCart]
    setUserCart(updatedUserCart)
     console.log('data delete', updatedUserCart)

   } else {
    const findUpdatedProducts= guestCart.filter((product)=>{
        return product.id !== event.id})
        alert("Product Deleted!");
        setGuestCart(findUpdatedProducts)

   }

  }

  return (
    <div className="cart-container">
      {userCart && userCart.length> 0? (
        userCart.map((product, index) => {
          return (
            <div className="each-product-cart" key={index}>
              <img src={product.imageurl} width="150px" height="150px" />
              <section className="cart-details">
              <h3>{product.name}</h3>
              <h4>${product.price}</h4>
              <label>Quantity:
              <input 
               name="quantity"
              type="number"
              value={product.quantity}
              onChange={(event)=>updateQuantity(product, Number(event.target.value))}></input>
              </label>
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                className={classes.button}
                startIcon={<DeleteIcon />}
                onClick = {()=> removeOrderProduct(product)}
              >
                Remove
              </Button>
              </section>
            </div>
          )})) : ("")}
      {guestCart.length> 0 ?(
        guestCart.map((product, index) =>{
          return (
            <div className="each-product-cart" key={index}>
              <img src={product.imageurl} width="150px" height="150px" />
              <section className="cart-details">
              <h3>{product.name}</h3>
              <h4>${product.price}</h4>
              <label className="quantity-section">Quantity:
              <input 
               name="quantity"
              type="number"
              value={product.quantity}
              onChange={(event)=>updateQuantity(product, Number(event.target.value))}></input></label>
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                className={classes.button}
                startIcon={<DeleteIcon />}
                onClick = {()=> removeOrderProduct(product)}
              >
                Remove
              </Button>
              </section>
            </div>
          )})) : ""}

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
