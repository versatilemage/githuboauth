import React, { useState } from "react";

export default function UserInformation() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);

  const apiKey = "ae3847c28c95132317561b90682b2f430f8ad90ba921.api.hackerearth.com";
  const clientSecret = "ad1622501ea58b5424cb328ae4cc02082dd2b822";

  const handleSubmit = async (event) => {
    event.preventDefault();

    const url = `https://api.hackerearth.com/v3/users/${username}/?client_secret=${clientSecret}&api_key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error retrieving user data: ", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Enter username:
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {userData && (
        <div>
          <h2>{userData.username}</h2>
          <p>Email: {userData.email}</p>
          <p>Name: {userData.name}</p>
          <p>Rating: {userData.rating}</p>
        </div>
      )}
    </div>
  );
}
