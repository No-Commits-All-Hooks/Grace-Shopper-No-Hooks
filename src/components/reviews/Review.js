import { SettingsOutlined } from '@material-ui/icons';
import {React, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {
    fetchReviews,
    createReview,
    updateReview,
    deleteReview
} from '../../api/utils.js';

const Review = ({isUpdating, reviewId, productId, token, refreshAllProducts}) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [stars, setStars] = useState(0);

    const history = useHistory();

    return (
        <>
            <form onSubmit={async (event) => {
                if(isUpdating) {
                    updateReview(reviewId, title, content, stars, token)
                } else {
                    createReview(title, content, stars, productId, token)
                }
                history.push(`/products/${productId}`)
                await refreshAllProducts()
            }}>
                <input type="text" name="title" placeholder="Title" onChange={(event) => setTitle(event.target.value)}/>
                <input type="text" name="content" placeholder="Content" onChange={(event) => setContent(event.target.value)}/>
                <input type="number" name="stars" placeholder="Star Rating (0-5)" onChange={(event) => setStars(event.target.value)}/>
                <button type="submit">{isUpdating ? 'UPDATE' : 'CREATE'}</button>
                <button onClick={async () => {
                    history.push(`/products/${productId}`)
                    await refreshAllProducts()
                }}>CANCEL</button>
            </form>
        </>
    )
}

export default Review;