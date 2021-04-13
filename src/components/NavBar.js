import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";



const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const NavBar = ({ userData,setToken, setUserData}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const openAnchor = Boolean(anchorEl);
  const history = useHistory();

  const logOutHere = () => {
    localStorage.clear();
    setUserData({});
    setToken("");
    history.push("/");
  
  };   

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuChange = (pageURL) => {
    history.push(pageURL);
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar 
      position="fixed" 
      style={{ background: 'rgb(102, 30, 30)' }}
      >
        <Toolbar>
          <Typography 
          variant="h6" 
          className={classes.title} 
          onClick={() => handleMenuChange("/")}
          style={{ cursor: 'pointer' }}
          >
            Fullstack Academy Shop
          </Typography>
          <Button
            aria-controls="fade-menu"
            aria-haspopup="true"
            onClick={() => handleMenuChange("/products")}
            style={{ color: 'white' }}
          >
            Products
          </Button>
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={openAnchor}
              onClose={() => setAnchorEl(null)}
            >
                {userData.username? (
              <MenuItem 
              onClick={() => handleMenuChange("/myaccount")}
              >
                My Account
              </MenuItem>
                ): (
                <MenuItem 
                onClick={() => handleMenuChange("/login")}
                >
                  My Account
                </MenuItem>
              )}
              <MenuItem 
              onClick={() => handleMenuChange("/register")}
              >
                Sign Up
              </MenuItem>
              <MenuItem 
              onClick={() => handleMenuChange("/orders/cart")}
              >
                Shopping Cart
              </MenuItem>
              <MenuItem onClick={() => logOutHere()}>
              Log Out
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
