import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react'
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DataTable from 'react-data-table-component';
import { usePage } from '@inertiajs/react';
import ProfilePic from '@/Components/UserPicture';


export default function Index({ auth, friends, teams}) {
    const { flash } = usePage().props
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        id: 0,
    });
    const columns = [
        {
            name: 'Username',
            selector: row => <ProfilePic username={row.username} imgSrc={"storage/"+row.image.location} ></ProfilePic>,
        },
        {
            name: 'Level',
            selector: row => <div class="relative bg-red-500 text-white rounded px-2 py-1">LVL: {row.level}</div>
        },
        {
            cell: (row) => <SecondaryButton onClick={() => handleDelete(row.id)}>Remove</SecondaryButton>,
            ignoreRowClick: true,
        },
        {
            cell: (row) =>
                <div>
                    <PrimaryButton id={"btn"+row.id} onClick={() => addToTeam(row.id)}>Add to team</PrimaryButton>
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
        let btn = document.querySelector('#btn'+id)
        if (select.style.display == 'none'){
            select.style.display = 'block' ;
            btn.style.display= 'none';
        }
        else {
            select.style.display = 'none';
            btn.style.display= 'block';
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
    useEffect(() => {
        if (flash.message) {
            toastr.success(flash.message);
        }
      }, [flash]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Friends</h2>}
        >
            <Head title="Friends" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <DataTable
                            columns={columns}
                            data={friends}
                            pagination
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


