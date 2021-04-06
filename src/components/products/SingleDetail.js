// import React from 'react';
// import { useHistory, useParams } from 'react-router-dom';




// const Post = ({posts, setPosts, token, userData}) => {

// const history= useHistory()
// const {productsId} = useParams();
// const post = posts.find((post) => postId === post._id);
// const userId= userData._id

// console.log('post:', post)


//   if (!post){
//       return <div></div>
//   } 
//   const postAuthor = post.author._id;

//   return (

//         <div className='single-post'>
//              <h5> {post.title} </h5>
//              <div> Posted by: { post.author.username }</div>
//              <div> Location: { post.location }</div>
//              <div> Description: { post.description }</div>
//              <div>Price : ${post.price}</div>
//              <div>Delivers: { post.willDeliver ? 'Yes' : 'No' }</div>
//              {userId === postAuthor && postAuthor? (
//              <button onClick= {handleDelete}>Delete</button>)
//              : null
//              }
//              {userId !== postAuthor ? (
//             <button
//             onClick= {() =>{
//             history.push(`/posts/${postId}/messages`)
//             }} > Reply</button>) : null
//             }
//         </div>
//     )
// }

// export default Post