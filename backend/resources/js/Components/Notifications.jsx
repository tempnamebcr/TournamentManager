import { Link } from '@inertiajs/react';
import NotificationItem from './NotificationItem';

export default function Notifications(reads, unreads) {
    return (
        <div>
            {reads.unreads && reads.unreads.map(unread => (
                <NotificationItem key={unread.id} unread={unread} className="flex justify-between items-center bg-gray-300 text-sm text-gray-700 hover:bg-gray-700 hover:text-gray-300 px-4 py-2 transition duration-150 ease-in-out" />
            ))}
            {reads.reads && reads.reads.map(read => (
                <NotificationItem key={read.id} read={read} className="flex justify-between items-center bg-gray-100 text-gray-400 hover:bg-gray-300 hover:text-gray-700 px-4 py-2 transition duration-150 ease-in-out" />
            ))}
        </div>
    );
}
