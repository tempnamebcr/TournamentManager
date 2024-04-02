import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react'
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DataTable from 'react-data-table-component';


export default function Index({ auth, users, friends, reqSentTo, pending }) {
    const [currRoute, setCurrRoute] = useState('');
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
        {
            cell: (row) => {
                if (reqSentTo.includes(row.id)) {
                    return "Sent";
                }
                if (pending.includes(row.id)) {
                    return (
                        <div>
                            <PrimaryButton id="accept" onClick={() => handleAccept(row.id)}>Accept</PrimaryButton>
                            <SecondaryButton id="reject" onClick={ () => handleReject(row.id) }>Reject</SecondaryButton>
                        </div>
                    );
                }
                if (!friends.includes(row.id)) {
                    return <button onClick={(e) => addFriend(e, row.id)}>Add friend</button>;
                }
                else {
                    return "Friend";
                }
            }
        },
    ];

    const handleAccept = (id) => {
        setCurrRoute('accept');
        setData('id', id);
    };

    const handleReject = (id) => {
        // fetch(route('friends.reject', { id: id }), {
        setCurrRoute('deny');
        setData('id', id);
    };

    const handleDelete = (id) => {
        console.log('Row with ID:', id, 'deleted');
    };
    const addFriend = (e, id) => {
        e.preventDefault();
        setCurrRoute('add');
        setData('id', id);
    };

    useEffect(() => {
        console.log(data.id);
        if (data.id !== 0) {
            if(currRoute == "add"){
                post(route('friends.store'));
            }
            else if(currRoute == "accept"){
                post(route('friends.accept', {id : data.id}));
            }
            else if(currRoute == "deny"){
                post(route('friends.deny', {id : data.id}));
            }
        }
    }, [data.id]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">users</h2>}
        >
            <Head title="Users" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="py-6">
                        <PrimaryButton onClick={() => router.visit(route('users.create'))} id="add-games">Create</PrimaryButton>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <DataTable
                            columns={columns}
                            data={users}
                            selectableRows
                            pagination
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


