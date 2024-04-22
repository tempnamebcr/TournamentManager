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
        // reason: ''
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
            cell: (row) => <SecondaryButton onClick={() => handleDelete(row.id)}>Ban</SecondaryButton>,
            ignoreRowClick: true,
        },
        {
            cell: (row) => {
                if (reqSentTo.includes(row.id)) {
                    return <PrimaryButton disabled={true}>Sent</PrimaryButton>;
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
                    return <PrimaryButton onClick={(e) => addFriend(e, row.id)}>Add friend</PrimaryButton>;
                }
                else {
                    return <PrimaryButton disabled={true}>Friend</PrimaryButton>;
                }
            }
        },
    ];

    const handleAccept = (id) => {
        setCurrRoute('accept');
        setData('id', id);
    };

    // const handleInputChange = (event) => {
    //     setData('reason', event.target.value);
    // };

    const handleReject = (id) => {
        // fetch(route('friends.reject', { id: id }), {
        setCurrRoute('deny');
        setData('id', id);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            // html: `<input id="swal-input1" class="swal2-input" placeholder="Enter reason" onInput={(event) => setData('reason', event.target.value)}>`,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            preConfirm: () => {
                // let reas = document.getElementById('swal-input1').value;
                // setData('reason' , reas);
            }
          }).then((result) => {
            if (result.isConfirmed) {
              setCurrRoute('ban');
              setData('id', id);
              Swal.fire(
                'Banned!',
                'The user has been banned for a week',
                'success'
              )
            }
          })
    };
    const addFriend = (e, id) => {
        e.preventDefault();
        setCurrRoute('add');
        setData('id', id);
    };

    useEffect(() => {
        if (data.id !== 0) {
            if(currRoute == "add"){
                post(route('friends.store'));
            }
            else if(currRoute == "accept"){
                post(route('friends.accept', {id : data.id}));
            }
            else if(currRoute == "ban"){
                post(route('users.ban', { id: data.id}));
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


