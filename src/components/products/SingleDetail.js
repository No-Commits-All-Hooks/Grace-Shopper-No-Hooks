import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import "./SingleDetail.css";
import { Paper, Button, makeStyles } from "@material-ui/core";
import {
  addProductOrder,
  createOrder,
  updateData,
  fetchCart,
} from "../../api/utils";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const SingleDetail = ({
  allProducts,
  userCart,
  setUserCart,
  guestCart,
  setGuestCart,
  token,
  userData,
  myOrders,
  setMyOrders,
}) => {
  const [quantity, setQuantity] = useState(1);
  const classes = useStyles();
  const { products } = allProducts;
  const history = useHistory();
  let { productId } = useParams();
  productId = parseInt(productId);

  const product = products
    ? products.find((product) => Number(productId) === Number(product.id))
    : null;
  console.log("productId", productId);
  console.log("USER data SINGLE DETAIL", userData);
  // console.log('Guest Cart SINGLE DETAIL', guestCart)
  console.log("userCart single detail file", userCart);

  // find order w/ created status to later update

  // console.log('orderProducts SINGLE DETAIL', orderProducts)

const addProduct = async (product) => {
  
    //if no user logged in
    if (!userData.username) {
      let newProductToAdd = guestCart.find(function (product) {
        return product.id === productId;
      });
      console.log("new product to add exists", newProductToAdd);
      if (newProductToAdd) {
        newProductToAdd.quantity++;
      } else if (!newProductToAdd) {
        newProductToAdd = {
          ...product,
          quantity: Number(quantity),
        };
        console.log("new product to added ", newProductToAdd);
      }
      alert("Product Added to Cart");
      let guestCopy = [...guestCart];
      guestCopy.push(newProductToAdd);
      setGuestCart(guestCopy);

      console.log("guest cart local", guestCart);
    } 
      else if (userData && userData.username) {

      const findOrder = myOrders.find((order) => (order.status = "created"));
      console.log("ORDER FOUND:", findOrder);

      //create order for user
      if (!findOrder) {
        const bodyProduct = {
          ...product,
          productId: productId,
          price: product.price,
          quantity: quantity,
        };
        let newUserCart = await createOrder(token);

        console.log("newUserCart Order SINGLE DETAIL", newUserCart);

        const newOrderProduct = await addProductOrder(
          newUserCart.id,
          bodyProduct,
          token
        );
        console.log("new Order Product Order SINGLE DETAIL", newOrderProduct);

        userCart.push(newOrderProduct);
        setUserCart(userCart);
        console.log("Created Order SINGLE DETAIL", userCart);
        alert("Product Added to Cart");
      } else {


        const body = {
          productId: productId,
          price: product.price,
          quantity: quantity,
        };
        const orderProducts = findOrder ? findOrder.products : "";
        console.log("order Products from my orders cart:", orderProducts);

        const newOrderProduct = await addProductOrder(
          findOrder.orderId,
          body,
          token
        );
        console.log("new product added to cart:", newOrderProduct);

        const updatedProductOrder = {
          ...product,
          id: newOrderProduct.id,
          orderId: findOrder.id,
          price: newOrderProduct.price,
          productId: newOrderProduct.productId,
          quantity: newOrderProduct.quantity,
        };
        console.log("updated ProductOrder added to cart:", updatedProductOrder);


        let userCopy = [...userCart];
        userCopy.push(updatedProductOrder);
        setUserCart(userCopy);
        console.log("updated copy user cart:  ", userCart);
        console.log(
          "updated order products from finderOrder:  ",
          orderProducts
        );
        console.log("updated find order", findOrder);

        alert("Product Added to Cart");
      }
    }
  };

  if (!product) {
    return <div></div>;
  }
  return (
    <>
      <section className="return-home-button">
        <Button
          variant="outlined"
          onClick={() => {
            history.push(`/products`);
          }}
        >
          Return to all products
        </Button>
      </section>

      <div className="single-product-card">
        <img
          src={product.imageurl}
          className="product-image-detail"
          alt={product.name}
        />
        <section className="product-details">
          <h1 className="product-name"> {product.name} </h1>
          <div>
            <b>${product.price}</b>
          </div>
          <div> Description: {product.description}</div>
          <div className="product-details-buttons">
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => addProduct(product)}
            >
              Add To Cart
            </Button>
            <br></br>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() =>
                history.push(`/products/${productId}/review/create`)
              }
            >
              Add A Review
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default SingleDetail;
