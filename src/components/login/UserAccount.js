import React from "react";
import { Link, useHistory } from "react-router-dom";
import {Button, Grid} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import TodayIcon from '@material-ui/icons/Today';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import StoreIcon from '@material-ui/icons/Store';
import "./UserAccount.css";


const UserAccount = ({ userData }) => {
  console.log("USER ACCOUNT DATA", userData);
  const history = useHistory();
  const username= userData.username

  // if (!userData.id) {
  //   return (
  //     <div className="sign-in-message">
  //       <h1>
  //         Please <Link to="/login">log in</Link> to view your dashboard
  //       </h1>
  //     </div>
  //   );
  // }



  return (

      <div className='dashboard'>
        <h2>Welcome Back, {username}!</h2>
      <Grid
      container
      className= "dashboard-grid"
      direction="row"
      justify="center"
      alignItems="flex-start"
      >
      <Button
        variant="outlined"
        className= "dashboard-button"
        color="primary"
        startIcon={<TodayIcon/>}
        size="large"
        onClick={() => {
          history.push("/users/orders");
        }}
      >
        Order History
      </Button>
      <Button
        variant="outlined"
        className= "dashboard-button"
        color="primary"
        startIcon={<ShoppingCartIcon/>}
        size="large"
        onClick={() => {
          history.push("/cart");
        }}
      >
        View My Cart
      </Button>
      <Button
        variant="outlined"
        className= "dashboard-button"
        color="primary"
        startIcon={<StoreIcon/>}
        size="large"
        onClick={() => {
          history.push("/products");
        }}
      >
        Shop
      </Button>
      </Grid>
      </div>
  );
};
export default UserAccount;
