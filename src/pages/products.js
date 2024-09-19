import React, { useEffect, useState } from "react";

export function Products() {
  // Initialize content state
  const [content, setContent] = useState(<ProductList showForm={showForm} />);

  // Function to show the ProductForm component
  function showForm(product = {}) {
    setContent(<ProductForm product={product} showList={showList} />);
  }

  // Function to show the ProductList component
  function showList() {
    setContent(<ProductList showForm={showForm} />);
  }

  return <div className="container my-5">{content}</div>;
}

function ProductList({ showForm }) {
  const [products, setProducts] = useState([]);

  // Fetch products from the JSON server
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3004/products");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };
    fetchProducts();
  }, []);

  // Delete a product
  const deleteProduct = async (id) => {
    try {
      await fetch(`http://localhost:3004/products/${id}`, { method: "DELETE" });
      // Refresh product list after deletion
      const updatedProducts = products.filter(product => product.id !== id);
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };

  return (
    <>
      <h2 className="text-center mb-3">List of Products</h2>
      <button
        onClick={() => showForm()}
        type="button"
        className="btn btn-primary me-2"
      >
        Create
      </button>
      <button
        onClick={() => window.location.reload()} // Refresh page to get updated products
        type="button"
        className="btn btn-outline-primary me-2"
      >
        Refresh
      </button>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Price</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.brand}</td>
              <td>{product.category}</td>
              <td>{product.price}</td>
              <td>{product.createdAt}</td>
              <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                <button
                  onClick={() => showForm(product)}
                  type="button"
                  className="btn btn-primary btn-sm me-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  type="button"
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function ProductForm({ product, showList }) {
  const [errorMessage, setErrorMessage] = useState("");

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formProduct = Object.fromEntries(formData.entries());

    // Validate form fields
    if (!formProduct.name || !formProduct.brand || !formProduct.category || !formProduct.price) {
      setErrorMessage(
        <div className="alert alert-warning" role="alert">
          Please provide all the required fields!
        </div>
      );
      return;
    }

    // Parse price to a number
    formProduct.price = parseFloat(formProduct.price);

    try {
      if (product.id) {
        // Update existing product
        await fetch(`http://localhost:3004/products/${product.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formProduct),
        });
      } else {
        // Create new product
        formProduct.createdAt = new Date().toISOString().slice(0, 10);
        await fetch("http://localhost:3004/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formProduct),
        });
      }
      showList(); // Refresh product list
    } catch (error) {
      console.error("Error saving product: ", error);
    }
  };

  return (
    <>
      <h2 className="text-center mb-3">
        {product.id ? "Edit Product" : "Create New Product"}
      </h2>
      <div className="row">
        <div className="col-lg-6 mx-auto">
          {errorMessage}
          <form onSubmit={handleSubmit}>
            {product.id && (
              <div className="row mb-3">
                <label className="col-sm-4 col-form-label">ID</label>
                <div className="col-sm-8">
                  <input
                    readOnly
                    className="form-control-plaintext"
                    name="id"
                    defaultValue={product.id}
                  />
                </div>
              </div>
            )}
            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Name</label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  name="name"
                  defaultValue={product.name || ""}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Brand</label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  name="brand"
                  defaultValue={product.brand || ""}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Category</label>
              <div className="col-sm-8">
                <select
                  className="form-select"
                  name="category"
                  defaultValue={product.category || ""}
                >
                  <option value="Other">Other</option>
                  <option value="Phones">Phones</option>
                  <option value="Computers">Computers</option>
                  <option value="Accessories">Accessories</option>
                  <option value="GPS">GPS</option>
                  <option value="Cameras">Cameras</option>
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Price</label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  name="price"
                  type="number" // Ensure price input is numeric
                  defaultValue={product.price || ""}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Description</label>
              <div className="col-sm-8">
                <textarea
                  className="form-control"
                  name="description"
                  defaultValue={product.description || ""}
                />
              </div>
            </div>
            <div className="row">
              <div className="offset-sm-4 col-sm-4 d-grid">
                <button type="submit" className="btn btn-primary btn-sm me-3">
                  Save
                </button>
              </div>
              <div className="col-sm-4 d-grid">
                <button
                  onClick={() => showList()}
                  type="button"
                  className="btn btn-secondary me-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
