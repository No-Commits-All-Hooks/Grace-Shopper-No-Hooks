import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { callApi } from "../../api";
import "./Login.css";

const NewLogin = ({ action, setToken, setUserData }) => {
 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const isLogin = action === "login";
  const title = isLogin ? "Login" : "Register";
  const oppositeTitle = isLogin ? "Register" : "Login";
  const oppositeAction = isLogin ? "register" : "login";
  const history = useHistory();
  const [respMessage, setRespMessage] = useState("");
  
  
  const handleClick = () => {
    history.push("/");
    };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = await callApi({
        url: `users/${action}`,
        body: { username: username, password: password },
        method: 'POST',
    });
    const token = data?.token;
    
    if(!token){
      
    setRespMessage(data.message);
    
    console.log("data message", data.message)
    }
    else {
        localStorage.setItem('token', token);
        setUsername('');
        setPassword('');
        setToken(token);
        setUserData(data);
        history.push('/');
    }

    // if you get an error reponse grab the message
    
  };
  return (
    <div className="loginPage">
        <div id="loginInputs">
        <h1>{title}</h1>
         {/* display this error message if they don't succesfully login or register */}

        {respMessage ? <div id="errorMessage"> { respMessage }</div> : ''}
        <form onSubmit={handleSubmit}>
        <div className="loginfieldset">
            <label htmlFor="name">Username:</label>
            <input
                type="text"
                placeholder="username"
                required
                onChange={(event) => setUsername(event.target.value)}
            ></input></div>
            <div className="loginfieldset"><label>Password:</label>
            <input
                type="password"
                placeholder="password"
                onChange={(event) => setPassword(event.target.value)}
            ></input>
            </div>
            <section className="login-actions">
            <button 
            className="primary"
            type="submit">{title}</button>
            
        <button 
        onClick={handleClick}>Go back</button>
        </section>
        </form>
                   
    </div>
</div>
);};
export default NewLogin;
