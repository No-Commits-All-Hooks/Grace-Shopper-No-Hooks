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
 } from './index';



import '../styles.css';

const App = () => {

   
    return (
        <div id="app">
           <h1>HELLO WORLD!! Just a test to get it to show up on screen. </h1>

        </div>
    );
};


export default App;
