import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Switch,
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
  Checkout
} from "./index";

import "../styles.css";

import { callApi } from "../api";
import {
  fetchUserData,
  fetchAllProducts,
  addToOrder,
  fetchCart,
  fetchUserOrders,
  createOrder,
} from "../api/utils";

const App = () => {
  const [allProducts, setProducts] = useState([]);
  const [userCart, setUserCart] = useState([]);
  let [guestCart, setGuestCart] = useState([]);

  //For admin use to get all orders
  const [orders, setOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState({});

  const updateUserCart= async (token)=>{
    
        let {products: userCart}= await fetchCart(token);
        if (userCart){
          setUserCart(userCart)
        }
  }

  useEffect(async () => {
    //check to see if there is a token and try to set it on localStorage
    if (!token) {
      setToken(localStorage.getItem("token"));
      return;
    }

    //if you have a token(when they log in they will get one) then set it to useState
    const data = await fetchUserData(token);

    if (data && data.username) {
      const userId = data.id;
      const myOrders = await fetchUserOrders(userId, token);
      setUserData(data);
      setMyOrders(myOrders);
      updateUserCart(token);
    };
  }, [token]);

  useEffect(async ()=>{
    const allProducts = await fetchAllProducts();
    if (allProducts) {
      setProducts(allProducts);
    }

    // JSON.parse(localStorage.getItem("guestCart")).length === 0
    let guestCart = localStorage.getItem("guestCart");
    if(!guestCart ){
      localStorage.setItem('guestCart', (guestCart));
    }
    console.log("guest cart local", JSON.parse(guestCart) );
   return JSON.parse(guestCart) 
  },[])

  // console.log("all products:", allProducts);
  // console.log("userData for logged in user:", userData);
  console.log("USER CART IN APP:", userCart);
  // console.log("USER TOKEN:", token);
  // console.log("myOrders :", myOrders);
  console.log("GUEST CART IN APP:", guestCart);

  return (
    <>
      <NavBar
        userData={userData}
        setToken={setToken}
        setUserData={setUserData}
        setUserCart={setUserCart}
        allProducts={allProducts}
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
              token={token}
              userData={userData}
              setUserData={setUserData}
              myOrders={myOrders}
              setMyOrders={setMyOrders}
            />
          </Route>
          <Route exact path="/cart">
            <Cart
              myOrders={myOrders}
              userCart={userCart}
              setUserCart={setUserCart}
              guestCart={guestCart}
              setGuestCart={setGuestCart}
              token={token}
            />
          </Route>
        <Route exact path="/cart/checkout">
        <Checkout
              myOrders={myOrders}
              userCart={userCart}
              setUserCart={setUserCart}
              guestCart={guestCart}
              setGuestCart={setGuestCart}
              token={token}
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
