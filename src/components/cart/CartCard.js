import React from "react";
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


const CartCard = ({myOrders,  userCart, setUserCart, guestCart, setGuestCart, token }) => {
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


const updateQuantity= async (product, newQuantity)=>{
      if (token){

      const userCartProduct= userCart.find((p) => {return p.id === product.id});

      userCartProduct.quantity= Number(newQuantity)

      const updatedUserCart= [...userCart]

      setUserCart(updatedUserCart)
      console.log('updated quantitity product', updatedUserCart);
    

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
    const findUpdatedProducts= userCart.filter((product)=>{
      return Number(product.id)!== Number(event.id)})

    // const updatedUserCart= [...userCart]
    // userCart.push(findUpdatedProducts)
    setUserCart(findUpdatedProducts)
     console.log('updated user cart w/o delete', userCart)
     history.push('/cart')

   } else {
    const findUpdatedProducts= guestCart.filter((product)=>{
        return product.id !== event.id})
        alert("Product Deleted!");
        setGuestCart(findUpdatedProducts)
   }
  };


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
              onChange={(event)=>updateQuantity( product, Number(event.target.value))}></input>
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
    </div>
  );
};



export default CartCard;
