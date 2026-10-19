import React from 'react';

const UserCard = ({ user }) => {
  return (
    <div className="bg-white p-4 shadow-md rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold">{user.name}</h3>
      <p className="text-gray-600">{user.email}</p>
    </div>
  );
};

export default UserCard;