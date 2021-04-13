import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
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
} from "./index";

import "../styles.css";

import { callApi } from "../api";
import { fetchUserData } from "../api/utils";

const fetchAllProducts = async () => {
  const data = await callApi({
    url: "products",
  });
  return data;
};


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
      setUserData(data);
    }
  }, [token]);



  // console.log("all products:", products);
  console.log("userData for logged in user:", userData);

  return (
    <>
      <NavBar userData={userData} setToken={setToken} setUserData= {setUserData}/>
      <div id="app-body">
        <Switch>
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
          <Route path="/myaccount">
            <UserAccount userData={userData} />
          </Route>
        </Switch>
      </div>
    </>
  );
};

export default App;
