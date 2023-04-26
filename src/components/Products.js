import React, { useState, useEffect } from "react";
import { API_URL } from '../config';

const fetchAllProducts = async () => {
    try {
        const response = await fetch(`${API_URL}/products`);
        const result = await response.json();
        if (result.error) {
            throw result.error;
        }
        return result;
      } catch (error) {
        console.error('Error fetching things', error);
      }
};

const addProduct = async (userId, productId, quantity, token) => {
  console.log("Add Product Vriables", userId, productId, quantity, token)
  try {
    const response = await fetch(`https://graceshopper-0xzy.onrender.com/api/orders/${productId}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId,
            productId,
            quantity
          })
        });
    const result = await response.json();
    console.log("LLLLLLLLLLLLLL", response)
    if (result.error) {
        throw result.error;
    }
    console.log("BBBBBBBBBBBBBBB", result)
    return result;
  } catch (error) {
    console.error('Error fetching things', error);
  }
};


// const addProduct = async (userId, productId, quantity, token) => {
//   console.log("Add Product Vriables", userId, productId, quantity, token)
//   return fetch(`https://graceshopper-0xzy.onrender.com/api/products/${productId}`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`
//     },
//     body: JSON.stringify({
//       userId,
//       productId,
//       quantity
//     })
//   })
//     .then(response => {console.log("LLLLLLLLLLLLLL", response); response.json()})
//     .then(result => {
//       console.log("BBBBBBBBBBBBBBB", result);
//       return result;
//     })
//     .catch(console.error);
// };

export const Products = () => {
        const [products, setProducts] = useState([])
        const [quantity, setQuantity] = useState([])
        const [productId, setProductId] = useState()
        const token = window.localStorage.getItem('token')
        const userId = window.localStorage.getItem('userId')
        // const [open, setOpen] = useState(false);
        // const [userR, setuserR] = useState([]);
        
    
        useEffect(() => {
            const fetchProducts = async () => {
              const products = await fetchAllProducts();
              console.log("These are the products", products)
              setProducts(products);
    
            };
        
            fetchProducts();
          }, []);

        const handleAdd = async (event) => {
          event.preventDefault();
          console.log("Product Id", event.target[2].value)
          console.log("UUUUUUUUUUUUU", quantity, userId)
          setProductId(event.target[2].value)
          const cart = await addProduct(userId, productId, quantity, token)
          return cart
        }
    
   
          
        return products.map((product) => (
            <div key={product.id} class="product" className="routines-contianer">
                <div>
                <img src={product.pictureUrl} alt={product.title} />
                    <h1>{product.title}</h1>
                    <h4>Price: </h4>
                    <p>{product.price}</p>
                    <h4>Description: </h4>
                    <p>{product.description}</p>
                    <h4>Product Inventory: </h4>
                    <p>{product.inventory}</p>
                    <h4>Pet Type: </h4>
                    <p>{product.petType}</p>
                    <div>{product.url ? product.url : "Picture"}</div>
                    <form onSubmit={handleAdd}>
                      <input 
                        type="number" 
                        onChange={event => setQuantity(event.target.value)} 
                        placeholder="Quantity..."
                      />
                      <button type="submit">Click Twice to Add Product to Cart</button>
                      <input value={product.id} className="hidden"/>
                    </form>
                </div> 
            </div>
        ))
}