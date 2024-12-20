import React, { useState } from "react";

//tailwind edited by: ethan
function AddProduct({ onProductAdded, user, DatabaseURL }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState(""); // New state for location
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !description || !image || !price || !location) {
      setError("Please fill out all fields.");
      return;
    }

    if (!name || !description || !image || !price || !location) {
      setError("Please fill out all fields.");
      return;
    }

    if (name.length > 30) {
      setError("Name cannot be longer than 30 characters.");
      return;
    }

    if (description.length > 255) {
      setError("Description cannot be longer than 255 characters.");
      return;
    }

    if (image.length > 255) {
      setError("Image URL cannot be longer than 255 characters.");
      return;
    }

    if (isNaN(price) || price <= 0) {
      setError("Price must be a positive number.");
      return;
    }

    if (location.length > 100) {
      setError("Location cannot be longer than 100 characters.");
      return;
    }

    setError("");

    const newProduct = {
      UserID: user.UserID,
      Name: name,
      Description: description,
      Image: image,
      Price: price,
      Location: location, // Include location in the request body
    };

    fetch(`${DatabaseURL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          onProductAdded();
          setName("");
          setDescription("");
          setImage("");
          setPrice("");
          setLocation(""); // Reset location field
        } else {
          console.error("Error adding product:", data.error);
        }
      })
      .catch((error) => console.error("Error adding product:", error));
  };

  return (
    <div className="text-black dark:text-white">
      <h1 className="my-10 text-4xl font-bold">Build a Listing...</h1>
      <form onSubmit={handleSubmit} className="px-3 flex flex-col gap-8">
        <div className="w-full flex flex-col gap-5">
          <div className="flex items-center justify-between gap-5">
            <p className="text-2xl">
              Title: <span className="text-xs text-gray-400">(30)</span>
            </p>
            <div className="relative">
              <input
                type="text"
                value={name}
                id="nameInput"
                onChange={(e) => setName(e.target.value)}
                required
                className="w-80 p-2 pr-12 rounded-md overflow-hidden dark:bg-[#202020] border-[#ffffff] dark:border-[#151515]"
              />
              <span className="absolute right-3 top-2">{name.length}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-2xl">
              Description: <span className="text-xs text-gray-400">(255)</span>
            </p>
            <div className="relative">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-80 p-2 pr-12 rounded-md overflow-hidden dark:bg-[#202020] border-[#ffffff] dark:border-[#151515]"
              />
              <span className="absolute right-3 top-2">
                {description.length}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-2xl">
              Image URL: <span className="text-xs text-gray-400">(255)</span>
            </p>
            <div className="relative">
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-80 p-2 pr-12 rounded-md overflow-hidden dark:bg-[#202020] border-[#ffffff] dark:border-[#151515]"
              />
              <span className="absolute right-3 top-2">{image.length}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-2xl">
              Location: <span className="text-xs text-gray-400">(100)</span>
            </p>
            <div className="relative">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-80 p-2 pr-12 rounded-md overflow-hidden dark:bg-[#202020] border-[#ffffff] dark:border-[#151515]"
              />
              <span className="absolute right-3 top-2">{location.length}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-2xl">Price: </p>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-80 p-2 rounded-md overflow-hidden dark:bg-[#202020] border-[#ffffff] dark:border-[#151515]"
            />
          </div>
          {/* <div className="flex items-center justify-between">
            <p className="text-2xl">Expiration Date: </p>
            <input
              type="datetime-local"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="w-80 p-2 rounded-md overflow-hidden dark:bg-[#202020] border-[#ffffff] dark:border-[#151515]"
            />
          </div> */}
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="p-2 rounded text-xl text-white bg-[#171717]"
        >
          Post Listing
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
