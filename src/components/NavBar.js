import React from "react";
import { Link, useHistory } from "react-router-dom";

const NavBar= ({}) =>{

    return (
        <nav className="products-nav">
            <Link to={"/"}>Home</Link>
            <Link to={"/products"}>Products</Link>
            <Link to = {"/login"}>Login</Link>

        </nav>
    )
}

export default NavBar;