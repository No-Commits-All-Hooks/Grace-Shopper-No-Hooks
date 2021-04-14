import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import StripeCheckout from 'react-stripe-checkout'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
  Link,
} from "react-router-dom";

import {
  //PUT COMPONENTS YOU EXPORTED FROM INDEX HERE
  AllProducts,
  NavBar,
  SingleDetail,
  Login,
  UserAccount,
  Homepage
} from "./index";

import "../styles.css";

import { callApi } from "../api";
import { fetchUserData, fetchCart, fetchUserOrders } from "../api/utils";
import axios from "axios";

const fetchAllProducts = async () => {
  const data = await callApi({
    url: "products",
  });
  return data;
};

const STRIPE_KEY = 'pk_test_51IftLtA9MPKzljzeSceH92fVneV3gu5NgdPP9ZEspdbi0qhxtRIypP37KO2e2ozpXwoswdPKRpfaTKYqk2vidPhR00u0MPhNrs';
const PAYMENT_URL = 'http://localhost:5000/api/pay';
const CURRENCY = 'USD';

const onToken = (amount) => async (token) => {
  console.log('Token is: ', token);
  try {
    const response = await axios.post(PAYMENT_URL, {
      source: token.id,
      currency: CURRENCY,
      amount,
    });
    console.log('Success!', response);
  } catch(error) {
    console.error(error);
  }
}

const App = () => {
  const [products, setProducts] = useState([]);

  // keep track of whats inside the cart of a logged in user
  const [userCart , setUserCart] = useState([]);

  // keep track of whats inside the cart of GUEST user
  const [guestCart , setGuestCart] = useState([]);


  //For admin use to get all orders
  const [orders, setOrders] = useState([]);
  //For individual users to get their orders
  const [myOrders, setMyOrders] = useState([]);
 //

  //Need to set token to verify user
  const [token, setToken] = useState("");
  //Need to set userData to get user related data
  const [userData, setUserData] = useState({});



  useEffect(async () => {
    const products = await fetchAllProducts();

    if (products) {
      setProducts(products);
    }

    //check to see if there is a token and try to set it on localStorage
    if (!token) {
      setToken(localStorage.getItem("token"));
      return;
    }

    // if (guestCart){

    //   setGuestCart(localStorage.setItem('guestCart', guestCart));
    //  }
    
    //  if (userCart){
    
    //   setUserCart(localStorage.setItem('userCart', userCart));
    //  }


    //if you have a token(when they log in they will get one) then set it to useState
    const data = await fetchUserData(token);
    if (data && data.username) {
      const userId = data.id
      const myOrders = await fetchUserOrders(userId, token);
      setUserData(data);
      setMyOrders(myOrders)
    }
  }, [token]);



  // console.log("all products:", products);
  console.log("userData for logged in user:", userData);

  return (
    <>
      <NavBar userData={userData} setToken={setToken} setUserData= {setUserData}/>
      <div id="app-body">
        <Switch>
          <Route exact path="/">
            <Homepage/>
          </Route>
          <Route path="/login">
            <Login
              action="login"
              setToken={setToken}
              setUserData={setUserData}
            />
          </Route>

          <Route path="/register">
            <Login
              action="register"
              setToken={setToken}
              setUserData={setUserData}
            />
          </Route>

          <Route path="/products">
            <AllProducts 
            products={products}
            userCart= {userCart}
            setUserCart = {setUserCart}
            guestCart = {guestCart}
            setGuestCart = {setGuestCart}
            userData = {userData}
            />
          </Route>
          <Route path="/product/:productId">
            <SingleDetail products={products} 
            userCart= {userCart}
            setUserCart = {setUserCart}
            guestCart = {guestCart}
            setGuestCart = {setGuestCart}
            userData = {userData}
            />
          </Route>
          <Route exact path="/orders/cart">
            <StripeCheckout
              token={onToken(1000000)}
              stripeKey={STRIPE_KEY}
              name="Fullstack Academy Shop"
              amount={1000000}
              currency={CURRENCY}
              shippingAddress
            />
          </Route>
          <Route path="/myaccount">
            <UserAccount userData={userData} />
          </Route>
        </Switch>
      </div>
    </>
  );
};

export default App;
