import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    useHistory,
    Link
} from 'react-router-dom';

import { 
   //PUT COMPONENTS YOU EXPORTED FROM INDEX HERE
  AllProducts,
   NavBar
 } from './index';



import '../styles.css';

const App = () => {
const [allProducts, setAllProducts] = useState([]);
   
    return (
        <>
        <NavBar/>
        <div id="app">
           
            <Switch>
           
            <AllProducts
             />    


           </Switch>
        </div>
        </>
    );
};


export default App;
