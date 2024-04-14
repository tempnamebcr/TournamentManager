import React from 'react';
import TournamentUsers from '@/Components/Tournament/TournamentUsers';

const Team = ({ users, team }) => {
  return (
    <div className="flex-column justify-between">
        {team.name}
        <TournamentUsers users={users} />
    </div>
  );
};

export default Team;
