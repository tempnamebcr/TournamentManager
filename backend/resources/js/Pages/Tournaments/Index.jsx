import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react'
import PrimaryButton from '@/Components/PrimaryButton';
import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';





export default function Index({ auth, tournaments, teams }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const columns = [
        {
            name: 'name',
            selector: row => row.name,
        },
        {
            name: 'game',
            selector: row => row.game.name
        },
        {
            name: 'date',
            selector: row => row.date.split(/\s+/)[0],
        },
        {
            name: 'hour',
            selector: row => row.hour,
        },
        {
            cell: (row) => <button onClick={() => handleDelete(row.id)}>Delete</button>,
            ignoreRowClick: true,
        },
        {
            cell: (row) => <button onClick={() => router.visit(route('tournaments.show', row.id))}>Join</button>,
        },
        {
            cell: (row) =>
                <div>
                    <button onClick={() => selectTeam(row.id)}>Join</button>
                        <div>
                            <select onChange={(e) => handleTeamChange(row.id, e.target.value)} id={"select"+row.id} style={{display:"none"}}>
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
        console.log('Row with ID:', id, 'deleted');
    };
    const selectTeam = (id) => {
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
        router.visit(route('tournaments.show', [rowId, {team_id :teamId}]))
    };

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
                            data={tournaments}
                            selectableRows
                            pagination
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


