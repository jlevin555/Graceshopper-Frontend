import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

async function addNewProduct(postObj, userToken) {
  console.log('AAAAAAAAAAAAAAA', postObj, userToken);
  return fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userToken}`,
    },
    body: JSON.stringify(postObj),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log('BBBBBBBBBBBBBBB', result);
      if (result.error === 'Name already exists') {
        window.alert('A product with that name already exists');
      }
      return result;
    })
    .catch(console.error);
}

async function updateProduct(productId, obj, token) {
  console.log("updateProduct", productId, obj, token);
  return fetch(`${API_URL}/products/${productId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(obj)
  })
  .then(response => response.json())
  .then(result => {
    console.log("TTTTTTT", result);
     return result
  })
  .catch(console.error);
}

async function deleteProduct (productId, token) {
  console.log("deleteProduct", productId, token);
  return fetch(`${API_URL}/products/${productId}`, {
    method : 'DELETE',
    headers :{
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(result => {
    console.log("result of delete", result);
     return result
  })
  .catch(console.error);
}

async function fetchAllUsers() {
  try {
    const resp = await fetch(`${API_URL}/users`);
    const result = await resp.json();

    if (result.error) {
      throw result.error;
    }
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateUser(userId, obj, token) {
  console.log('YYYYYYYYYYYYYYY', userId, obj, token);
  console.log('ZZZZZZZZZZZZZZZZZZZZ', JSON.stringify(obj));
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),
    });
    console.log('OOOOOOOOOOOOO', response);
    const result = await response.json();
    if (result.error) {
      throw result.error;
    }
    console.log('PPPPPPPPPPPPPP', result);
    return result;
  } catch (error) {
    console.error(error);
  }
}

export const Admin = () => {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [price, setPrice] = useState();
  const [inventory, setInventory] = useState();
  const [petType, setPetType] = useState();
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState();
  const [isEngineer, setIsEngineer] = useState();
  const [isAdmin, setIsAdmin] = useState();
  const [url, setURL] = useState();
  const [productId, setProductId] = useState();
  const token = window.localStorage.getItem('token');
  const handleSubmit = async (event) => {
    event.preventDefault();
    const obj = {
      title,
      description,
      price,
      inventory,
      petType,
      url: url,
    };
    await addNewProduct(obj, token);
  };
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchAllUsers();
      setUsers(result);
    };
    fetchData();
  });

  const handleUser = async (event) => {
    event.preventDefault();
    console.log('event target', event.target[3].value);
    setUserId(event.target[3].value);
    console.log('userId', userId);
    const obj = { id: userId, engineer: isEngineer, admin: isAdmin };
    console.log('updateUser', userId, obj, token);
    const updated = await updateUser(userId, obj, token);
    return updated;
  };

  const handleEdit = async (event) => {
    event.preventDefault();
    console.log("events", event.target[0].value);
    setProductId(event.target[0].value);
    const obj = {
      id: productId,
      title,
      description, 
      price,
      inventory,
      petType,
      url
    }
    const updatedProduct = await updateProduct(productId, obj, token);
    return updatedProduct;
  }
 const handleDelete = async (event) => {
  event.preventDefault();
  console.log("handleDelete", event )
  setProductId(event.target[0].value)
  const deletedProduct= await deleteProduct (productId, token)
  return deletedProduct
 }
  return (
    <div>
      <form onSubmit={handleSubmit} class="login" className="add-product">
        <label>
          <p>Name</p>
          <input
            type="text"
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Name..."
          />
        </label>
        <label>
          <p>Description</p>
          <input
            type="text"
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Description..."
          />
        </label>
        <label>
          <p>Price</p>
          <input
            type="number"
            onChange={(event) => setPrice(event.target.value)}
            placeholder="Price..."
          />
        </label>
        <label>
          <p>Inventory</p>
          <input
            type="number"
            onChange={(event) => setInventory(event.target.value)}
            placeholder="Inventory..."
          />
        </label>
        <label>
          <p>Pet Type</p>
          <input
            type="text"
            onChange={(event) => setPetType(event.target.value)}
            placeholder="Pet Type..."
          />
        </label>
        <label>
          <p>Image URL (Does not work yet)</p>
          <input
            type="url"
            onChange={(event) => setURL(event.target.value)}
            placeholder="URL Link..."
          />
        </label>
        <div>
          <button type="submit">Create New Product</button>
        </div>
      </form>

      <div>
        <form onSubmit={handleEdit}>
          <label>
            <p>Product Id</p>
            <input
            type='text'
            onChange={event => setProductId(event.target.value)}
            placeholder='Enter Product Id'
            />
          </label>
          <label>
          <p>Name</p>
          <input 
            type="text" 
            onChange={event => setTitle(event.target.value)} 
            placeholder="Name..."
          />
        </label>
        <label>
          <p>Description</p>
          <input 
            type="text" 
            onChange={event => setDescription(event.target.value)} 
            placeholder="Description..."
          />
        </label>
        <label>
          <p>Price</p>
          <input 
            type="number" 
            onChange={event => setPrice(event.target.value)} 
            placeholder="Price..."
          />
        </label>
        <label>
          <p>Inventory</p>
          <input 
            type="number" 
            onChange={event => setInventory(event.target.value)} 
            placeholder="Inventory..."
          />
        </label>
        <label>
          <p>Pet Type</p>
          <input 
            type="text" 
            onChange={event => setPetType(event.target.value)} 
            placeholder="Pet Type..."
          />
        </label>
        <label>
          <p>Image URL (Does not work yet)</p>
          <input 
            type="text" 
            onChange={event => setURL(event.target.value)} 
            placeholder="URL Link..."
          />
        </label>
        <button 
            type="submit">
              Edit Product
          </button>
        </form>
        <form onSubmit = {handleDelete}>
          <label>
            <p> Delet Product</p>
            <input
            type = "number"
            onChange = {event => setProductId(event.target.value)}
            placeholder ="Delete Product"
            />
          </label>
          <button
          type ="submit">
            Delete Product
          </button>
        </form>
      </div>
      <div>
        {users.map((user) => (
          <div key={user.id} className="users">
            <h4>Email: {user.email}</h4>
            <div>Engineer: {user.engineer ? `Yes` : `No`}</div>
            <div>Admin: {user.admin ? `Yes` : `No`}</div>
            <form onSubmit={handleUser}>
              <div>
                <label>
                  <p>Engineer</p>
                  <input
                    type="checkbox"
                    onChange={(event) => setIsEngineer(true)}
                  />
                </label>
                <label>
                  <p>Admin</p>
                  <input
                    type="checkbox"
                    onChange={(event) => setIsAdmin(true)}
                  />
                </label>
              </div>
              <button type="submit">Click TWICE to Submit</button>
              <input value={user.id} className="hidden" />
            </form>
          </div>
        ))}
      </div>
    </div>
  );
};

// export const Admin = () => {
// //   add products, edit and delete products, view user information,
// //  allow checkout options
// //  get all users

//     return (
//     <div className="admin-bar">
//       <Link className='add-product'>Add Product</Link>
//       <Link className='edit-product'>Edit Product</Link>
//       <Link className='delete-product'>Delete Product</Link>
//       <Link className='view-user'>View User</Link>
//       <Link className='get-all-users'>Get All Users</Link>
//       <h5>Admin</h5>
//     </div>
//   );
// };
