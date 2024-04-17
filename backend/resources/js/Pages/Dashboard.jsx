import ExperienceBar from '@/Components/ExperienceBar';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Dashboard({ auth, data }) {
    // const { amount_won, fee_paid } = usePage().props;
    console.log(data[3]);
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
                        <div className="p-6 text-gray-900">{auth.user.username} {auth.user.image && (
                            <img src={"storage/"+auth.user.image.location} alt="User Image" width="100" height="100"/>
                        )}</div>
                        <div className="p-6 text-gray-900">
                            <span>Level : {auth.user.level}</span>
                            <ExperienceBar experience={exp}></ExperienceBar>
                        </div>
                        <div className="p-6 text-gray-900">
                            <span>Amount won : {data[0]}</span>
                        </div>
                        <div className="p-6 text-gray-900">
                            <span>Amount paid : {data[1]}</span>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
