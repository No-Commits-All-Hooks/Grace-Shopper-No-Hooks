import React from "react";
// import { callApi } from '../api/index';
import { useHistory, useParams } from "react-router-dom";
import "./Cart.css";
import StripeCheckout from "react-stripe-checkout";
import { Paper, Button, makeStyles } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

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

const Cart = ({ userCart, setUserCart, guestCart, setGuestCart }) => {
  const classes = useStyles();
 

  console.log("userCart:", userCart);
  const {products}= userCart;

  // const handleDelete = async ()=>{
  //     const {success} = await callApi ({
  //         url: `/posts/${post._id}`,
  //         token: token,
  //         method:'DELETE'
  //     });
  //     if(success){
  //         alert('Post Deleted!')
  //         history.push('/dashboard')
  //         setPosts([...posts])

  //     }
  // }

  return (
    <div className="cart-container">
        <StripeCheckout token={onToken(1000000)} stripeKey={STRIPE_KEY} name="Fullstack Academy Shop" amount={1000000} currency={CURRENCY} shippingAddress />
      {products? (
        products.map(({ id, imageurl, name, price, quantity }) => {
          return (
            <div className="each-product-cart" key={id}>
              <img src={imageurl} width="150px" height="150px" />
              <h3>{name}</h3>
              <h4>{price}</h4>
              <h4>{quantity}</h4>
              <Button
                size="small"
                variant="contained"
                color="gray"
                className={classes.button}
                startIcon={<DeleteIcon />}
              >
                Remove
              </Button>
            </div>
          );
        })
      ) : (
        <h2>Shopping Cart is Empty</h2>
      )}
    </div>
  );
};

export default Cart;
