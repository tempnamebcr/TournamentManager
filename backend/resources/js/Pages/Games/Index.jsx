import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react'
import PrimaryButton from '@/Components/PrimaryButton';
import DataTable from 'react-data-table-component';
import SecondaryButton from '@/Components/SecondaryButton';
import ProfilePic from '@/Components/UserPicture';


const columns = [
	{
		name: 'Name',
		selector: row => <ProfilePic username={row.name} imgSrc={"storage/"+ row.image[0].location}></ProfilePic>,
	},
    {
        cell: (row) => <SecondaryButton onClick={() => handleDelete(row.id)}>Delete</SecondaryButton>,
        ignoreRowClick: true,
    },
];
const handleDelete = (id) => {
    console.log('Row with ID:', id, 'deleted');
};

export default function Index({ auth, games }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Games</h2>}
        >
            <Head title="Games" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {auth.user.isAdmin != 0 &&
                        <div className="py-6">
                            <PrimaryButton onClick={() => router.visit(route('games.create'))} id="add-games">Create</PrimaryButton>
                        </div>
                    }
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <DataTable
                            columns={columns}
                            data={games}
                            pagination
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
