import React from 'react';

const UserCard = ({ user }) => {
  const getInitials = (name) => {
    return name?.charAt(0).toUpperCase() || '?';
  };

  const getRandomGradient = (id) => {
    const gradients = [
      'from-pink-500 to-rose-500',
      'from-purple-500 to-indigo-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-amber-500',
      'from-teal-500 to-cyan-500',
    ];
    const index = id?.length % gradients.length || 0;
    return gradients[index];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Card Header with Gradient */}
      <div className={`h-24 bg-linear-to-r ${getRandomGradient(user._id)} relative`}>
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
          <div className={`w-20 h-20 rounded-full bg-linear-to-br ${getRandomGradient(user._id)} flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg`}>
            {getInitials(user.username)}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="pt-12 pb-6 px-6 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{user.username}</h3>
        <p className="text-gray-500 text-sm mb-4">{user.email}</p>

        {/* Account Type Badge */}
        <div className="flex justify-center mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
            user.accountType === 'business' 
              ? 'bg-amber-100 text-amber-700' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            {user.accountType === 'business' ? (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
            {user.accountType === 'business' ? 'Business' : 'Personal'}
          </span>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-6 py-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-800">0</p>
            <p className="text-xs text-gray-500">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-800">0</p>
            <p className="text-xs text-gray-500">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-800">0</p>
            <p className="text-xs text-gray-500">Following</p>
          </div>
        </div>

        {/* Join Date */}
        <p className="text-xs text-gray-400 mt-2">
          Joined {formatDate(user.createdAt)}
        </p>

        {/* View Profile Button */}
        <button className="mt-4 w-full py-2.5 bg-linear-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
          View Profile
        </button>
      </div>
    </div>
  );
};

export default UserCard;
