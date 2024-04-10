import React from 'react';

const MessageList = ({ messages, currentUser }) => {
  return (
    <div className="h-full overflow-y-auto border-b">
      { messages && messages.map(message => (
        <div
          key={message.id}
          className={`border-b px-3 py-3 ${message.user.id !== currentUser.id ? 'text-right' : 'text-left bg-gray-600 text-gray-200'}`}
        >
          <div className={`flex items-center ${message.user.id !== currentUser.id ? 'justify-end bg-gray-300' : ''}`}>
            <img src={message.user.image} className="w-4 h-4 rounded-full object-cover" alt={message.user.username} />
            <a href="#">
              <span className={`font-semibold tracking-wider ml-1 ${message.user.id !== currentUser.id ? 'text-blue' : 'text-blue-300'}`}>
                {message.user.username}
              </span>
            </a>
          </div>
          <div className="flex flex-col">
            <p className="text-sm">{message.body}</p>
            <p className="text-xs italic">{message.timeAgo}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
