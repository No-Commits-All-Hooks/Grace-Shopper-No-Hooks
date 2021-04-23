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
  AdminPage,
  AllUsers,
  ManageProducts,
  Checkout,
  Review
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
  fetchAllUsers, 
  fetchAllOrders
} from "../api/utils";
import axios from "axios";
const App = () => {
  const [allProducts, setProducts] = useState([]);
  const [userCart, setUserCart] = useState([]);
  //For admin use to get all orders and all users
  const [allOrders, setAllOrders] = useState([]);
  const [allUsers, setAllUsers ] = useState([]);
  //individual users
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
  const refreshAllProducts = async () => {
    const allProducts = await fetchAllProducts();
    if (allProducts) {
      setProducts(allProducts);
    }
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
        if (data && data.isAdmin) {
      const allUsers = await fetchAllUsers(token);
      const allOrders = await fetchAllOrders(token); 
      setAllUsers(allUsers);
      setAllOrders(allOrders);
    }
  }
  useEffect(refreshAllProducts, [token]);

  useEffect(async ()=>{

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
              setProducts = {setProducts}
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
          <Route exact path="/products/:productId/review/create"render={({match}) => (
            <Review
              isUpdating={false}
              productId={match.params.productId}
              token={token}
              refreshAllProducts={refreshAllProducts}
            />
          )}/>
          <Route exact path="/products/:productId/review/:reviewId/edit"render={({match}) => (
            <Review
              isUpdating={true}
              reviewId={match.params.reviewId}
              token={token}
              refreshAllProducts={refreshAllProducts}
              productId={match.params.productId}
            />
          )}/>
          <Route exact path="/cart">
            <Cart
              myOrders={myOrders}
              userCart={userCart}
              setUserCart={setUserCart}
              guestCart={guestCart}
              setGuestCart={setGuestCart}
              token={token}
              refreshAllProducts={refreshAllProducts}
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
          <Route path="/admin">
            <AdminPage 
            userData={userData}
            allProducts={allProducts} 
            token = {token}
            />
          </Route>
          <Route exact path="/allusers">
            <AllUsers 
            allUsers = {allUsers}
            setAllUsers = {setAllUsers}
            token = {token}
            />
          </Route>
          <Route exact path="/manageproducts">
            <ManageProducts 
            setProducts = {setProducts}
            allProducts = {allProducts}
            token = {token}
            userData = {userData}
            />
          </Route>
        </Switch>
      </div>
    </>
  );
};
export default App;