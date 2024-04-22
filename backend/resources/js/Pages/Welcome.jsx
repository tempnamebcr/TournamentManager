import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white">
                <div className="sm:fixed sm:top-0 sm:right-0 p-6 text-end">
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                            >
                                Log in
                            </Link>

                            <Link
                                href={route('register')}
                                className="ms-4 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>

                <div className="max-w-7xl mx-auto p-6 lg:p-8">
                    <div className="flex justify-center">
                        <h2 className="text-center text-xl font-bold mb-4">Welcome to our application! </h2>
                        <p className="text-center text-lg mb-4"> Here's a brief introduction on what you're supposed to do:</p>
                    </div>
                    <div className="mt-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                            <a
                                href="#"
                                className="scale-100 p-6 bg-white dark:bg-gray-800/50 dark:bg-gradient-to-bl from-gray-700/50 via-transparent dark:ring-1 dark:ring-inset dark:ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 dark:shadow-none flex motion-safe:hover:scale-[1.01] transition-all duration-250 focus:outline focus:outline-2 focus:outline-red-500"
                            >
                                <div>

                                    <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                                        Games
                                    </h2>

                                    <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                        Check out our games list. The tournaments will be created from that list
                                    </p>
                                </div>
                            </a>
                            <a
                                href="#"
                                className="scale-100 p-6 bg-white dark:bg-gray-800/50 dark:bg-gradient-to-bl from-gray-700/50 via-transparent dark:ring-1 dark:ring-inset dark:ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 dark:shadow-none flex motion-safe:hover:scale-[1.01] transition-all duration-250 focus:outline focus:outline-2 focus:outline-red-500"
                            >
                                <div>

                                    <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                                        Tournaments
                                    </h2>

                                    <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                        Join and play in the tournaments to compete for IGC (our currency). You can choose between playing solo tournaments, waiting for another user to make a team with you or by joining with your own team; Once the tournament starts, you will upload a photo with the results so our admins can upload the stats.
                                    </p>
                                </div>
                            </a>
                            <a
                                href="#"
                                className="scale-100 p-6 bg-white dark:bg-gray-800/50 dark:bg-gradient-to-bl from-gray-700/50 via-transparent dark:ring-1 dark:ring-inset dark:ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 dark:shadow-none flex motion-safe:hover:scale-[1.01] transition-all duration-250 focus:outline focus:outline-2 focus:outline-red-500"
                            >
                                <div>

                                    <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                                        Teams
                                    </h2>

                                    <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                        Create teams with your friends and compete with others for the prizes
                                    </p>
                                </div>
                            </a>
                            <a
                                href="#"
                                className="scale-100 p-6 bg-white dark:bg-gray-800/50 dark:bg-gradient-to-bl from-gray-700/50 via-transparent dark:ring-1 dark:ring-inset dark:ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 dark:shadow-none flex motion-safe:hover:scale-[1.01] transition-all duration-250 focus:outline focus:outline-2 focus:outline-red-500"
                            >
                                <div>

                                    <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                                        Friends
                                    </h2>

                                    <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                        If you enjoyed playing with someone you can request them to be your friend
                                    </p>
                                </div>
                            </a>

                        </div>
                    </div>

                </div>
            </div>


        </>
    );
}
