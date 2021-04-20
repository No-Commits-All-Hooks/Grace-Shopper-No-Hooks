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
  console.log('USER DATA SINGLE DETAIL', userData)
  // console.log('Guest Cart SINGLE DETAIL', guestCart)
   console.log('USER Cart SINGLE DETAIL', userCart)



  const { price } = product ? product : <h1>LOADING</h1>;

  // find order w/ created status to later update

// console.log('orderProducts SINGLE DETAIL', orderProducts)


  const addProduct = async () => {
//if no user logged in
    if (!userData.username){
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
      // setGuestCart(localStorage.setItem('guestCart', guestCart))
      localStorage.setItem('guestCart', JSON.stringify(guestCart));
      setGuestCart(guestCart)

      console.log('guest cart local', guestCart)
     
    }
    else if (userData){
      const userId = userData.id 
      
        if (userCart.length <=0 ) {
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

            userCart.push(newOrderProduct);
            setUserCart(userCart);
            console.log("Created Order SINGLE DETAIL", userCart);
            alert('Product Added to Cart')

        }
          const body = {
            productId: productId,
            price: price,
            quantity: quantity,
          };
          const findOrder= myOrders? myOrders.find((order) => order.status = 'created') : []
          const orderProducts= findOrder? findOrder.products : [];
          const newOrderProduct = await addProductOrder(userCart.id, body, token);
          // setUserCart([...userProducts, newOrderProduct])

          console.log("USER CART SINGLE DETAIL", userCart);

          orderProducts.push(newOrderProduct)
          setUserCart(userCart);
          setMyOrderProducts([...orderProducts, newOrderProduct]);
          console.log("updated order ", newOrderProduct);
            alert('Product Added to Cart')
        
        } 
          

        // localStorage.setItem('userCart', JSON.stringify(userCart));


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
            onClick={addProduct}
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
