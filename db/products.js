const client= require('./client');

async function createProducts({name, description, price, imageURL, inStock, category}){
    try {
        const { rows: [products]} = await client.query(`
            INSERT INTO products(name, description, price, imageURL, inStock, category)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `, [name, description, price, imageURL, inStock, category]
        );
        
        return products;
    } catch(error){
        throw error;
    }
}


module.exports={
    createProducts
};