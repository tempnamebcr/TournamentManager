import React from 'react';
import TournamentUsers from '@/Components/Tournament/TournamentUsers';

const VersusUsers = ({ users }) => {
  return (
    <div className="flex justify-between">
        { users.length >= 1 &&
        <TournamentUsers users={[users[0]]} />
        }
        <span className='my-auto'>
            VS
        </span>
        {
        users.length >=2 &&
        <TournamentUsers users={[users[1]]} />
        }
        {users.length == 1 &&
            <div className="border-b border-gray-300 bg-gray-100 text-gray-700 px-4 py-2 hover:bg-gray-300 transition duration-150 ease-in-out">
                <a href="#" className="flex items-center">
                <span className="ml-3">Waiting...</span>
                </a>
            </div>
        }
    </div>
  );
};

export default VersusUsers;
