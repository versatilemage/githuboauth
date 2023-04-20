import { useState } from 'react';
import { getUserInfo } from '@/utils/hackerRankApi';

export default function UserInformation() {
    
  const [username, setUsername] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(username)
    try {
      const data = await getUserInfo(username);
      setUserInfo(data);
    } catch (error) {
    console.log(error)
    }
  };

  return (
    <div>
      <h1>Get User Information</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>
        <button type="submit">Submit</button>
      </form>
      {userInfo && (
        <div>
          <h2>User Information</h2>
          <ul>
            <li>Name: {userInfo.name}</li>
            <li>Email: {userInfo.email}</li>
            <li>Country: {userInfo.country}</li>
            <li>City: {userInfo.city}</li>
          </ul>
        </div>
      )}
      {error && <p>{error}</p>}
    </div>
  );
}
