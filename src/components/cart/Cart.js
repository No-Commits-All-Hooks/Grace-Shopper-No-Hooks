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


  return (
    <div className="cart-container">
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
    </div>
  );
};

export default Cart;
