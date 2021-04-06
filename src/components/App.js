import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
  Link,
} from 'react-router-dom';

import {
  //PUT COMPONENTS YOU EXPORTED FROM INDEX HERE
  AllProducts,
  NavBar,
} from './index';

import '../styles.css';

import { callApi } from '../api';
import SingleProduct from './products/SingleProduct';

const fetchAllProducts = async () => {
  const data = await callApi({
    url: 'products',
  });
  return data;
};

const App = () => {
  const [products, setProducts] = useState([]);

  //Make sure to add the dependency array otherwise your useEffect will call itself a million times and your browser will probably crash :)
  useEffect(async () => {
    const products = await fetchAllProducts();

    if (products) {
      setProducts(products);
    }
  }, []);

    console.log("all products:", products);

  return (
    <>
      <NavBar />
      <div id="app">
        <Switch>
          <Route path="/products">
            <AllProducts products={products} />
          </Route>
          <Route path="/products/:productId">
            <SingleProduct products={products} />
          </Route>
        </Switch>
      </div>
    </>
  );
};

export default App;
