import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "./SingleDetail.css";
import { Paper, Button, makeStyles } from "@material-ui/core";
import { addProductOrder, createOrder, updateData, fetchCart } from "../../api/utils";

const SingleDetail = ({
  allProducts,
  userCart,
  setUserCart,
  guestCart,
  setGuestCart,
  token,
  userData,
  setUserData,
  myOrders,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [myOrderProducts, setMyOrderProducts] = useState({});

  const { products } = allProducts;

  const history = useHistory();
  const { productId } = useParams();
  const product = products
    ? products.find((product) => Number(productId) === Number(product.id))
    : null;
  // console.log('PRODUCTS', product)
  // console.log('TOKEN SINGLE DETAIL', token)
  console.log("USER CART SINGLE DETAIL", userCart);

  const { price } = product ? product : <h1>LOADING</h1>;

  // find order w/ created status to later update
  const findOrder= myOrders? myOrders.find((order) => order.status = 'created') : null

  const addProduct = async () => {

    if (!token){
      const newProductAdded= {
        name: product.name,
        imageurl: product.imageurl,
        description: product.description,
        productId: product.id,
        orderProductId: productId,
        price: product.price,
        quantity: quantity,
      }
      guestCart.push(newProductAdded);
      setGuestCart(guestCart)
      console.log("GuestCart after being set", guestCart)  
      localStorage.setItem('guestCart', JSON.stringify(guestCart));
              console.log('guest cart local', guestCart)

    }
    else if (token){
      const userId = userData.id 

        if (userCart) {
          const body = {
            productId: productId,
            price: price,
            quantity: quantity,
          };

          const newOrderProduct = await addProductOrder(userCart.id, body, token);
          // setUserCart([...userProducts, newOrderProduct])
          setUserCart([...userCart.products, newOrderProduct]);
          setMyOrderProducts([...findOrder.products, newOrderProduct]);
          console.log("updated order ", findOrder);


        } else {
          // const bodyCart = {
          //   status: "created",
          //   userId: 1,
          // };
          const bodyProduct = {
            productId: productId,
            price: price,
            quantity: quantity,
          };
            let newUserCart = await createOrder(token);

            console.log("newUserCart Order SINGLE DETAIL", newUserCart);

            const newOrderProduct = await addProductOrder(newUserCart.id, bodyProduct, token);
            console.log("newOrderProduct Order SINGLE DETAIL", newOrderProduct);

            // newUserCart.push(newOrderProduct);
            // setUserCart(newUserCart);
            console.log("Created Order SINGLE DETAIL", newUserCart);
        }

        localStorage.setItem('userCart', JSON.stringify(userCart));

    }
    };

  if (!product) {
    return <div></div>;
  }
  return (
     <>
      <section className="return-home-button">
        <button
          onClick={() => {
            history.push(`/products`);
          }}
        >
          Return to all products
        </button>
      </section>
      <div className="single-product-card">
        <img
          src={product.imageurl}
          className="product-image"
          alt={product.name}
        />
        <section className="product-details">
          <h1> {product.name} </h1>
          <div>Price : ${product.price}</div>
          <div> Description: {product.description}</div>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={addProduct}
          >
            Add To Cart
          </Button>
        </section>

        <div className='single-product-card'>
            <img src={product.imageurl} className="product-image" alt={product.name}/>
            <section className="product-details">
             <h1> {product.name} </h1>
             <div>Price : ${product.price}</div>
             <div> Description: { product.description }</div>
             <button onClick ={() => history.push(`/products/${productId}/review/create`)}>Add A Review</button>
             </section>
        </div>
        </div>
        </>
    );
};

export default SingleDetail;
