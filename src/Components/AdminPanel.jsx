import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import OneListing from "./Landing/OneListing";

function AdminPanel({ user, updateUser, DatabaseURL }) {
  const [panelMode, setPanelMode] = useState("listings");
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [profileVisible, setProfileVisible] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [location, setLocation] = useState("");
  const [reviewScore, setReviewScore] = useState(0);
  const [reviewAmount, setReviewAmount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordVisable, setPasswordVisable] = useState(false);

  const getUserInfo = (u) => {
    fetch(`${DatabaseURL}/users/${u}`)
      .then((response) => response.json())
      .then((data) => {
        setUsername(data.Username);
        setEmail(data.Email);
        setBio(data.Bio);
        setProfilePhoto(data.ProfilePhoto);
        setLocation(data.Location);
        setReviewScore(data.ReviewScore);
        setReviewAmount(data.ReviewAmount);
        setIsAdmin(data.IsAdmin);
      })
      .catch((error) => console.error("Error fetching user data:", error));
  };

  //   const handleEdit = (field, value, user) => {
  //     console.log(
  //       `handleEdit called with field: ${field}, value: ${value}, user: ${user.UserID}`
  //     );

  //     fetch(`${DatabaseURL}/users/${user.UserID}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ [field]: value }),
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         console.log(`Response from server:`, data);

  //         fetch(`${DatabaseURL}/users/${user.UserID}`)
  //           .then((response) => response.json())
  //           .then((data) => {
  //             setUsername(data.Username);
  //             setEmail(data.Email);
  //             setBio(data.Bio);
  //             setProfilePhoto(data.ProfilePhoto);
  //             setLocation(data.Location);
  //             setReviewScore(data.ReviewScore);
  //             setReviewAmount(data.ReviewAmount);
  //             setIsAdmin(data.IsAdmin);
  //           })
  //           .catch((error) => console.error("Error fetching user data:", error));
  //       })
  //       .catch((error) => console.error("Error updating user data:", error));
  //   };

  const handleEdit = (field, value) => {
    console.log(
      `handleEdit called with field: ${field}, value: ${value}, user: ${selectedUser.UserID}`
    );

    fetch(`${DatabaseURL}/users/${selectedUser.UserID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ [field]: value }),
    })
      .then((response) => response.json())
      .then((data) => {
        setUsername(data.Username);
        setEmail(data.Email);
        setBio(data.Bio);
        setProfilePhoto(data.ProfilePhoto);
        setLocation(data.Location);
        setReviewScore(data.ReviewScore);
        setReviewAmount(data.ReviewAmount);
        setIsAdmin(data.IsAdmin);
        handleProfileVisible;
      })
      .catch((error) => console.error("Error updating user data:", error));
  };

  const handleChangePassword = () => {
    fetch(`${DatabaseURL}/users/${user.UserID}/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Password changed successfully!");
        } else {
          console.log("Error changing password: " + data.message);
        }
      })
      .catch((error) => console.error("Error changing password:", error));
  };

  const fetchAll = () => {
    fetch(`${DatabaseURL}/users`)
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));

    fetch(`${DatabaseURL}/listings`)
      .then((response) => response.json())
      .then((data) => setListings(data))
      .catch((error) => console.error("Error fetching listings:", error));

    fetch(`${DatabaseURL}/past-transactions`)
      .then((response) => response.json())
      .then((data) => setTransactions(data))
      .catch((error) => console.error("Error fetching transactions:", error));
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 5000);
    return () => clearInterval(interval);
  }, [DatabaseURL]);

  const handleDeleteUser = (userId) => {
    fetch(`${DatabaseURL}/users/${userId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setUsers(users.filter((user) => user.UserID !== userId));
        } else {
          console.log("Error deleting user: " + data.message);
        }
      })
      .catch((error) => console.error("Error deleting user:", error));
  };

  const handleMessageUser = (userId) => {
    const newTransaction = {
      ListingID: 1, // Assuming the listing ID is 1
      SellerID: user.UserID, // Admin user
      BuyerID: userId, // Selected user
      Amount: 0, // Set an initial amount if needed
    };

    fetch(`${DatabaseURL}/active-transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTransaction),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Active transaction created successfully!");
        } else {
          console.log("Error creating active transaction: " + data.message);
        }
      })
      .catch((error) =>
        console.error("Error creating active transaction:", error)
      );
  };

  // Inside the dropdown menu
  <button
    className="block w-full px-4 py-2 text-left text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
    onClick={() => handleMessageUser(user.UserID)}
  >
    Message User
  </button>;

  const handlePanelChange = (mode) => {
    setPanelMode(mode);
  };

  const handleUserClick = (userId) => {
    setSelectedUser(userId);
  };

  const handlePasswordVisable = () => {
    setPasswordVisable(!passwordVisable);
  };

  const toggleDropdown = (userId) => {
    setDropdownVisible(dropdownVisible === userId ? null : userId);
  };

  const handleProfileVisible = () => {
    setProfileVisible(!profileVisible);
  };

  const filteredListings = selectedUser
    ? listings.filter((listing) => listing.UserID === selectedUser)
    : listings;

  const filteredTransactions = selectedUser
    ? transactions.filter(
        (transaction) =>
          transaction.SellerID === selectedUser ||
          transaction.BuyerID === selectedUser
      )
    : transactions;

  if (user.IsAdmin) {
    return (
      <div className="w-full h-screen py-6 px-10 text-black dark:text-white bg-white dark:bg-[#202020]">
        <p className="text-3xl font-semibold">Admin Panel</p>
        <div className="w-full h-full mt-4 flex gap-8">
          <div className="w-1/4 h-full rounded-xl bg-[#dddddd] dark:bg-[#171717]">
            <div className="w-full h-16 flex justify-evenly items-center rounded-xl text-black dark:text-white bg-[#cccccc] dark:bg-[#121212]">
              <p>Users</p>
              <div
                className="cursor-pointer px-3 py-2 rounded-xl duration-300 hover:bg-[#eeeeee] dark:hover:bg-[#353535]"
                onClick={() => setSelectedUser(null)}
              >
                Show All
              </div>
            </div>
            <div className="w-full h-full">
              {users.map((user) => (
                <div
                  key={user.UserID}
                  className="relative w-full h-16 cursor-pointer flex items-center duration-300 hover:bg-[#eeeeee] dark:hover:bg-[#252525]"
                >
                  <div
                    onClick={() => toggleDropdown(user.UserID)}
                    className="w-16 h-full px-4 flex justify-center items-center duration-300 hover:bg-[#404040]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                    </svg>
                  </div>
                  <Link
                    to={`/profile/${user.Username}`}
                    className="w-36 h-full px-4 py-3 flex items-center duration-300 hover:bg-[#404040]"
                  >
                    <img
                      src={user.ProfilePhoto}
                      alt="pfp"
                      className="w-10 h-10 rounded-full"
                    />
                    <p className="mx-3">{user.Username}</p>
                  </Link>
                  {dropdownVisible === user.UserID && (
                    <div className="absolute left-10 top-9 mt-2 w-48 bg-white dark:bg-[#202020] rounded-md shadow-lg z-10">
                      <button
                        className="block w-full px-4 py-2 text-left text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={() => {
                          setSelectedUser(user);
                          getUserInfo(user.UserID);
                          console.log(user);
                          handleProfileVisible();
                          toggleDropdown(null);
                        }}
                      >
                        Edit User
                      </button>
                      <button
                        className="block w-full px-4 py-2 text-left text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={() => handleDeleteUser(user.UserID)}
                      >
                        Delete User
                      </button>
                      <button
                        className="block w-full px-4 py-2 text-left text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={() => handleMessageUser(user.UserID)}
                      >
                        Message User
                      </button>
                    </div>
                  )}
                  {profileVisible && selectedUser && username && (
                    <div className="fixed z-10 inset-0 w-full h-full flex justify-center bg-white dark:bg-[#202020]/50">
                      <div className="absolute top-16 w-1/2 h-full rounded-2xl shadow-2xl text-black dark:text-white bg-[#eeeeee] dark:bg-[#171717]">
                        <div
                          className="w-10 h-10 ml-10 mt-10 flex justify-center items-center rounded-full duration-200 bg-slate-500 hover:bg-slate-400"
                          onClick={handleProfileVisible}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-7"
                          >
                            <path
                              fillRule="evenodd"
                              d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        {/* Profile Photo */}
                        <div className="w-full px-10 py-5 flex items-center gap-5">
                          <img
                            src={profilePhoto}
                            alt="Profile"
                            className="w-52 h-52 rounded-full"
                          />
                          <p className="">Profile Photo (URL)</p>
                          <button
                            onClick={() =>
                              handleEdit(
                                "ProfilePhoto",
                                prompt("Edit Profile Photo URL:", profilePhoto),
                                user
                              )
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="size-5"
                            >
                              <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                              <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                            </svg>
                          </button>
                        </div>

                        {/* Editable Settings */}
                        <div className="w-full px-10 flex flex-col gap-5">
                          {/* Username */}
                          <div className="m-2 flex gap-1">
                            <strong className="mr-5">Username:</strong>{" "}
                            {username}{" "}
                            <button
                              onClick={() =>
                                handleEdit(
                                  "Username",
                                  prompt("Edit Username:", username),
                                  user
                                )
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="size-5"
                              >
                                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                              </svg>
                            </button>
                          </div>

                          {/* Email */}
                          <div className="m-2 flex gap-1">
                            <strong className="mr-[3.4rem]">Email:</strong>{" "}
                            {email}{" "}
                            <button
                              onClick={() =>
                                handleEdit(
                                  "Email",
                                  prompt("Edit Email:", email),
                                  user
                                )
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="size-5"
                              >
                                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                              </svg>
                            </button>
                          </div>

                          {/* Change Password */}
                          <div className="m-2 flex flex-col gap-1">
                            <div className="flex">
                              <strong className="mr-[1.8rem]">Password:</strong>
                              <div
                                className="flex gap-1"
                                onClick={handlePasswordVisable}
                              >
                                <p className="select-none">Change Password</p>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="size-5"
                                >
                                  <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                  <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                                </svg>
                              </div>
                            </div>
                            <div
                              className={`mt-3 gap-4 flex ${
                                passwordVisable ? "" : "hidden"
                              }`}
                            >
                              <input
                                type="password"
                                placeholder="Old Password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="mb-2 p-2 rounded-xl bg-[#202020]"
                              />
                              <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="mb-2 p-2 rounded-xl bg-[#202020]"
                              />
                              <button
                                onClick={handleChangePassword}
                                className="w-10 h-10 px-2 rounded-full text-sm text-white bg-blue-500"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="size-6 rotate-180"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>

                          {/* Bio */}
                          <div className="m-2 gap-1 flex">
                            <strong className="mr-[4.4rem]">Bio:</strong> {bio}{" "}
                            <button
                              onClick={() =>
                                handleEdit(
                                  "Bio",
                                  prompt("Edit Bio:", bio),
                                  selectedUser
                                )
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="size-5"
                              >
                                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                              </svg>
                            </button>
                          </div>

                          {/* Location */}
                          <div className="m-2 gap-1 flex">
                            <strong className="mr-[1.9rem]">Location:</strong>{" "}
                            {location}{" "}
                            <button
                              onClick={() =>
                                handleEdit(
                                  "Location",
                                  prompt("Edit Location:", location),
                                  selectedUser
                                )
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="size-5"
                              >
                                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Non-editable stuff (editable for now) */}
                        <div className="w-full px-10 mt-16 flex flex-col gap-4">
                          <p className="ml-2 underline text-xl font-semibold">
                            {`"Hidden Settings"`}
                          </p>

                          {/* Review Score (Review Rating) */}
                          <div className="m-2 flex gap-2">
                            <div className="flex items-center justify-between gap-5">
                              <strong>Review Score:</strong>
                              <p>{reviewScore}</p>
                            </div>
                            <button
                              onClick={() => {
                                handleEdit(
                                  "ReviewScore",
                                  prompt("Edit Score:", reviewScore),
                                  selectedUser
                                );
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="size-5"
                              >
                                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                              </svg>
                            </button>
                          </div>

                          {/* Review Amount (Review Rating) */}
                          <div className="m-2 flex gap-2">
                            <div className="flex items-center justify-between gap-5">
                              <strong>Review Amount:</strong>
                              <p>{reviewAmount}</p>
                            </div>
                            <button
                              onClick={() =>
                                handleEdit(
                                  "ReviewAmount",
                                  prompt("Edit Score:", reviewAmount),
                                  selectedUser
                                )
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="size-5"
                              >
                                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                              </svg>
                            </button>
                          </div>
                          <div className="m-2 flex gap-2">
                            <strong>Is Admin:</strong> {isAdmin ? "Yes" : "No"}{" "}
                            <button
                              onClick={() =>
                                handleEdit(
                                  "IsAdmin",
                                  prompt(
                                    "Edit Is Admin (true/false):",
                                    isAdmin
                                  ),
                                  selectedUser
                                )
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="size-5"
                              >
                                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div
                    className="ml-auto px-4 flex items-center gap-4"
                    onClick={() => {
                      !dropdownVisible &&
                        !profileVisible &&
                        handleUserClick(user.UserID);
                    }}
                  >
                    <p className="text-[#bbbbbb]"></p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-7"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-3/4 h-full rounded-xl bg-[#dddddd] dark:bg-[#171717]">
            <div className="w-full h-16 flex justify-evenly items-center rounded-xl text-black dark:text-[#454545] bg-[#cccccc] dark:bg-[#121212]">
              <button
                className={`px-4 py-1 rounded-xl duration-300 ${
                  panelMode === "listings" ? "text-white" : ""
                }`}
                onClick={() => handlePanelChange("listings")}
              >
                Listings
              </button>
              <button
                className={`px-4 py-1 rounded-xl duration-300 ${
                  panelMode === "transactions" ? "text-white" : ""
                }`}
                onClick={() => handlePanelChange("transactions")}
              >
                Transactions
              </button>
            </div>
            <div className="p-4">
              {panelMode === "listings" && (
                <div className="w-full h-full py-2 px-6 grid grid-cols-4 gap-6">
                  {filteredListings.map((product) => (
                    <div key={product.ListingID} className="">
                      <Link to={`/listing/${product.ListingID}`}>
                        <OneListing key={product.ListingID} product={product} />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
              {panelMode === "transactions" && (
                <div>
                  {filteredTransactions.map((transaction) => (
                    <div key={transaction.TransactionID} className="p-2">
                      <div
                        key={transaction.TransactionID}
                        className="flex justify-center items-center"
                      >
                        <div className="w-full h-24 flex items-center rounded-2xl border-4 bg-[#f6f6f6] dark:bg-[#171717] border-grey-200 dark:border-[#151515]">
                          {selectedUser === transaction.SellerID ? (
                            <div className="w-12 h-full flex justify-center items-center rounded-l-xl bg-green-400">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-8"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                              </svg>
                            </div>
                          ) : (
                            <div className="w-12 h-full flex justify-center items-center rounded-l-xl bg-red-400">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-7"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                                />
                              </svg>
                            </div>
                          )}
                          <div className="w-full mx-3 flex justify-between">
                            <div className="flex justify-center items-center">
                              <div className="w-12 h-12 mx-3 flex flex-col justify-center items-center">
                                {selectedUser !== transaction.SellerID ? (
                                  <Link
                                    to={`/profile/${transaction.BuyerName}`}
                                    className="min-w-12 min-h-12 flex flex-col justify-center items-center"
                                  >
                                    <img
                                      src={transaction.BuyerProfilePhoto}
                                      alt="Buyer PFP"
                                      className="min-w-12 min-h-12 rounded-full border-2"
                                    />
                                    <p className="text-sm">
                                      {transaction.BuyerName}
                                    </p>
                                  </Link>
                                ) : (
                                  <Link
                                    to={`/profile/${transaction.SellerName}`}
                                    className="min-w-12 min-h-12 flex flex-col justify-center items-center"
                                  >
                                    <img
                                      src={transaction.SellerProfilePhoto}
                                      alt="Seller PFP"
                                      className="min-w-12 min-h-12 rounded-full border-2"
                                    />
                                    <p className="text-sm">
                                      {transaction.SellerName}
                                    </p>
                                  </Link>
                                )}
                              </div>
                              <div className="ml-3">
                                {selectedUser === transaction.SellerID ? (
                                  <Link
                                    to={`/listing/${transaction.ListingID}`}
                                    className="flex justify-center items-center gap-1.5 text-xl"
                                  >
                                    <strong>Sold</strong>
                                    <p className="text-xl cursor-pointer underline">
                                      {transaction.ListingName}
                                    </p>
                                  </Link>
                                ) : (
                                  <Link
                                    to={`/listing/${transaction.ListingID}`}
                                    className="flex justify-center items-center gap-1.5 text-xl"
                                  >
                                    <strong>Purchased</strong>
                                    <p className="text-xl cursor-pointer underline">
                                      {transaction.ListingName}
                                    </p>
                                  </Link>
                                )}
                              </div>
                            </div>
                            <div className="flex justify-center items-center">
                              <div className="mx-3">
                                <div className="flex items-baseline gap-2 text-xl">
                                  {selectedUser === transaction.SellerID ? (
                                    <p className="w-full text-3xl text-right text-green-500">
                                      +${transaction.Amount}
                                    </p>
                                  ) : (
                                    <p className="w-full text-3xl text-right text-red-500">
                                      -${transaction.Amount}
                                    </p>
                                  )}
                                </div>
                                <div className="text-xl flex items-baseline gap-2">
                                  <strong>Date</strong>
                                  <p className="text-xl">
                                    {new Date(
                                      transaction.DateSold
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="w-12 h-12 mr-3 flex flex-col justify-center items-center">
                                {selectedUser === transaction.SellerID ? (
                                  <Link
                                    to={`/profile/${transaction.BuyerName}`}
                                    className="min-w-12 min-h-12 flex flex-col justify-center items-center"
                                  >
                                    <img
                                      src={transaction.BuyerProfilePhoto}
                                      alt="Buyer PFP"
                                      className="min-w-12 min-h-12 rounded-full border-2"
                                    />
                                    <p className="text-sm">
                                      {transaction.BuyerName}
                                    </p>
                                  </Link>
                                ) : (
                                  <Link
                                    to={`/profile/${transaction.SellerName}`}
                                    className="min-w-12 min-h-12 flex flex-col justify-center items-center"
                                  >
                                    <img
                                      src={transaction.SellerProfilePhoto}
                                      alt="Seller PFP"
                                      className="min-w-12 min-h-12 rounded-full border-2"
                                    />
                                    <p className="text-sm">
                                      {transaction.SellerName}
                                    </p>
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full p-6 text-black dark:text-white bg-white dark:bg-[#202020]">
        <div>You aren&apos;t an admin!!!</div>
      </div>
    );
  }
}

export default AdminPanel;
