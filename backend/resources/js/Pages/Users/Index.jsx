import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react'
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DataTable from 'react-data-table-component';
import InputLabel from '@/Components/InputLabel';
import ProfilePic from '@/Components/UserPicture';
import { usePage } from '@inertiajs/react';

export default function Index({ auth, users, friends, reqSentTo, pending }) {
    const [currRoute, setCurrRoute] = useState('');
    const { flash } = usePage().props
    const { data, setData, post, processing, errors, reset } = useForm({
        id: 0,
        // reason: ''
    });
    const [bannedUsers, setBannedUsers] = useState([]);
    const [search, setSearch] = useState('');
    const columns = [
        {
            name: 'Username',
            selector: row => <ProfilePic username={row.username} imgSrc={"storage/"+row.image.location} ></ProfilePic>,
        },
        {
            name: 'Level',
            selector: row => <div class="ms-3 relative bg-red-500 text-white rounded px-2 py-1">LVL: {row.level}</div>
        },
        {
            cell: (row) => (auth.user.isAdmin ? <SecondaryButton title={bannedUsers.includes(row.id) ? "Already banned" : ''}disabled={bannedUsers.includes(row.id)}onClick={() => handleDelete(row.id)}>Ban</SecondaryButton> :
            <div>
                <SecondaryButton id={"btn"+row.id}onClick={() => handleReport(row.id)}>Report</SecondaryButton>
                <select onChange={(e) => handleReasonChange(row.id, e.target.value)} id={"select"+row.id} style={{display:"none"}}>
                    <option value="">Select a reason</option>
                    <option>Leaving game</option>
                    <option>Toxicity</option>
                    <option>Cheating</option>
                </select>
            </div>),
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

    const handleReasonChange = (id, reason) => {
        router.visit(route('users.report', [id, {reasonForReport :reason}]))
        Swal.fire({
            title: 'Utilizator raportat',
            confirmButtonText: 'Okay',
          })
    };

    const handleReport = (id) => {
        let select = document.querySelector('#select'+id);
        let btn = document.querySelector('#btn'+id)
        if (btn.style.display != 'none'){
            select.style.display = 'block' ;
            btn.style.display= 'none';
        }
        else {
            select.style.display = 'none';
            btn.style.display= 'block';
        }
    };

    // const handleInputChange = (event) => {
    //     setData('reason', event.target.value);
    // };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleReject = (id) => {
        // fetch(route('friends.reject', { id: id }), {
        setCurrRoute('deny');
        setData('id', id);
    };

    const handleDelete = async (id) => {
        let reasons = await axios.get(route('users.numberOfReports', {id:id}));
        console.log(reasons);
        Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            text: 'Number of reports: ' + reasons.data ,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
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
    const handleSearch = () => {
        router.get('/users', { search });
    };
    const addFriend = (e, id) => {
        e.preventDefault();
        setCurrRoute('add');
        setData('id', id);
    };

    useEffect(() => {
        // if (flash.message) {
        //     toastr.success(flash.message);
        // }
        const fetchBannedUsers= async () => {
            try {
                const response = await axios.get(`/users/fetch-banned`);
                setBannedUsers(response.data.banned_players);
            } catch (error) {
                console.error('Error fetching isBanned:', error);
            }
        };
        fetchBannedUsers()
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
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        if (searchParam && ok) {
            setSearch(searchParam);
        }
    }, [data.id]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Users</h2>}
        >
            <Head title="Users" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="py-6 flex gap-x-2">
                        <input
                            className='rounded-md'
                            type="text"
                            id="search"
                            placeholder='username...'
                            value={search}
                            onChange={handleSearchChange}
                        />
                        <PrimaryButton onClick={handleSearch}>Search</PrimaryButton>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <DataTable
                            columns={columns}
                            data={users}
                            pagination
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


