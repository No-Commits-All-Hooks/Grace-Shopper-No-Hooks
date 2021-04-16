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
  console.log("userData SINGLE DETAIL", userData);

  const { price } = product ? product : <h1>LOADING</h1>;

  // find order w/ created status to later update
  const findOrder= myOrders? myOrders.find((order) => order.status = 'created') : null

  const addProduct = async () => {
    if (token){
      const userId = userData.id 

        if (userCart &&userCart.products ) {
          const body = {
            productId: productId,
            price: price,
            quantity: quantity,
          };

          const newOrderProduct = await addProductOrder(userCart.id, body, token);
          // setUserCart([...userProducts, newOrderProduct])
          setUserCart([...userCart.products, newOrderProduct]);
          setMyOrderProducts([...findOrder.products, newOrderProduct]);
          console.log("findOrder updated", findOrder);


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
            // console.log("Created Order SINGLE DETAIL", newUserCart);
        }
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
      </div>
    </>
  );
};

export default SingleDetail;
