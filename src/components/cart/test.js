
import React, {useEffect, useState} from 'react';
import ReactDOM from "react-dom";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    useHistory,
    Link
} from 'react-router-dom';
import { fetchUserData, fetchAllProducts, fetchUserCart, addProductToOrder } from './api/utils';

// Page components
import { 
    Header,
    Home,
    Welcome,
    Login,
    Register,
    LoginLanding,
    LogoutLanding,
    Products,
    SingleProduct,
    Cart,
    Account,
    SingleOrder,
    Admin, } from './components'

import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import './styles.css';

const theme = createMuiTheme({
    palette: {
        primary: {
            // main: '#d4af37',
            main: '#b5a264',
            contrastText: 'white',

        },
        secondary: {
            main: '#222',
        },
    }
});

// Persistent cart
const getCartFromLocal = () => {
    let cart = localStorage.getItem('cart');
    if (cart) {
        return JSON.parse(cart);
    };
};

const setCartOnLocal = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

const App = () => {

    const setCart = (currentCart) => {
        setCartOnLocal(currentCart);
        _setCart(currentCart);
    }

    useEffect(() => {
        if (getCartFromLocal()) {
            _setCart(getCartFromLocal());
        };
    }, []);

    const [token, setToken] = useState("");
    const [userData, setUserData] = useState({});
    const [allProducts, setAllProducts] = useState([]);
    const [activeLinkIs, setActiveLinkIs] = useState('Home');
    const [cart, _setCart] = useState([]);

    //  ! need api route for GET /users
    // const [allUsers, setAllUsers] = useState([]);

    // Retrieve token from local storage
    useEffect(async () => {
        if (!token) {
            setToken(localStorage.getItem('token'));
            return;
        };
        
        const data = await fetchUserData(token);
        if (data && data.username) {
            setUserData(data);
        };

        const databaseCart = await fetchUserCart(token);
        console.log('MY OLD CART PRODUCTS: ', cart);
        if (databaseCart && databaseCart.products && databaseCart.products.length > 0) {

            let cartCopy = [];
            const dbCartOrderProducts = [databaseCart.products];
            console.log('MY DB CART PRODUCTS: ', dbCartOrderProducts[0]);

            // Nothing in cart pre-login
            if (cart && cart.length === 0) {
                console.log('Cart Length 0')
                dbCartOrderProducts[0].forEach((orderProduct) => {cartCopy.push(orderProduct)});
                setCart(cartCopy);
                return;
            }
            
            // Items in cart pre-login:
            if (cart && cart.length > 0) {
                cartCopy = [...cart];
                const newCart = [];

                for (let i = 0; i < dbCartOrderProducts[0].length; i++) {
                    const dbProduct = dbCartOrderProducts[0][i];
                    const indexToRemove = cartCopy.findIndex((product) => {return product.productId === dbProduct.productId});
                    if (indexToRemove >= 0) {
                        cartCopy.splice(indexToRemove, 1);
                    };
                };
                const newOrderProducts = await Promise.all(cartCopy.map(async (product) => {
                    const body = {
                        productId: product.productId,
                        price: product.price,
                        quantity: product.quantity,
                    };
                    const newOrderProduct = await addProductToOrder(databaseCart.id, body, token);
                    return newOrderProduct;
                }));
                dbCartOrderProducts[0].forEach(product => newCart.push(product));
                newOrderProducts.forEach(product => newCart.push(product));
                setCart(newCart);
            };

        };
    }, [token]);

    // Retrieve all products
    useEffect(async () => {
        try {
            const products = await fetchAllProducts();
            if (products) {
                setAllProducts(products);
            };

            // setCart(localStorage.getItem('cart'))
        } catch(error) {
            console.error(error);
        };
    }, [])

    // Retrieve all users
    // ! route needs to be made
    // useEffect(async ()=>{
    //     try {
    //         const users = await fetchAllUsers();
    //         if (users) {
    //             setAllUsers(users);
    //         };
    //     } catch (error) {
    //         console.error(error)
    //     }
    // }, [])

    return (
        <div id="app">
            <ThemeProvider theme={theme}>
                <Header 
                    activeLinkIs = {activeLinkIs}
                    setActiveLinkIs = {setActiveLinkIs}
                    setToken = {setToken}
                    setUserData = {setUserData}
                    userData = {userData}
                    setCart = {setCart} />

                <Switch>
                    <Route exact path = "/">
                        <Home
                            userData = {userData} 
                            setActiveLinkIs = {setActiveLinkIs}/>
                    </Route>

                    <Route path = "/welcome">
                        <Welcome />
                    </Route>

                    <Route exact path = "/login">
                        <Login 
                            setToken = {setToken} />
                    </Route>

                    <Route exact path="/login/success">
                        <LoginLanding
                            userData = {userData}
                            action = {'logged in'}
                            setActiveLinkIs = {setActiveLinkIs} />
                    </Route>

                    <Route exact path ="/register">
                        <Register
                            setToken = {setToken} />
                    </Route>

                    <Route exact path="/register/success">
                        <LoginLanding
                            userData = {userData}
                            action = {'registered'}
                            setActiveLinkIs = {setActiveLinkIs} />
                    </Route>

                    <Route path="/logout">
                        <LogoutLanding setActiveLinkIs = {setActiveLinkIs} />
                    </Route>

                    <Route exact path = "/products">
                        <Products allProducts = {allProducts}/>
                    </Route>

                    <Route exact path = "/products/:productId">
                        <SingleProduct 
                            allProducts = {allProducts}
                            cart = {cart}
                            setCart = {setCart}
                            token = {token}
                            setUserData = {setUserData}/>
                    </Route>

                    <Route path = "/account">
                        <Account 
                            userData = {userData}
                            setActiveLinkIs = {setActiveLinkIs} />
                    </Route>

                    {userData.isAdmin
                    ? <Route path = "/orders/:orderId">
                        <SingleOrder />
                    </Route>
                    : ''}

                    {userData.isAdmin
                    ? <Route path = "/admin">
                        <Admin />
                    </Route>
                    : '' }

                    <Route path = "/cart">
                        <Cart 
                            userData = {userData}
                            setUserData = {setUserData}
                            cart = {cart} 
                            setCart = {setCart}
                            token = {token} />
                    </Route>

                </Switch>

                
            </ThemeProvider>
        </div>
    );
};

export default App;


ReactDOM.render(
    <Router>
        <App />
    </Router>, 
    document.getElementById('root'));
