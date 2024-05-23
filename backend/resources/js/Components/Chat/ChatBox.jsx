import React from 'react';
import '../../../css/chatbox.css'
const MessageList = ({ messages, currentUser }) => {
  return (
    <div className="overflow-y-auto border-b chatbox">
      { messages && messages.map(message => (
        <div
          key={message.id}
          className={`border-b px-3 py-3 ${message.user.id !== currentUser.id ? 'text-right' : 'text-left bg-gray-600 text-gray-200'}`}
        >
          <div className={`flex items-center ${message.user.id !== currentUser.id ? 'justify-end bg-gray-300' : ''}`}>
            <img src={"../storage/" + message.user.image.location} className="w-4 h-4 rounded-full object-cover" alt={message.user.username} />
            <a href="#">
              <span className={`font-semibold tracking-wider ml-1 ${message.user.id !== currentUser.id ? 'text-blue' : 'text-blue-300'}`}>
                {message.user.username}{message.user.isAdmin ? <small className=' inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold tracking-widest  ml-3 '>admin</small>: ''}
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
