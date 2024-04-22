import ExperienceBar from '@/Components/ExperienceBar';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import moment from 'moment';

export default function Dashboard({ auth, data }) {
    console.log(data[3])
    const { averageKills, averageDeaths, averageAssists, kdaRatio } = calculateAverageAndKda(data[3]);
    function calculateAverageAndKda(data) {
        let totalKills = 0;
        let totalDeaths = 0;
        let totalAssists = 0;
        let gamesPlayed = data.length;

        data.forEach(score => {
            const [kills, deaths, assists] = score.final_score.split('/').map(Number);
            totalKills += kills;
            totalDeaths += deaths;
            totalAssists += assists;
        });

        const averageKills = totalKills / gamesPlayed;
        const averageDeaths = totalDeaths / gamesPlayed;
        const averageAssists = totalAssists / gamesPlayed;

        const kdaRatio = (totalKills + totalAssists) / totalDeaths;

        return {
            averageKills,
            averageDeaths,
            averageAssists,
            kdaRatio
        };
    }
    function formatTimeDifference(startedTimestamp, endedTimestamp) {
        const startedMoment = moment(startedTimestamp);
        const endedMoment = moment(endedTimestamp);
        const difference = moment.duration(endedMoment.diff(startedMoment));

        const days = difference.days();
        const hours = difference.hours();
        const minutes = difference.minutes();

        let formattedDifference = '';
        if (days > 0) {
            formattedDifference += `${days} zile `;
        }
        if (hours > 0) {
            formattedDifference += `${hours} ore `;
        }
        if (minutes > 0) {
            formattedDifference += `${minutes} minute`;
        }

        return formattedDifference;
    }

    function TimeDifference({ startedTimestamp, endedTimestamp }) {
        const humanDifference = formatTimeDifference(startedTimestamp, endedTimestamp);
        return <span>{humanDifference}</span>;
    }

    const exp = auth.user.experience;
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">Welcome, {auth.user.username} {auth.user.image && (
                            <img src={"storage/"+auth.user.image.location} alt="User Image" width="100" height="100"/>
                        )} , here are some stats from your previous tournaments:</div>
                        <div className="p-6 text-gray-900">
                            <span>Level : {auth.user.level}</span>
                            <ExperienceBar experience={exp}></ExperienceBar>
                        </div>
                        <div className="p-6 text-gray-900">
                            <span>Amount won : {data[0]} IGC</span>
                        </div>
                        <div className="p-6 text-gray-900">
                            <span>Amount paid : {data[1]} IGC</span>
                        </div>
                        <div className="p-6 text-gray-900">
                            <span>Average score : {averageKills + "/" + averageDeaths + "/" + averageAssists} | KDA: {kdaRatio.toFixed(2)}</span>
                        </div>
                        <div className="p-6 text-gray-900">
                            {!data[2] && <p>No tournament history</p>}
                            {data[2] && <p>Your last 5 games: </p>}
                            {data[2] && data[2].map(tournament => (
                                tournament.amount_won != 0 ?
                                <div className="p-2 bg-green-200">
                                    <p class="text-green-800">Win</p>
                                    <p class="text-green-800">{tournament.tournament.name} | Duration: <TimeDifference startedTimestamp={tournament.tournament.started} endedTimestamp={tournament.tournament.ended} /></p>
                                    <p>Score: {tournament.final_score}</p>
                                </div>
                                :
                                <div className="p-2 bg-red-200">
                                    <p class="text-red-800">Defeat</p>
                                    <p class="text-red-800">{tournament.tournament.name} | Duration: <TimeDifference startedTimestamp={tournament.tournament.started} endedTimestamp={tournament.tournament.ended} /></p>
                                    <p>Score: {tournament.final_score}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
