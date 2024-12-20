import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function ViewProfile({ DatabaseURL }) {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(`${DatabaseURL}/users/profile/${username}`)
      .then((response) => response.text()) // Get the response as text
      .then((text) => {
        try {
          const data = JSON.parse(text); // Try to parse the text as JSON
          setProfile(data);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          console.error("Response text:", text); // Log the response text
        }
      })
      .catch((error) => console.error("Error fetching profile:", error));
  }, [username, DatabaseURL]);

  if (!profile) {
    return (
      <div className="w-full p-5 text-white bg-[#202020]">
        Loading... {username}
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center bg-white dark:bg-[#202020]">
      <div className="w-1/2 p-5 pb-16 rounded-2xl shadow-2xl text-black dark:text-white bg-[#eeeeee] dark:bg-[#171717]">
        {/* Profile Photo */}
        <div className="w-full p-10 flex items-center gap-5">
          <img
            src={profile.ProfilePhoto}
            alt={`${profile.Username}'s profile`}
            className="w-52 h-52 rounded-full"
          />
        </div>

        {/* Editable Settings */}
        <div className="w-full px-10 flex flex-col gap-5">
          {/* Username */}
          <div className="m-2 flex gap-1">
            <strong className="mr-5">Username:</strong> {profile.Username}{" "}
          </div>

          {/* Email */}
          <div className="m-2 flex gap-1">
            <strong className="mr-[3.4rem]">Email:</strong> {profile.Email}{" "}
          </div>

          {/* Bio */}
          <div className="m-2 gap-1 flex">
            <strong className="mr-[4.4rem]">Bio:</strong> {profile.Bio}{" "}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProfile;
