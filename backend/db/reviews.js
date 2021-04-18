const client = require('./client.js');

async function getReviewById(id) {
    try {
        const {rows: [review]} = await client.query(
        `
            SELECT *
            FROM reviews
            WHERE id=$1;
        `, [id]);

        return review;
    } catch(error) {
        throw error;
    }
}

async function getReviewsByUser(id) {
    try {
        const {rows: reviews} = await client.query(
        `
            SELECT *
            FROM reviews
            WHERE "userId"=$1;
        `, [id])

        return reviews;
    } catch(error) {
        throw error;
    }
}

async function getReviewsByProductId(id) {
    try {
        const {rows: reviews} = await client.query(
        `
            SELECT *
            FROM reviews
            WHERE "productId"=$1
        `, [id])

        return reviews;
    } catch(error) {
        throw error;
    }
}

async function deleteReview(id) {
    try {
        const {rows: [review]} = await client.query(
        `
            DELETE FROM reviews
            WHERE id=$1
            RETURNING *;
        `, [id])

        return review;
    } catch(error) {
        throw error;
    }
}

async function updateReview({ id, title, content, stars}) {
    try {
        const {rows: [review]} = await client.query(
        `
            UPDATE reviews
            SET title=$2,
                content=$3,
                stars=$4
            WHERE id=$1
            RETURNING *;
        `, [id, title, content, stars])

        return review;
    } catch(error) {
        throw error;
    }
}

async function createReview({ title, content, stars, userId, productId }) {
    try {
        const {rows: [review]} = await client.query(
        `
            INSERT INTO reviews(title, content, stars, "userId", "productId")
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `, [title, content, stars, userId, productId])

        return review;
    } catch(error) {
        throw error;
    }
}

module.exports = {
    getReviewById,
    getReviewsByUser,
    getReviewsByProductId,
    deleteReview,
    updateReview,
    createReview
}