import React from 'react';
import axios from 'axios';
import {useForm } from '@inertiajs/react';
import useLink from '@/Hooks/useLink';

export default function NotificationItem(read, unread) {
    useLink("stylesheet", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css")
    const {post, get} = useForm({});

    const markOneAsRead = (id) => {
        console.log("reading")
        axios.get(route('notifications.markAsRead', {id : id}))
            .then(() => {
                toastr.success("read");
                location.reload()
            });
    }

    const markForDelete = (id) => {
        axios.get(route('notifications.destroy', {id : id}))
            .then(() => {
                toastr.success("deleted");
                location.reload()
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
                    <div className="flex justify-between rounded-md">
                        <a href={read.unread.data.info.link} className="flex flex-grow leading-5 pl-1" onClick={() => markOneAsRead(read.unread.id)}>
                            <div className="flex flex-col flex-grow rounded-md bg-gray-300 hover:bg-gray-200 items-start text-left">
                                <span className="text-sm mx-2">{read.unread.data.info.message}</span>
                                <span className="text-xs mx-2">{formatDate(read.unread.data.info.sent)}</span>
                            </div>
                        </a>
                        <a href="#" className="p-2 rounded-md text-gray-600 bg-red-400 hover:bg-gray-700 hover:text-gray-300" onClick={() => markForDelete(read.unread.id)}>
                            <i class="fa fa-trash" aria-hidden="true"></i>
                        </a>
                    </div>
                </React.Fragment>
            )}

            {read.read && (
                <React.Fragment>
                    <div className="flex justify-between">
                        <a href={read.read.data.info.link} className="flex leading-5">
                            <div className="flex flex-col rounded-md items-start text-left">
                                <span className="text-sm mx-2">{read.read.data.info.message}</span>
                                <span className="text-xs mx-2">{formatDate(read.read.data.info.sent)}</span>
                            </div>
                        </a>
                        <a href="#" className="p-2 rounded-md text-gray-500 hover:bg-gray-500 hover:text-gray-300" onClick={() => markForDelete(read.read.id)}>
                            <i class="fa fa-trash" aria-hidden="true"></i>
                        </a>
                    </div>
                </React.Fragment>
            )}
        </div>
    );
}
