import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react'
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DataTable from 'react-data-table-component';


export default function Index({ auth, friends}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        id: 0,
    });
    const columns = [
        {
            name: 'username',
            selector: row => row.username,
        },
        {
            name: 'level',
            selector: row => row.level
        },
        {
            cell: (row) => <button onClick={() => handleDelete(row.id)}>Delete</button>,
            ignoreRowClick: true,
        },
    ];

    const handleDelete = (id) => {
        setData('id', id);
    };

    useEffect(() => {
        if (data.id !== 0) {
            post(route('friends.delete', {id : data.id}));
        }
    }, [data.id]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Friends</h2>}
        >
            <Head title="Friends" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="py-6">
                        nobutton
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <DataTable
                            columns={columns}
                            data={friends}
                            selectableRows
                            pagination
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


