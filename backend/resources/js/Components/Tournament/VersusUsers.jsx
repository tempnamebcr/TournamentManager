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
    </div>
  );
};

export default VersusUsers;
