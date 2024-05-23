import React from 'react';
import TournamentUsers from '@/Components/Tournament/TournamentUsers';
import ProfilePic from '../UserPicture';

const Team = ({ users, team }) => {
  return (
    <div className="flex-column justify-between">
        <ProfilePic username={team.name} imgSrc={'/storage/'+team.image.location}></ProfilePic>
        <TournamentUsers users={users} />
    </div>
  );
};

export default Team;
