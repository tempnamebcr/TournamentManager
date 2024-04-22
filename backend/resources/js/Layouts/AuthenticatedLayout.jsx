import { useState, useEffect } from 'react';
import useScript from '../Hooks/useScript';
import useLink from '../Hooks/useLink';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import Notifications from '@/Components/Notifications';

export default function Authenticated({ user, header, children }) {
    let { auth } = usePage().props;
    let { notifications, readNotifications, unreadNotifications} = auth;
    const [notifCount, setNotifCount] = useState(unreadNotifications.length);
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    useScript("https://cdn.jsdelivr.net/npm/sweetalert2@11");
    useScript("https://js.pusher.com/8.2.0/pusher.min.js");
    useScript("https://code.jquery.com/jquery-3.7.1.js");
    useScript("https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js");
    useLink("stylesheet", "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css");
    //pusher
    useEffect(() => {
        // if (window.Pusher) {
        //     window.Pusher.logToConsole = true;
        //     const pusher = new window.Pusher('5381343c4eba40b19064', {
        //         cluster: 'eu'
        //     });

        //     const channel = pusher.subscribe('tournament-channel');
        //     channel.bind('tournament-created', function(data) {
        //         toastr.success("A new tournament was created");
        //     });

        //     return () => {
        //         pusher.disconnect();
        //     };
        // }
        const listen = () => {
            window.Echo.private(`App.Models.User.${user.id}`)
                .notification((notification) => {
                    let newUnreadNotifications = {
                        data: {
                            info: {
                                avatar: notification.info.avatar,
                                message: notification.info.message,
                                link: notification.info.link,
                                sent: notification.info.sent,
                            }
                        },
                        id: notification.id
                    }
                    unreadNotifications.push(newUnreadNotifications)
                    notifications.push(newUnreadNotifications)
                    setNotifCount(unreadNotifications.length)
                });
        };

        listen();
    }, []);
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </NavLink>
                                <NavLink href={route('tournaments.index')} active={route().current('tournament')}>
                                    Tournaments
                                </NavLink>
                                <NavLink href={route('games.index')} active={route().current('game')}>
                                    Games
                                </NavLink>
                                <NavLink href={route('users.index')} active={route().current('user')}>
                                    Users
                                </NavLink>
                                <NavLink href={route('friends.index')} active={route().current('friend')}>
                                    Friends
                                </NavLink>
                                <NavLink href={route('teams.index')} active={route().current('team')}>
                                    Teams
                                </NavLink>
                            </div>
                        </div>
                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md relative">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                <svg width="24" height="24" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18.1336 11C18.7155 16.3755 21 18 21 18H3C3 18 6 15.8667 6 8.4C6 6.70261 6.63214 5.07475 7.75736 3.87452C8.88258 2.67428 10.4087 2 12 2C12.3373 2 12.6717 2.0303 13 2.08949" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/> <path d="M19 8C20.6569 8 22 6.65685 22 5C22 3.34315 20.6569 2 19 2C17.3431 2 16 3.34315 16 5C16 6.65685 17.3431 8 19 8Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/> <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/> </svg>
                                                <span className="text-white text-xs bg-red-600 rounded-full px-2 py-1 absolute bottom-6 left-6">
                                                    {notifCount}
                                                </span>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>
                                    {notifications.length > 0 &&
                                        <Dropdown.Content width={'96'}>
                                            <Dropdown.Link class="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-300 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out" href={route('notifications.update')}>Mark all as read</Dropdown.Link>
                                            <div className="border-t border-gray-100"></div>
                                            <Notifications reads={readNotifications} unreads={unreadNotifications} />
                                        </Dropdown.Content>
                                    }
                                    {
                                        notifications.length == 0 &&
                                        <Dropdown.Content width={'64'}>
                                            <Dropdown.Link class="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-300 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out" href="#">You have no new notifications.</Dropdown.Link>
                                            <div className="border-t border-gray-100"></div>
                                        </Dropdown.Content>
                                    }

                                </Dropdown>
                            </div>
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.username}

                                                <svg
                                                    className="ms-2 -me-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">{user.name}</div>
                            <div className="font-medium text-sm text-gray-500">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>
        </div>

    );
}
