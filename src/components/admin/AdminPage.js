import React from "react";
import { callApi } from "../../api";
import {
  BrowserRouter as Router,
  useHistory,
  useParams,
  Route,
  Switch,
  Link,
} from "react-router-dom";
import { Button, Grid } from "@material-ui/core";
import PeopleAltRoundedIcon from "@material-ui/icons/PeopleAltRounded";
import ShopTwoOutlinedIcon from '@material-ui/icons/ShopTwoOutlined';
import AllUsers from "../users/AllUsers";
import fetchAllUsers from "../../api/utils";

const AdminPage = ({ userData, token }) => {
  const history = useHistory();

  return (
    <>
      {userData.isAdmin ? (
        <>
          <div className="dashboard">
            <h2>Admin page</h2>
            <section>
              <Grid
                container
                className="dashboard-grid"
                direction="row"
                justify="center"
                alignItems="flex-start"
              >
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  className="dashboard-button"
                  startIcon={<PeopleAltRoundedIcon />}
                  onClick={() => history.push(`/allusers`)}
                >
                  View All Users
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  startIcon={<ShopTwoOutlinedIcon />}
                  className="dashboard-button"
                  onClick={() => history.push(`/manageproducts`)}
                >
                  Manage Products
                </Button>
              </Grid>
            </section>
          </div>
        </>
      ) : (
        <>Must be admin to view this page</>
      )}
    </>
  );
};

export default AdminPage;
