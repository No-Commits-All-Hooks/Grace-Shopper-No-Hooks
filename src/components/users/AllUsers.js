import React from "react";
import { callApi } from "../../api";
import SingleUser from "./SingleUser";
import { BrowserRouter as Router, useHistory, useParams, Route, Switch, Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(16),
        width: theme.spacing(20),
        height: theme.spacing(20),
      },
    },
  }));


const AllUsers = ({userData, token, allUsers, setAllUsers }) => {
    const history = useHistory();
    const users = allUsers;
    const classes = useStyles();

return (
    <>
    <div className="allUsersPage">
    <h1>Admin - All Users </h1>
    <section>
    <Button 
            variant="outlined"
            color="primary"
            size="small"
             onClick ={() => history.push(`/admin`)}>
               Admin Page
               </Button>

    </section>

    {users ? (
          users.map((user) => {
            return(
             
              <SingleUser
              key = {user.id}
              firstname= {user.firstname}
              lastname= {user.lastname}
              username= {user.username}
              imageurl= {user.imageurl}
              email= {user.email}
              allUsers = {allUsers}
              />
            
            )})) : (
                <div>Any users to see?</div>
            )}
    </div>
    </>
)

}

export default AllUsers