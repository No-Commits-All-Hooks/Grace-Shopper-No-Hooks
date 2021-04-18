import React from "react";
// import { callApi } from '../api/index';
import { useHistory, useParams } from "react-router-dom";
import "./Cart.css";
import StripeCheckout from "react-stripe-checkout";
import { Paper, Button, makeStyles } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { deleteOrderProduct } from "../../api/utils";

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

  console.log("userCart:", userCart);
  console.log("guestCart:", guestCart);

const {products}= userCart
//   console.log("products:", products);

  const deleteOrderProduct = async ()=>{
    // console.log("productId:", productId);

    
    const data= await deleteOrderProduct( token);

      if(data.success){
      alert("Product Deleted!");
    history.push('/product')
    setUserCart([...userCart.products, data]);
      }



      console.log('data delete', data)
    //   if (deletedOrderProduct && deletedOrderProduct.success) {
    //     alert("Product Deleted!");
    //     setUserCart([...userCart, deletedOrderProduct]);
    //     history.push("/cart");
    //   } else {
    //     alert("Error deleting product");
    //     history.push("/products");
    //   }
  }

  return (
    <div className="cart-container">
        <StripeCheckout token={onToken(1000000)} stripeKey={STRIPE_KEY} name="Fullstack Academy Shop" amount={1000000} currency={CURRENCY} shippingAddress />
      {products? (
        products.map(({ id, imageurl, name, price, quantity, productId}) => {
          return (
            <div className="each-product-cart" key={id}>
              <img src={imageurl} width="150px" height="150px" />
              <h3>{name}</h3>
              <h4>${price}</h4>
              <h4>{quantity}</h4>
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                className={classes.button}
                startIcon={<DeleteIcon />}
                onClick = {deleteOrderProduct}
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
