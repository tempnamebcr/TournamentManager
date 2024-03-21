import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react'
import PrimaryButton from '@/Components/PrimaryButton';
import DataTable from 'react-data-table-component';

const columns = [
	{
		name: 'Title',
		selector: row => row.title,
	},
	{
		name: 'Year',
		selector: row => row.year,
	},
	{
		name: 'edit',
		selector: row => row.edit,
	},
    ,
    {
        cell: (row) => <button onClick={() => handleDelete(row.id)}>Delete</button>,
        ignoreRowClick: true,
    },
];
const handleDelete = (id) => {
    console.log('Row with ID:', id, 'deleted');
};

const data = [
  	{
		id: 1,
		title: 'Beetlejuice',
		edit: '<h1>Beetlejuice</h1>',
		year: '1988',
	},
	{
		id: 2,
		title: 'Ghostbusters',
		edit: '<h1>Beetlejuice</h1>',
		year: '1984',
	},
]

export default function Index({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tournaments</h2>}
        >
            <Head title="Tournaments" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="py-6">
                        <PrimaryButton onClick={() => router.visit(route('tournaments.create'))} id="add-games">Create</PrimaryButton>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <DataTable
                            columns={columns}
                            data={data}
                            selectableRows
                            pagination
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
