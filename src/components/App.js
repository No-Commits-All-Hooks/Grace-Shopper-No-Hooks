import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import StripeCheckout from "react-stripe-checkout";
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
  Homepage,
  Cart,
} from "./index";

import "../styles.css";

import { callApi } from "../api";
import {
  fetchUserData,
  fetchAllProducts,
  addToOrder,
  fetchCart,
  fetchUserOrders,
  createOrder
} from "../api/utils";
import axios from "axios";

const App = () => {
  const [allProducts, setProducts] = useState([]);

  // keep track of whats inside the cart of a logged in user
  const [userCart, setUserCart] = useState([]);

  // keep track of whats inside the cart of GUEST user
  const [guestCart, setGuestCart] = useState([]);

  //For admin use to get all orders
  const [orders, setOrders] = useState([]);
  //For individual users to get their orders
  const [myOrders, setMyOrders] = useState([]);

  //Need to set token to verify user
  const [token, setToken] = useState("");
  //Need to set userData to get user related data
  const [userData, setUserData] = useState({});

  useEffect(async () => {
    const allProducts = await fetchAllProducts();

    if (allProducts) {
      setProducts(allProducts);
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

    // console.log('DATA IN APP', data)
    if (data && data.username) {
      const userId = data.id;
      const myOrders = await fetchUserOrders(userId, token);
      setUserData(data);
      setMyOrders(myOrders);
    }
    
    const userCart = await fetchCart(token);
    setUserCart(userCart);


  }, [token]);

  // console.log("all products:", allProducts);
  // console.log("userData for logged in user:", userData);
  console.log("fetchCart:", userCart);
  console.log("USER TOKEN:", token);
  console.log("myOrders :", myOrders);

  return (
    <>
      <NavBar
        userData={userData}
        setToken={setToken}
        setUserData={setUserData}
        setUserCart={setUserCart}
      />
      <div id="app-body">
        <Switch>
          <Route exact path="/">
            <Homepage />
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

          <Route exact path="/products">
            <AllProducts
              allProducts={allProducts}
              userCart={userCart}
              setUserCart={setUserCart}
              guestCart={guestCart}
              setGuestCart={setGuestCart}
              userData={userData}
            />
          </Route>
          <Route exact path="/products/:productId">
            <SingleDetail
              allProducts={allProducts}
              userCart={userCart}
              setUserCart={setUserCart}
              guestCart={guestCart}
              setGuestCart={setGuestCart}
              token ={token}
              userData={userData}
              setUserData ={setUserData}
              myOrders= {myOrders}
            />
          </Route>
          <Route path="/cart">
            <Cart userCart={userCart} setUserCart={setUserCart} />
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
