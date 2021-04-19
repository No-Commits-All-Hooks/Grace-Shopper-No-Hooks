import React from "react";
import { callApi } from "../../api";
import { useHistory, useParams } from "react-router-dom";

const AdminPage = ({userData, token }) => {

 return (
   <>  
  {userData.isAdmin?
    <>
    
    Admin page

    
    
    </> :
    <>
    Must be admin to view this page
    </>
}
 
 </>
 
    );   

};

export default AdminPage;
