import React from 'react';
import {
    fetchReviews,
    createReview,
    updateReview,
    deleteReview
} from '../../api/utils.js';

const Review = ({isUpdating, reviewId, productId, token}) => {
    return (
        <>
            <form onSubmit={(event) => {
                if(isUpdating) {
                    updateReview(reviewId, event.target.title, event.target.content, event.target.stars, token)
                } else {
                    createReview(event.target.title, event.target.content, event.target.stars, productId, token)
                }
            }}>
                <input type="text" name="title" placeholder="Title"/>
                <input type="text" name="content" placeholder="Content"/>
                <input type="number" name="stars" placeholder="Star Rating (0-5)"/>
                <button type="submit">{isUpdating ? 'UPDATE' : 'CREATE'}</button>
            </form>
        </>
    )
}

export default Review;