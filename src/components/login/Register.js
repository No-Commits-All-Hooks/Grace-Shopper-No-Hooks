import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { callApi } from "../../api";
import { Button, TextField } from "@material-ui/core";

import "./AccountPage.css";

const Register = ({ action, setToken, setUserData }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const isLogin = action === "login";
  const title = isLogin ? "Login" : "Register";
  const oppositeAction = isLogin ? "Register" : "Login";
  const history = useHistory();
  const [respMessage, setRespMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = await callApi({
      url: `users/${action}`,
      body: {
        firstName: firstName,
        lastName: lastName,
        email: newEmail,
        username: username,
        password: password,
      },
      method: "POST",
    });

    const token = data.token;

    if (token) {
      localStorage.setItem("token", token);
      setUsername("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setNewEmail("");
      setToken(token);

      history.push("/myaccount");
    } else {
      setRespMessage(data.message);
    }
  };

  return (
    <div className="loginPage">
      <div className="login-inputs">
        <h1>Register Below </h1>
        {/* display this error message if they don't succesfully login or register */}

        {respMessage ? <div id="errorMessage"> {respMessage}</div> : ""}
        <form onSubmit={handleSubmit}>
          <div className="login-details">
          <TextField required 
          label="First Name" 
          className="login-fieldset"
          variant="outlined"
          onChange={(event) => setFirstName(event.target.value)}
          />
          <TextField required 
          label="Last Name" 
          className="login-fieldset"
          variant="outlined"
          onChange={(event) => setLastName(event.target.value)}
          />
          <TextField required 
          label="Email" 
          className="login-fieldset"
          variant="outlined"
          onChange={(event) => setNewEmail(event.target.value)}
          />
          <TextField required 
          label="Username" 
          className="login-fieldset"
          variant="outlined"
          onChange={(event) => setUsername(event.target.value)}
          />
          <TextField required 
          label="Password" 
          className="login-fieldset"
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
          Already Have an Account?
          <Link to={`/${oppositeAction}`}> Login here!</Link>
        </div>
      </div>
    </div>
  );
};
export default Register;
