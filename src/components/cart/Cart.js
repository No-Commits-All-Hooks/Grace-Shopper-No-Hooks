import React from "react";
import { useHistory, useParams } from "react-router-dom";
import "./Cart.css";
import { Button, makeStyles } from "@material-ui/core";
import CartCard from "./CartCard";
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    width: 100,
  },
}));
const Cart = ({myOrders,  userCart, setUserCart, guestCart, setGuestCart, token }) => {
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
  return (
      <>
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
       <Button
                size="small"
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() =>
                  history.push(`/cart/checkout`)
                }
                >
                Complete Order 
              </Button>
            </div>
      ): <h1>Cart Empty</h1>}
    </>
  );
};
export default Cart;