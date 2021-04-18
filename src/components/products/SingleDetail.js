import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "./SingleDetail.css";
import { Paper, Button, makeStyles } from "@material-ui/core";
import { addProductOrder, createOrder, updateData, fetchCart } from "../../api/utils";
import { Alert, AlertTitle } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
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
  setUserData,
  myOrders,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [myOrderProducts, setMyOrderProducts] = useState({});
  const classes = useStyles();

  const { products } = allProducts;

  const history = useHistory();
  let { productId } = useParams();
  productId = parseInt(productId)

  const product = products
    ? products.find((product) => Number(productId) === Number(product.id))
    : null;
  // console.log('PRODUCTS', product)
  // console.log('TOKEN SINGLE DETAIL', token)
  console.log("USER CART SINGLE DETAIL", userCart);
  console.log('USER DATA SINGLE DETAIL', userData)


  const { price } = product ? product : <h1>LOADING</h1>;

  // find order w/ created status to later update
  const findOrder= myOrders? myOrders.find((order) => order.status = 'created') : null

const successAlert = ()=>{
  return (<div className={classes.root}>
   <Alert severity="success">This is a success alert — check it out!</Alert>
  </div>)
}

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
      
        if (userData &&userCart) {
          const body = {
            productId: productId,
            price: price,
            quantity: quantity,
          };

          const newOrderProduct = await addProductOrder(userCart.id, body, token);
          // setUserCart([...userProducts, newOrderProduct])
          if (newOrderProduct){
          setUserCart([...userCart.products, newOrderProduct]);
          setMyOrderProducts([...findOrder.products, newOrderProduct]);
          console.log("updated order ", newOrderProduct);
          return <Alert severity="success">This is a success alert — check it out!</Alert>
          }

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
        <Button
        variant= "outlined"
          onClick={() => {
            history.push(`/products`);
          }}
        >
          Return to all products
        </Button>
      </section>
     

        <div className='single-product-card'>
            <img src={product.imageurl} className="product-image-detail" alt={product.name} />
            <section className="product-details">
             <h1 className="product-name"> {product.name} </h1>
             <div><b>${product.price}</b></div>
             <div> Description: { product.description }</div>
             <div className="product-details-buttons">
             <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={ addProduct, successAlert}
          >
            Add To Cart
          </Button>
          <br></br>
             <Button 
            variant="outlined"
            color="primary"
            size="small"
             onClick ={() => history.push(`/products/${productId}/review/create`)}>
               Add A Review
               </Button>
               </div>
             </section>
        </div>

      </> 

    );
};

export default SingleDetail;
