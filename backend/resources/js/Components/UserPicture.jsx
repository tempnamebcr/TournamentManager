import React from 'react';

const ProfilePic = ({ imgSrc, username }) => {
  return (
    <span className="profile-container">
      <img src={imgSrc} alt={`${username}'s profile`} className="profile-pic" />
      <span className="username">{username}</span>
    </span>
  );
};


export default ProfilePic;
