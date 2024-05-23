import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react'
import PrimaryButton from '@/Components/PrimaryButton';
import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import { usePage } from '@inertiajs/react';
import ProfilePic from '@/Components/UserPicture';


export default function Index({ auth, tournaments, teams }) {
    let currentTime = new Date();
    const today = new Date(); // Data curentă
    today.setHours(0, 0, 0, 0);
    const { flash } = usePage().props
    const [banned, setIsBanned] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [search, setSearch] = useState('');
    const columns = [
        {
            name: 'Name',
            selector: row => ( <div className="text-md font-semibold py-2">
                {row.name}
            </div>),
        },
        {
            name: 'Game',
            selector: row => <ProfilePic username={row.game.name} imgSrc={"storage/"+row.game.image[0].location} ></ProfilePic>,
            width:"225px"
        },
        {
            name: 'Date',
            selector: row =>
            <div className={(today > new Date(row.date)) ? 'text-md font-semibold py-2 text-red-500' : 'text-md font-semibold py-2'}>
                <div>{row.date.split(/\s+/)[0]}</div>
                 {row.hour}
            </div>,
        },
        {
            name: 'Type',
            selector: row => (
                <div className="text-md font-semibold py-2">
                    {row.type}
                </div>
            ),
        },
        {
            name: auth.user.isAdmin ? 'Delete' : 'Entry Fee',
            cell: (row) => auth.user.isAdmin ? <SecondaryButton onClick={() => handleDelete(row.id)}>Delete</SecondaryButton> : <div className="text-md font-semibold py-2">{row.participation_fee}</div>,
            ignoreRowClick: true,
        },
        {
            cell: (row) => row.type != "Team" ?
                <PrimaryButton onClick={() => router.visit(route('tournaments.show', row.id))} title={banned ? "You are currently banned" : ''}disabled={banned ||(today>new Date(row.date)&&row.winnable_id ==0)}>{row.winnable_id == 0 ? "Join" : "See winner"}</PrimaryButton>
                // <PrimaryButton onClick={() => router.visit(route('tournaments.show', row.id))} title={banned ? "You are currently banned" : ''}disabled={banned|| (today.getTime() > new Date(row.date.split(/\s+/)[0]).getTime())}>Join</PrimaryButton>
                : <div>
                    <PrimaryButton id={"btn"+row.id } onClick={() => selectTeam(row.id)} disabled={banned|| (today>new Date(row.date)&&row.winnable_id ==0)}>{row.winnable_id == 0 ? "Join" : "See winner"}</PrimaryButton>
                    {/* <PrimaryButton onClick={() => selectTeam(row.id)} disabled={banned || (today.getTime() > new Date(row.date.split(/\s+/)[0]).getTime())}>Join</PrimaryButton> */}
                        <div>
                            <select onChange={(e) => handleTeamChange(row.id, e.target.value)} id={"select"+row.id} style={{display:"none"}}>
                                <option value="">Select a team</option>
                                {teams.map(team => (
                                    <option key={team.id} value={team.id} >{team.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
        },


    ];
    const handleDelete = (id) => {
        router.delete(route('tournaments.destroy', [id]))
    };
    const logstuff = (date) => {
        console.log(currentTime.getTime());
        console.log(new Date(date).getTime() < currentTime.getTime())
    };
    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };
    const handleSearch = () => {
        router.get('/tournaments', { search });
    };
    const selectTeam = (id) => {
        setShowDropdown(!showDropdown)
        let select = document.querySelector('#select'+id);
        let btn = document.querySelector('#btn'+id)
        if(btn.textContent != "Join"){
            router.visit(route('tournaments.show', id))
        }
        else if (btn.style.display != 'none'){
            select.style.display = 'block' ;
            btn.style.display= 'none';
        }
        else {
            select.style.display = 'none';
            btn.style.display= 'block';
        }
    };
    const handleTeamChange = (rowId, teamId) => {
        router.visit(route('tournaments.show', [rowId, {team_id :teamId}]))
    };
    const textForWinners = (winners) => {
        let text = '';
        winners.map(winner => {
            text += '\n ' + winner.username + " score : " + winner.final_score + ' ';
        })
        return text;
    }
    useEffect(() => {
        let ok = true;
        if(flash.message && flash.message[0].id){
            let textWinners = textForWinners(flash.message)
            ok = false;
            console.log(flash.message)
            Swal.fire({
                title: 'Winners',
                html: '<pre>' + textWinners + '</pre>',
                text: textWinners,
                confirmButtonText: 'Ok',
                preConfirm: () => {
                    // let reas = document.getElementById('swal-input1').value;
                    // setData('reason' , reas);
                }
              }).then((result) => {

              })
        }
        if (flash.message && ok) {
            toastr.error(flash.message);
            ok = false;
        }
        console.log(flash)
        const fetchIsBanned = async () => {
            try {
                const response = await axios.get(`/users/${auth.user.id}/is-banned`);
                setIsBanned(response.data.banned);
            } catch (error) {
                console.error('Error fetching isBanned:', error);
            }
        };
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        if (searchParam) {
            setSearch(searchParam);
        }


        fetchIsBanned();
    }, [auth.user.id, flash]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tournaments</h2>}
        >
            <Head title="Tournaments" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    <div className="py-6 flex gap-x-2">
                        {auth.user.isAdmin != 0 &&
                            <PrimaryButton onClick={() => router.visit(route('tournaments.create'))} id="add-games">Create</PrimaryButton>
                        }
                        <input
                            className='rounded-md'
                            type="text"
                            id="search"
                            placeholder='League of legends...'
                            value={search}
                            onChange={handleSearchChange}
                        />
                        <PrimaryButton onClick={handleSearch}>Search</PrimaryButton>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <DataTable
                            columns={columns}
                            data={tournaments}
                            pagination
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


