import React from 'react';
import axios from 'axios';
import {useForm } from '@inertiajs/react';

export default function NotificationItem(read, unread) {

    const {post, get} = useForm({});

    const markOneAsRead = (id) => {
        post(route('notifications.markAsRead', {id : id}));
    }

    const markForDelete = (id) => {
        axios.get(route('notifications.destroy', {id : id}))
            .then(() => {
                toastr.success("deleted");
            });
    }

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div>
            {read.unread && (
                <React.Fragment>
                    <div className="flex">
                        <a href={read.unread.data.info.link} className="flex leading-5" onClick={() => markOneAsRead(read.unread.id)}>
                            <div className="flex flex-col bg-gray-300 items-start text-left">
                                <span className="text-sm mx-2">{read.unread.data.info.message}</span>
                                <span className="text-xs mx-2">{formatDate(read.unread.data.info.sent)}</span>
                            </div>
                        </a>
                        <a href="#" className="p-2 rounded-md text-gray-700 hover:bg-gray-700 hover:text-gray-300" onClick={() => markForDelete(read.unread.id)}>
                            <icon name="trash" className="w-4 h-4 fill-current"></icon>
                            delete
                        </a>
                    </div>
                </React.Fragment>
            )}

            {read.read && (
                <React.Fragment>
                    <div className="flex">
                        <a href={read.read.data.info.link} className="flex leading-5">
                            <div className="flex flex-col items-start text-left">
                                <span className="text-sm mx-2">{read.read.data.info.message}</span>
                                <span className="text-xs mx-2">{formatDate(read.read.data.info.sent)}</span>
                            </div>
                        </a>
                        <a href="#" className="p-2 rounded-md text-gray-500 hover:bg-gray-500 hover:text-gray-300" onClick={() => markForDelete(read.read.id)}>
                            <icon name="trash" className="w-4 h-4 fill-current"></icon>
                            delete
                        </a>
                    </div>
                </React.Fragment>
            )}
        </div>
    );
}
