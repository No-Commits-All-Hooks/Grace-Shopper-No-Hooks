import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Paper, Button, makeStyles } from "@material-ui/core";
import "./SingleUser.css";


const SingleUser = ({firstname, lastname, email, username, imageurl }) => {

  
 return (
     <>
    <div className="user-list">
      <div className="user-image">
          <img src={imageurl} className="user-image" alt={username} />
     </div>
      
      <div className="user-header-container">
      <div>First Name: {firstname}</div>
      <div>Last Name: {lastname}</div>
      <div>Email: {email}</div>
      <div>Username: {username}</div>
      <div>Image url: {imageurl}</div>
      </div>
      
    
    </div>

     </>


 )   


};

export default SingleUser