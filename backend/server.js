/* eslint-disable no-undef */
console.log("Server Version 32");

var express = require("express");
var cors = require("cors");
var mysql = require("mysql2");
var bcrypt = require("bcrypt");
var axios = require("axios");
var dotenv = require("dotenv");
dotenv.config();

var app = express();
var port = process.env.PORT || 3000;

//app.use(cors());
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
  connection.release();
});

// Get all users
app.get("/users", (req, res) => {
  const query = "SELECT * FROM Users";
  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ error: "Error fetching users" });
      return;
    }
    res.status(200).json(results);
  });
});

// Get all listings
app.get("/listings", (req, res) => {
  const query = `
    SELECT Listings.*, Users.Username, Users.ReviewScore, Users.ReviewAmount, Users.ProfilePhoto
    FROM Listings
    JOIN Users ON Listings.UserID = Users.UserID
  `;
  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching listings:", err);
      res.status(500).json({ error: "Error fetching listings" });
      return;
    }
    res.status(200).json(results);
  });
});

// Get all past transactions
app.get("/past-transactions", (req, res) => {
  const query = `
    SELECT PastTransactions.*, Listings.Name AS ListingName, Listings.Location AS ListingLocation, Buyers.Username AS BuyerName, Buyers.ProfilePhoto AS BuyerProfilePhoto, Sellers.Username AS SellerName, Sellers.ProfilePhoto AS SellerProfilePhoto
    FROM PastTransactions
    JOIN Listings ON PastTransactions.ListingID = Listings.ListingID
    JOIN Users AS Buyers ON PastTransactions.BuyerID = Buyers.UserID
    JOIN Users AS Sellers ON PastTransactions.SellerID = Sellers.UserID
  `;
  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching past transactions:", err);
      res.status(500).json({ error: "Error fetching past transactions" });
      return;
    }
    res.status(200).json(results);
  });
});

// User registration
app.post("/register", async (req, res) => {
  const { username, email, password, bio, profilePhoto, location } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const query =
    "INSERT INTO Users (Username, Email, Password, Bio, ProfilePhoto, Location) VALUES (?, ?, ?, ?, ?, ?)";
  pool.query(
    query,
    [username, email, hashedPassword, bio, profilePhoto, location],
    (err, results) => {
      if (err) {
        console.error("Error registering user:", err);
        res.status(500).json({ error: "Error registering user" });
        return;
      }
      res.status(201).json({ message: "User registered successfully" });
    }
  );
});

// User login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM Users WHERE Email = ?";
  pool.query(query, [email], async (err, results) => {
    if (err) {
      console.error("Error logging in:", err);
      res.status(500).json({ error: "Error logging in" });
      return;
    }
    if (results.length === 0) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.Password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    res.status(200).json({ message: "Login successful", user });
  });
});

// Delete User
app.delete("/users/:userId", (req, res) => {
  const { userId } = req.params;
  const query = "DELETE FROM Users WHERE UserID = ?";

  pool.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error deleting user" });
    }
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  });
});

// Get all products with user information
app.get("/products", (req, res) => {
  const query = `
    SELECT Listings.*, Users.Username, Users.Email, Users.ProfilePhoto, Users.ReviewScore, Users.ReviewAmount
    FROM Listings
    JOIN Users ON Listings.UserID = Users.UserID
  `;
  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      res.status(500).json({ error: "Error fetching products" });
      return;
    }
    res.status(200).json(results);
  });
});

// Add a new product
app.post("/products", async (req, res) => {
  const { UserID, Name, Description, Image, Price, ExpirationDate, Location } =
    req.body;

  // Call the Nominatim API to get latitude and longitude
  const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    Location
  )}&format=json&limit=1`;

  try {
    const response = await axios.get(nominatimUrl);
    if (response.data.length === 0) {
      return res.status(400).json({ error: "Invalid address" });
    }

    const { lat, lon } = response.data[0];
    const Latitude = parseFloat(lat);
    const Longitude = parseFloat(lon);

    const query = `
      INSERT INTO Listings (UserID, Name, Description, Image, Price, ExpirationDate, Location, Latitude, Longitude)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    pool.query(
      query,
      [
        UserID,
        Name,
        Description,
        Image,
        Price,
        ExpirationDate,
        Location,
        Latitude,
        Longitude,
      ],
      (err, results) => {
        if (err) {
          console.error("Error adding product:", err);
          return res.status(500).json({ error: "Error adding product" });
        }
        res.status(201).json({ message: "Product added successfully" });
      }
    );
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    res.status(500).json({ error: "Error fetching coordinates" });
  }
});

// Add a new offer
app.post("/offers", (req, res) => {
  const { ListingID, SellerID, BuyerID, OfferAmount } = req.body;
  const query =
    "INSERT INTO Offers (ListingID, SellerID, BuyerID, OfferAmount) VALUES (?, ?, ?, ?)";
  pool.query(
    query,
    [ListingID, SellerID, BuyerID, OfferAmount],
    (err, results) => {
      if (err) {
        console.error("Error making offer:", err);
        res.status(500).json({ error: "Error making offer" });
        return;
      }
      res.status(201).json({ message: "Offer made successfully" });
    }
  );
});

// Update an offer with a new proposed amount
app.put("/offers/:offerId", (req, res) => {
  const { offerId } = req.params;
  const { newAmount } = req.body;

  const query = `
    UPDATE Offers
    SET OfferAmount = ?
    WHERE OfferID = ?
  `;

  pool.query(query, [newAmount, offerId], (err, results) => {
    if (err) {
      console.error("Error updating offer:", err);
      return res.status(500).json({ error: "Error updating offer" });
    }

    res.status(200).json({ message: "Offer updated successfully" });
  });
});

// Get all offers for a specific user (as a seller)
app.get("/offers/:userId", (req, res) => {
  const { userId } = req.params;
  const query = `
    SELECT Offers.*, Listings.Name AS ListingName, Listings.Location, Buyers.Username AS BuyerName, Buyers.ProfilePhoto AS BuyerProfilePhoto
    FROM Offers
    JOIN Listings ON Offers.ListingID = Listings.ListingID
    JOIN Users AS Buyers ON Offers.BuyerID = Buyers.UserID
    WHERE Offers.SellerID = ?
  `;
  pool.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching offers:", err);
      res.status(500).json({ error: "Error fetching offers" });
      return;
    }
    res.status(200).json(results);
  });
});

// Get User Data
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM Users WHERE UserID = ?";
  pool.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching user data:", err);
      res.status(500).json({ error: "Error fetching user data" });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json(results[0]);
  });
});

// Get User Data by Username
app.get("/users/profile/:username", (req, res) => {
  const { username } = req.params;
  const query = "SELECT * FROM Users WHERE Username = ?";
  pool.query(query, [username], (err, results) => {
    if (err) {
      console.error("Error fetching user data:", err);
      res.status(500).json({ error: "Error fetching user data" });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json(results[0]);
  });
});

// Update User Data
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const fields = req.body;
  const query = "UPDATE Users SET ? WHERE UserID = ?";
  pool.query(query, [fields, id], (err, results) => {
    if (err) {
      console.error("Error updating user profile:", err);
      res.status(500).json({ error: "Error updating user profile" });
      return;
    }
    res.status(200).json({ message: "User profile updated successfully" });
  });
});

// Change password
app.put("/users/:userId/change-password", async (req, res) => {
  const { userId } = req.params;
  const { oldPassword, newPassword } = req.body;

  const getUserQuery = "SELECT Password FROM Users WHERE UserID = ?";
  const updatePasswordQuery = "UPDATE Users SET Password = ? WHERE UserID = ?";

  try {
    // Get the user's current password
    const [user] = await new Promise((resolve, reject) => {
      pool.query(getUserQuery, [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if the old password is correct
    const isPasswordValid = await bcrypt.compare(oldPassword, user.Password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Old password is incorrect" });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    await new Promise((resolve, reject) => {
      pool.query(
        updatePasswordQuery,
        [hashedNewPassword, userId],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });

    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res
      .status(500)
      .json({ success: false, message: "Error changing password" });
  }
});

// Add a listing to favorites
app.post("/favorites", (req, res) => {
  const { userID, listingID } = req.body;

  const query = "INSERT INTO Favorites (UserID, ListingID) VALUES (?, ?)";
  pool.query(query, [userID, listingID], (err, results) => {
    if (err) {
      console.error("Error adding favorite:", err);
      return res.status(500).json({ error: "Error adding favorite" });
    }
    res.status(200).json({ message: "Favorite added successfully" });
  });
});

// Remove a listing from favorites
app.delete("/favorites", (req, res) => {
  const { userID, listingID } = req.body;

  const query = "DELETE FROM Favorites WHERE UserID = ? AND ListingID = ?";
  pool.query(query, [userID, listingID], (err, results) => {
    if (err) {
      console.error("Error removing favorite:", err);
      return res.status(500).json({ error: "Error removing favorite" });
    }
    res.status(200).json({ message: "Favorite removed successfully" });
  });
});

// Get all favorite listings for a specific user
app.get("/favorites/:userID", (req, res) => {
  const { userID } = req.params;

  if (!userID || isNaN(userID)) {
    return res.status(400).json({ error: "Invalid UserID" });
  }

  const query = `
    SELECT Listings.*
    FROM Listings
    INNER JOIN Favorites ON Listings.ListingID = Favorites.ListingID
    WHERE Favorites.UserID = ?
  `;

  pool.query(query, [userID], (err, results) => {
    if (err) {
      console.error("Error fetching favorite listings:", err);
      return res
        .status(500)
        .json({ error: "Error fetching favorite listings" });
    }

    res.status(200).json({
      message: "Favorite listings retrieved successfully",
      listings: results,
    });
  });
});

// Get a specific listing by ListingID
app.get("/listings/:ListingID", (req, res) => {
  const { ListingID } = req.params;
  const query = `
    SELECT Listings.*, Users.Username, Users.ReviewScore, Users.ReviewAmount, Users.ProfilePhoto
    FROM Listings
    JOIN Users ON Listings.UserID = Users.UserID
    WHERE Listings.ListingID = ?
  `;
  pool.query(query, [ListingID], (err, results) => {
    if (err) {
      console.error("Error fetching listing:", err);
      res.status(500).json({ error: "Error fetching listing" });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: "Listing not found" });
      return;
    }
    res.status(200).json(results[0]);
  });
});

// Update a listing
app.put("/listings/:ListingID", async (req, res) => {
  const { ListingID } = req.params;
  const { Name, Description, Price, Location, Image } = req.body;

  // Call the Nominatim API to get latitude and longitude if the location is updated
  const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    Location
  )}&format=json&limit=1`;

  try {
    const response = await axios.get(nominatimUrl);
    if (response.data.length === 0) {
      return res.status(400).json({ error: "Invalid address" });
    }

    const { lat, lon } = response.data[0];
    const Latitude = parseFloat(lat);
    const Longitude = parseFloat(lon);

    const query = `
      UPDATE Listings
      SET Name = ?, Description = ?, Price = ?, Location = ?, Image = ?, Latitude = ?, Longitude = ?
      WHERE ListingID = ?
    `;
    pool.query(
      query,
      [
        Name,
        Description,
        Price,
        Location,
        Image,
        Latitude,
        Longitude,
        ListingID,
      ],
      (err, results) => {
        if (err) {
          console.error("Error updating listing:", err);
          return res.status(500).json({ error: "Error updating listing" });
        }
        res.status(200).json({ message: "Listing updated successfully" });
      }
    );
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    res.status(500).json({ error: "Error fetching coordinates" });
  }
});

// Delete a listing
app.delete("/listings/:listingId", (req, res) => {
  const { listingId } = req.params;
  const query = "DELETE FROM Listings WHERE ListingID = ?";

  pool.query(query, [listingId], (err, results) => {
    if (err) {
      console.error("Error deleting listing:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error deleting listing" });
    }
    res
      .status(200)
      .json({ success: true, message: "Listing deleted successfully" });
  });
});

// Accept an offer and move it to ActiveTransactions
app.post("/accept-offer", (req, res) => {
  const { OfferID, ListingID, SellerID, BuyerID, OfferAmount } = req.body;

  const insertQuery = `
    INSERT INTO ActiveTransactions (ListingID, SellerID, BuyerID, Amount)
    VALUES (?, ?, ?, ?)
  `;
  const deleteQuery = `
    DELETE FROM Offers WHERE OfferID = ?
  `;

  pool.query(
    insertQuery,
    [ListingID, SellerID, BuyerID, OfferAmount],
    (err, results) => {
      if (err) {
        console.error("Error moving offer to ActiveTransactions:", err);
        return res
          .status(500)
          .json({ error: "Error moving offer to ActiveTransactions" });
      }

      pool.query(deleteQuery, [OfferID], (err, results) => {
        if (err) {
          console.error("Error deleting offer:", err);
          return res.status(500).json({ error: "Error deleting offer" });
        }

        res
          .status(200)
          .json({ message: "Offer accepted and moved to ActiveTransactions" });
      });
    }
  );
});

// Accept an offer from a message and update the Amount in ActiveTransactions
app.post("/accept-message-offer", (req, res) => {
  const { TransactionID, OfferAmount } = req.body;

  const updateQuery = `
    UPDATE ActiveTransactions
    SET Amount = ?
    WHERE TransactionID = ?
  `;

  pool.query(updateQuery, [OfferAmount, TransactionID], (err, results) => {
    if (err) {
      console.error("Error updating transaction amount:", err);
      return res
        .status(500)
        .json({ error: "Error updating transaction amount" });
    }

    res
      .status(200)
      .json({ message: "Transaction amount updated successfully" });
  });
});

// Decline an offer (delete it from the Offers table)
app.post("/decline-offer", (req, res) => {
  const { OfferID } = req.body;

  const deleteQuery = `
    DELETE FROM Offers WHERE OfferID = ?
  `;

  pool.query(deleteQuery, [OfferID], (err, results) => {
    if (err) {
      console.error("Error deleting offer:", err);
      return res.status(500).json({ error: "Error deleting offer" });
    }

    res
      .status(200)
      .json({ message: "Offer declined and deleted successfully" });
  });
});

// Decline an offer and delete the offer message
app.post("/decline-message-offer", (req, res) => {
  const { MessageID } = req.body;

  const deleteMessageQuery = `
    DELETE FROM Messages WHERE MessageID = ?
  `;

  pool.query(deleteMessageQuery, [MessageID], (err, results) => {
    if (err) {
      console.error("Error deleting message:", err);
      return res.status(500).json({ error: "Error deleting message" });
    }

    res
      .status(200)
      .json({ message: "Offer declined and message deleted successfully" });
  });
});

// Make new ActiveTransaction
app.post("/active-transactions", (req, res) => {
  const { ListingID, SellerID, BuyerID, Amount } = req.body;
  const query = `
    INSERT INTO ActiveTransactions (ListingID, SellerID, BuyerID, Amount)
    VALUES (?, ?, ?, ?)
  `;

  pool.query(query, [ListingID, SellerID, BuyerID, Amount], (err, results) => {
    if (err) {
      console.error("Error creating active transaction:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error creating active transaction" });
    }
    res.status(201).json({
      success: true,
      message: "Active transaction created successfully",
    });
  });
});

// Get all active transactions for a specific user (as a seller)
app.get("/active-transactions/:userId", (req, res) => {
  const { userId } = req.params;
  const query = `
    SELECT ActiveTransactions.*, Listings.Name AS ListingName, Listings.Image, Listings.Description AS ListingDescription, Listings.Location AS ListingLocation, Buyers.Username AS BuyerName, Buyers.ProfilePhoto AS BuyerProfilePhoto, Sellers.Username AS SellerName, Sellers.ProfilePhoto AS SellerProfilePhoto
    FROM ActiveTransactions
    JOIN Listings ON ActiveTransactions.ListingID = Listings.ListingID
    JOIN Users AS Buyers ON ActiveTransactions.BuyerID = Buyers.UserID
    JOIN Users AS Sellers ON ActiveTransactions.SellerID = Sellers.UserID
    WHERE Sellers.UserID = ? OR Buyers.UserID = ?
  `;
  pool.query(query, [userId, userId], (err, results) => {
    if (err) {
      console.error("Error fetching active transactions:", err);
      res.status(500).json({ error: "Error fetching active transactions" });
      return;
    }
    res.status(200).json(results);
  });
});

// Get messages for a specific transaction
app.get("/messages/:transactionId", (req, res) => {
  const { transactionId } = req.params;
  const query = `
    SELECT MessageID, TransactionID, SenderID, Content, IsOffer, OfferAmount, Timestamp
    FROM Messages
    WHERE TransactionID = ?
  `;
  pool.query(query, [transactionId], (err, results) => {
    if (err) {
      console.error("Error fetching messages:", err);
      res.status(500).json({ error: "Error fetching messages" });
      return;
    }
    res.status(200).json(results);
  });
});

// Post a new message
app.post("/messages", (req, res) => {
  const { transactionId, senderId, content, isOffer, offerAmount } = req.body;
  const query = `
    INSERT INTO Messages (TransactionID, SenderID, Content, IsOffer, OfferAmount) VALUES (?, ?, ?, ?, ?)
  `;
  pool.query(
    query,
    [transactionId, senderId, content, isOffer, offerAmount],
    (err, results) => {
      if (err) {
        console.error("Error posting message:", err);
        res.status(500).json({ error: "Error posting message" });
        return;
      }
      res
        .status(201)
        .json({ message: "Message posted successfully", id: results.insertId });
    }
  );
});

// Send a message back to the buyer when an offer is declined
app.post("/messages/decline", (req, res) => {
  const { transactionId, senderId, content, isOffer } = req.body;

  const query = `
    INSERT INTO Messages (TransactionID, SenderID, Content, IsOffer) VALUES (?, ?, ?, ?)
  `;

  pool.query(
    query,
    [transactionId, senderId, content, isOffer],
    (err, results) => {
      if (err) {
        console.error("Error sending message:", err);
        return res.status(500).json({ error: "Error sending message" });
      }

      res
        .status(201)
        .json({ message: "Message sent successfully", id: results.insertId });
    }
  );
});

// Confirm a sale (move it to PastTransactions)
app.post("/confirm-sale", (req, res) => {
  const { transactionId } = req.body;

  const moveQuery = `
    INSERT INTO PastTransactions (TransactionID, ListingID, SellerID, BuyerID, Amount)
    SELECT TransactionID, ListingID, SellerID, BuyerID, Amount
    FROM ActiveTransactions
    WHERE TransactionID = ?
  `;
  const deleteMessagesQuery = `
    DELETE FROM Messages WHERE TransactionID = ?
  `;
  const deleteTransactionQuery = `
    DELETE FROM ActiveTransactions WHERE TransactionID = ?
  `;
  const getListingIdQuery = `
    SELECT ListingID FROM ActiveTransactions WHERE TransactionID = ?
  `;
  const updateListingQuery = `
    UPDATE Listings SET IsSold = TRUE WHERE ListingID = ?
  `;
  const deleteFavoritesQuery = `
    DELETE FROM Favorites WHERE ListingID = ?
  `;

  pool.query(getListingIdQuery, [transactionId], (err, results) => {
    if (err) {
      console.error("Error getting listing ID:", err);
      return res.status(500).json({ error: "Error getting listing ID" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const listingId = results[0].ListingID;

    pool.query(moveQuery, [transactionId], (err, results) => {
      if (err) {
        console.error("Error moving transaction to PastTransactions:", err);
        return res
          .status(500)
          .json({ error: "Error moving transaction to PastTransactions" });
      }

      pool.query(deleteMessagesQuery, [transactionId], (err, results) => {
        if (err) {
          console.error("Error deleting messages:", err);
          return res.status(500).json({ error: "Error deleting messages" });
        }

        pool.query(deleteTransactionQuery, [transactionId], (err, results) => {
          if (err) {
            console.error(
              "Error deleting transaction from ActiveTransactions:",
              err
            );
            return res.status(500).json({
              error: "Error deleting transaction from ActiveTransactions",
            });
          }

          pool.query(updateListingQuery, [listingId], (err, results) => {
            if (err) {
              console.error("Error updating listing:", err);
              return res.status(500).json({ error: "Error updating listing" });
            }

            pool.query(deleteFavoritesQuery, [listingId], (err, results) => {
              if (err) {
                console.error("Error deleting favorites:", err);
                return res
                  .status(500)
                  .json({ error: "Error deleting favorites" });
              }

              res.status(200).json({
                message: "Transaction confirmed and moved to PastTransactions",
              });
            });
          });
        });
      });
    });
  });
});

// Cancel a sale (delete it from ActiveTransactions)
app.post("/cancel-sale", (req, res) => {
  const { transactionId } = req.body;

  const deleteMessagesQuery = `
    DELETE FROM Messages WHERE TransactionID = ?
  `;
  const deleteTransactionQuery = `
    DELETE FROM ActiveTransactions WHERE TransactionID = ?
  `;
  const getListingIdQuery = `
    SELECT ListingID FROM ActiveTransactions WHERE TransactionID = ?
  `;
  const deleteFavoritesQuery = `
    DELETE FROM Favorites WHERE ListingID = ?
  `;

  pool.query(getListingIdQuery, [transactionId], (err, results) => {
    if (err) {
      console.error("Error getting listing ID:", err);
      return res.status(500).json({ error: "Error getting listing ID" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const listingId = results[0].ListingID;

    pool.query(deleteMessagesQuery, [transactionId], (err, results) => {
      if (err) {
        console.error("Error deleting messages:", err);
        return res.status(500).json({ error: "Error deleting messages" });
      }

      pool.query(deleteTransactionQuery, [transactionId], (err, results) => {
        if (err) {
          console.error(
            "Error deleting transaction from ActiveTransactions:",
            err
          );
          return res.status(500).json({
            error: "Error deleting transaction from ActiveTransactions",
          });
        }

        pool.query(deleteFavoritesQuery, [listingId], (err, results) => {
          if (err) {
            console.error("Error deleting favorites:", err);
            return res.status(500).json({ error: "Error deleting favorites" });
          }

          res.status(200).json({
            message: "Transaction canceled and deleted successfully",
          });
        });
      });
    });
  });
});

// Get all past transactions for a specific user
app.get("/past-transactions/:userId", (req, res) => {
  const { userId } = req.params;
  const query = `
    SELECT PastTransactions.*, Listings.Name AS ListingName, Listings.Location AS ListingLocation, Buyers.Username AS BuyerName, Buyers.ProfilePhoto AS BuyerProfilePhoto, Sellers.Username AS SellerName, Sellers.ProfilePhoto AS SellerProfilePhoto
    FROM PastTransactions
    JOIN Listings ON PastTransactions.ListingID = Listings.ListingID
    JOIN Users AS Buyers ON PastTransactions.BuyerID = Buyers.UserID
    JOIN Users AS Sellers ON PastTransactions.SellerID = Sellers.UserID
    WHERE Sellers.UserID = ? OR Buyers.UserID = ?
  `;
  pool.query(query, [userId, userId], (err, results) => {
    if (err) {
      console.error("Error fetching past transactions:", err);
      res.status(500).json({ error: "Error fetching past transactions" });
      return;
    }
    res.status(200).json(results);
  });
});

// // SSL certificate
// const privateKey = fs.readFileSync("./key.pem", "utf8");
// const certificate = fs.readFileSync("./cert.pem", "utf8");

// const credentials = {
//   key: privateKey,
//   cert: certificate,
// };

// const httpsServer = https.createServer(credentials, app);

// httpsServer.listen(PORT, () => {
//   console.log(`Server is running on localhost:${PORT}`);
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
