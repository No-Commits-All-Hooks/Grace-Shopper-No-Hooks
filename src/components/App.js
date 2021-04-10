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

const fetchAllOrders = async () => {
  const data = await callApi({
    url: "orders",
  })
}

const App = () => {
  const [products, setProducts] = useState([]);

  //Need to set token to verify user
  const [token, setToken] = useState("");
  //Need to set userData to get user related data
  const [userData, setUserData] = useState({});

  //Make sure to add the dependency array otherwise your useEffect will call itself a million times and your browser will probably crash :)
  useEffect(async () => {
    //check to see if there is a token and try to set it on localStorage
    if (!token) {
      setToken(localStorage.getItem("token"));
      return;
    }

    //if you have a token(when they log in they will get one) then set it to useState
    const data = await fetchUserData(token);
    if (data && data.username) {
      setUserData(data);
      console.log("USER DATA", data);
    }
  }, [token]);

  useEffect(async () => {
    const products = await fetchAllProducts();

    if (products) {
      setProducts(products);
    }
  }, []);
  // console.log("all products:", products);

  return (
    <>
      <NavBar />
      <div id="app">
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
            <AllProducts products={products}/>
          </Route>
          <Route path="/product/:productId">
            <SingleDetail products={products} />
          </Route>
        </Switch>
      </div>
    </>
  );
};

export default App;
