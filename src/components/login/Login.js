import React, { useState } from "react";
import "./AccountPage.css";
import Register from "./Register";
import NewLogin from "./NewLogin";


const Login = ({ action, setToken, setUserData }) => {
 
   return (
    <div>
        
        {action === "register" ?

          <Register
           action = {action}
           setToken = {setToken}
           setUserData = {setUserData}
           />
        :
          <NewLogin
          action = {action}
          setToken= {setToken}
          setUserData = {setUserData}
          />
      }
      
</div>
  );
};
export default Login;
