import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { fade,makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import {Button, Badge} from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { Paper} from "@material-ui/core";
import SingleProduct from "./products/SingleProduct";


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
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));


const NavBar = ({ userData,setToken, setUserData, setUserCart, allProducts, userCart, guestCart}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const openAnchor = Boolean(anchorEl);
  const history = useHistory();
  const [searchTerm, updateSearchTerm] = useState ('')

  const cartChange= () =>{
    if(userCart && userCart.length>0){
       return userCart.reduce((sum, { quantity }) =>sum + quantity,  0)
    } else if(guestCart && guestCart.length>0){
      return guestCart.reduce((sum, { quantity }) => sum + quantity, 0)
    }else {
    return 0}
  }

  console.log('nav bar userData:', userData)


  const logOutHere = () => {
    localStorage.clear();
    setUserData({});
    setToken("");
    setUserCart({})
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
            Fullstack Fan Shop
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              value= {searchTerm}
              onChange= {(event)=> {
                  updateSearchTerm(event.target.value);
              }} 
            />
          </div>
          <IconButton 
         onClick={() => handleMenuChange("/cart")}
          color="inherit"
          aria-label="add to shopping cart">
          <Badge 
          badgeContent= {cartChange()}
          color="primary"
          >
          <AddShoppingCartIcon />
          </Badge>
          </IconButton>
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
                {userData.username && !userData.isAdmin? (
              <MenuItem 
              onClick={() => handleMenuChange("/myaccount")}
              >
                My Account
              </MenuItem>
                ): 
                <MenuItem 
                onClick={() => handleMenuChange("/login")}
                >
                  Sign Up
                </MenuItem>
                }
              {userData.isAdmin? (
              <MenuItem 
              onClick={() => handleMenuChange("/admin")}>
              Administrators Console
              </MenuItem>
              ):  
                  ""
            } 
              {userData.username? (
              <MenuItem onClick={() => logOutHere()}>
              Log Out
              </MenuItem>
              ):  ""
            } 
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      
    </div>
  );
};

export default NavBar;
