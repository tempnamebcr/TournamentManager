import React from 'react';

const TournamentUsers = ({ users }) => {
  return (
    <div className="h-full overflow-y-auto">
      {users.map((user, index) => (
        <div key={index} className="border-b border-gray-300 bg-gray-100 text-gray-700 px-4 py-2 hover:bg-gray-300 transition duration-150 ease-in-out">
          <a href="#" className="flex items-center">
            <img src={user.avatar} alt={user.username} className="w-8 h-8 object-cover rounded-full" />
            <span className="ml-3">{user.username}</span>
          </a>
        </div>
      ))}
    </div>
  );
};

export default TournamentUsers;
