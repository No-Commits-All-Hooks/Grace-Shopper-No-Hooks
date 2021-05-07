import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, TextField } from "@material-ui/core";

import { callApi } from "../../api";
import "./AccountPage.css";

const NewLogin = ({ action, setToken, setUserData }) => {
 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const isLogin = action === "login";
  const title = isLogin ? "Login" : "Register";
  const oppositeAction = isLogin ? "register" : "login";
  const history = useHistory();
  const [respMessage, setRespMessage] = useState("");
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = await callApi({
        url: `users/${action}`,
        body: { username: username, password: password },
        method: 'POST',
    });
    const token = data?.token;
    if(!token){
      
    alert(data.message);
    
    console.log("data message", data.message)
    }
    else {
        localStorage.setItem('token', token);
        setUsername('');
        setPassword('');
        setToken(token);
        setUserData(data);
        console.log('new login data', data)

        if(data.user.isAdmin){
            history.push('/admin');

        } else {
        history.push('/myaccount');
        }
    }

    // if you get an error reponse grab the message
    
  };
  return (
    <div className="loginPage">
      <div className="login-inputs">
        <h1>{title}</h1>
         {/* display this error message if they don't succesfully login or register */}

        {respMessage ? <div id="errorMessage"> { respMessage }</div> : ''}
        <form onSubmit={handleSubmit}>
        <div className="login-details">
        <TextField required 
          label="Username" 
          className="login-fieldset"
          variant="outlined"
          onChange={(event) => setUsername(event.target.value)}
          />
          <TextField required 
          label="Password" 
          className="login-fieldset"
          type="password"
          variant="outlined"
          onChange={(event) => setPassword(event.target.value)}
          />
            </div> 
            <section className="login-actions">
            <Button 
            className="button-submit" 
            color="primary"
            type="submit"
            variant="contained"
            >
              {title}
            </Button>
        </section>
        </form>
        <div className="opposite-action-message">
            <h5>* Required</h5>
            Don't Have an Account?
            <Link to={`/${oppositeAction}`}> Create One Here!</Link>
          </div>     
    </div>
</div>
);};
export default NewLogin;
