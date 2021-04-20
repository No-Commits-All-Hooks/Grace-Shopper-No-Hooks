import React from "react";
import { callApi } from "../../api";
import { BrowserRouter as Router, useHistory, useParams, Route, Switch, Link } from "react-router-dom";



const AllUsers = ({userData, token }) => {
return (
    <>
    <div className="allUsersPage">
    <h1>All users go here</h1>
    </div>
    </>
)

}

export default AllUsers