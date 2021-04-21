import React from "react";
import { callApi } from "../../api";
import { BrowserRouter as Router, useHistory, useParams, Route, Switch, Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import AllUsers from "../users/AllUsers";
import fetchAllUsers from "../../api/utils";

const AdminPage = ({userData, token }) => {
    const history = useHistory();


    


 return (
   <>  
  {userData.isAdmin?
    <>
    <div>
    Admin page
    <section>
    <Button 
            variant="outlined"
            color="primary"
            size="small"
             onClick ={() => history.push(`/allusers`)}>
               View All Users
               </Button>
               <Button 
            variant="outlined"
            color="primary"
            size="small"
             onClick ={() => history.push(`/manageproducts`)}>
               Manage Products
               </Button>          

    </section>



    </div>
    </> :
    <>
    Must be admin to view this page
    </>
}
 
 </>
 
    );   

};

export default AdminPage;
