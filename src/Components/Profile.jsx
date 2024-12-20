import React, { useState, useEffect } from "react";

//tailwind edited by: ethan
function Profile({ user, updateUser, DatabaseURL }) {
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

  useEffect(() => {
    fetch(`${DatabaseURL}/users/${user.UserID}`)
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
  }, [user.UserID]);

  const handleEdit = (field, value) => {
    console.log(`handleEdit called with field: ${field}, value: ${value}`);

    fetch(`${DatabaseURL}/users/${user.UserID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ [field]: value }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(`Response from server:`, data);

        fetch(`${DatabaseURL}/users/${user.UserID}`)
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
            updateUser(data);
          })
          .catch((error) => console.error("Error fetching user data:", error));
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
          alert("Password changed successfully!");
        } else {
          alert("Error changing password: " + data.message);
        }
      })
      .catch((error) => console.error("Error changing password:", error));
  };

  const handlePasswordVisable = () => {
    setPasswordVisable(!passwordVisable);
  };

  return (
    <div className="relative w-full flex justify-center bg-white dark:bg-[#202020]">
      <div className="absolute top-[10%] w-1/2 h-full rounded-2xl shadow-2xl text-black dark:text-white bg-[#eeeeee] dark:bg-[#171717]">
        {/* Profile Photo */}
        <div className="w-full p-10 flex items-center gap-5">
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
                prompt("Edit Profile Photo URL:", profilePhoto)
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
            <strong className="mr-5">Username:</strong> {username}{" "}
            <button
              onClick={() =>
                handleEdit("Username", prompt("Edit Username:", username))
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
            <strong className="mr-[3.4rem]">Email:</strong> {email}{" "}
            <button
              onClick={() => handleEdit("Email", prompt("Edit Email:", email))}
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
              <div className="flex gap-1" onClick={handlePasswordVisable}>
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
              className={`mt-3 gap-4 flex ${passwordVisable ? "" : "hidden"}`}
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
            <button onClick={() => handleEdit("Bio", prompt("Edit Bio:", bio))}>
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
            <strong className="mr-[1.9rem]">Location:</strong> {location}{" "}
            <button
              onClick={() =>
                handleEdit("Location", prompt("Edit Location:", location))
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
              onClick={() =>
                handleEdit("ReviewScore", prompt("Edit Score:", reviewScore))
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

          {/* Review Amount (Review Rating) */}
          <div className="m-2 flex gap-2">
            <div className="flex items-center justify-between gap-5">
              <strong>Review Amount:</strong>
              <p>{reviewAmount}</p>
            </div>
            <button
              onClick={() =>
                handleEdit("ReviewAmount", prompt("Edit Score:", reviewAmount))
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
                  prompt("Edit Is Admin (true/false):", isAdmin)
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
  );
}

export default Profile;
