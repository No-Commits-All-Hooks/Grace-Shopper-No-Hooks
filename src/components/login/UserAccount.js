import React from "react";
import { Link, useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";

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
    <>
      <div className="dashboard">{<h1>Hello, {username}!</h1>}</div>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          history.push("/users/orders");
        }}
      >
        View My Orders
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          history.push("/products");
        }}
      >
        Shop
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          history.push("/orders/cart");
        }}
      >
        View My Cart
      </Button>
    </>
  );
};
export default UserAccount;
