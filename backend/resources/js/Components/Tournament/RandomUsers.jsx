import React from 'react';
import TournamentUsers from '@/Components/Tournament/TournamentUsers';

const RandomUsers = ({ users }) => {
  return (
    <div className="flex justify-between">
        {users.length >= 1 ? <TournamentUsers users={[users[0]]} /> : <p>empty</p>}
        {users.length >= 2 ?<TournamentUsers users={[users[1]]} /> : <p>empty</p>}
        <span className='my-auto'>
            VS
        </span>
        {users.length >=3 ? <TournamentUsers users={[users[2]]} /> : <p>empty</p>}
        {users.length >=3 ? <TournamentUsers users={[users[3]]} /> : <p>empty</p>}
    </div>
  );
};

export default RandomUsers;
