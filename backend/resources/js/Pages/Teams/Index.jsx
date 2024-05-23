import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react'
import PrimaryButton from '@/Components/PrimaryButton';
import DataTable from 'react-data-table-component';
import SecondaryButton from '@/Components/SecondaryButton';
import ProfilePic from '@/Components/UserPicture';
import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';




export default function Index({ auth, teams }) {
    const { flash } = usePage().props

const columns = [
	{
		name: 'Name',
		selector: row => <ProfilePic username={row.name} imgSrc={"storage/"+row.image.location} ></ProfilePic>,
	},
	{
		name: 'Wins',
		selector: row => <div className="relative bg-red-500 text-white rounded px-2 py-1">Wins: {row.games_won}</div>,
	},
    {
        name:'Leave',
        cell: (row) => <SecondaryButton onClick={() => handleDelete(row.id)}>Leave</SecondaryButton>,
        ignoreRowClick: true,
    },
    {
        name:'See Members',
        cell: (row) => <PrimaryButton onClick={() => seeMembers(row.id)}>See members</PrimaryButton>,
        ignoreRowClick: true,
    },
];
const handleDelete = (id) => {
    router.delete(route('teams.destroy', [id]))
};
const seeMembers = (id) => {
    router.visit(route('teams.seeMembers', [id]))
};
const textForMembers = (members) => {
    let text = '';
    text += 'Team name: ' + members[0].name + '\n';
    members.map(member => {
        text += member.username + '\n';
    });
    return text;
}

useEffect(() => {
    if(flash.message){
        let teamMembers = textForMembers(flash.message);
        Swal.fire({
            title: 'Members',
            html: '<pre>' + teamMembers + '</pre>',
            text: teamMembers,
            confirmButtonText: 'Ok',
          }).then((result) => {

          })
    }
}, [flash]);
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Teams</h2>}
        >
            <Head title="Teams" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="py-6">
                        <PrimaryButton onClick={() => router.visit(route('teams.create'))} id="add-teams">Create</PrimaryButton>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <DataTable
                            columns={columns}
                            data={teams}
                            pagination
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
