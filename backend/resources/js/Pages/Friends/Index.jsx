import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react'
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DataTable from 'react-data-table-component';
import { usePage } from '@inertiajs/react';


export default function Index({ auth, friends, teams}) {
    const { flash } = usePage().props
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
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
            cell: (row) =>
                <div>
                    <button onClick={() => addToTeam(row.id)}>Add to team</button>
                        <div>
                            <select value={selectedTeam} onChange={(e) => handleTeamChange(row.id, e.target.value)} id={"select"+row.id} style={{display:"none"}}>
                                <option value="">Select a team</option>
                                {teams.map(team => (
                                    <option key={team.id} value={team.id} >{team.name}</option>
                                ))}
                            </select>
                        </div>
                </div>,
            ignoreRowClick: true,
        },
    ];

    const handleDelete = (id) => {
        setData('id', id);
    };
    const addToTeam = (id) => {
        setShowDropdown(!showDropdown)
        let select = document.querySelector('#select'+id);
        if (select.style.display == 'none'){
            select.style.display = 'block' ;
        }
        else {
            select.style.display = 'none';
        }
    };
    const handleTeamChange = (rowId, teamId) => {
        post(route('teams.addPlayer', {user_id:rowId , team_id:teamId}))
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
                        {flash.message && (
                            <div className="alert alert-success">
                                {flash.message}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


