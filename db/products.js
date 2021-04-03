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
//get all products return all fields from the table so in can be displayed 
async function getAllProducts() {

    try{ 

        const { rows: products } = await client.query(
            `SELECT *
            FROM products;
            `);

            return products;

    }catch(error){
        throw error;
    }
};

//This function returns one product base on the id passed in
async function getProductById(id) {

    try{
        const {rows: [product] } = await client.query(`
        SELECT *
        FROM products
        WHERE id=$1;
        `, [id]);
        // if you can't find a product return null
        if(!product){
           return null 
        }
        // return what they are looking for and sell, sell, sell
        return product;

    }catch(error){
        throw error;
    }

};   


module.exports={
    createProducts,
    getAllProducts,
    getProductById
};