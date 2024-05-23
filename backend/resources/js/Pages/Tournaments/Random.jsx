import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ChatBox from '@/Components/Chat/ChatBox';
import ChatInput from '@/Components/Chat/ChatInput';
import TournamentUsers from '@/Components/Tournament/TournamentUsers';
import VersusUsers from '@/Components/Tournament/VersusUsers';
import Team from '@/Components/Tournament/Team';
import RandomUsers from '@/Components/Tournament/RandomUsers';
import { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import useScript from '../../Hooks/useScript';
import PrimaryButton from '@/Components/PrimaryButton';
import TimerComponent from '@/Components/TimerComponent';
import UploadPhotoButton from '@/Components/UploadPhotoButton';
import { router } from '@inertiajs/react'

export default function Random({ tournament, auth, messages, game, team, firstTeam, secondTeam }) {
    const { data, setData, post, processing, errors, reset } = useForm({
    });

    //calcul timp turneu
    const timpActual = new Date();
    const oreMinute = tournament.hour.split(":");
    let dataTurneu = new Date(tournament.date);
    //turneul poate fi pornit max 1 ora dupa ce vine ora acestuia, daca nu, devine invalid
    dataTurneu.setHours(oreMinute[0] + 1);
    dataTurneu.setMinutes(oreMinute[1]);
    let clasaCuloare = '';
    let valid = true;
    if (dataTurneu < timpActual) {
        clasaCuloare = 'text-red-500';
        valid=false;
    }
    console.log(tournament.type)

    let [stateMessage, setStateMessage] = useState(messages);
    const [body, setBody] = useState('');
    const [form, setForm] = useState({ body: body,
        tournament: tournament.id,
        processing: false
    });
    //tournament users, their count
    const [activeCount, setActiveCount] = useState(0);
    const [users, setUsers] = useState([]);
    // const [tournamentTeams, setTournamentTeams] = useState([firstTeam, secondTeam]);
    useEffect(() => {
        const listenChat = () => {
            window.Echo.join(`tournament.${tournament.id}`)
            .here((users) => {
                setActiveCount(users.length);
                setUsers([...users]);
            })
            .leaving((user) => {
                setUsers(prevUsers => {
                    const updatedUsers = prevUsers.filter(usr => usr.username !== user.username);
                    setActiveCount(updatedUsers.length);
                    return updatedUsers;
                });
            })
            .joining((user) => {
                setUsers(prevUsers => {
                    console.log(user)
                    const updatedUsers = [...prevUsers, user];
                    setActiveCount(updatedUsers.length);
                    return updatedUsers;
                });
            })
            .listen('.chat-message', (e)=>{
                let newMessage = {
                    body:e.message.body,
                    user:e.user
                }
                const updatedMessages = [...messages, newMessage];
                setStateMessage(updatedMessages);
                messages.push(newMessage)
                console.log(users);
            })
            .listen('.started', (e) => {
                location.reload()
            });
        }
        listenChat();
        return() => {
            window.Echo.leave(`tournament.${tournament.id}`);
        }
    }, [tournament.id]);

    const handleInputChange = (field, value) => {
        setForm({
            ...form,
            [field]: value
        });
    };

    const submitMessage = async (e) => {
        try {
            setForm(prevState => ({
                ...prevState,
                processing:true
            }));
            await axios.post(route('tournaments.message', {id:tournament.id}), {body:form.body});

            setForm(prevState => ({
                ...prevState,
                body: '',
                processing:false
            }));
            setFormSuccess(true);
        } catch (error) {
            console.error('Error submitting message:', error);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{tournament.name}</h2>}
        >
            <Head title="Tournament" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        Active count : {activeCount}
                        <TournamentUsers users={users} />
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg h-128">
                        <span>{tournament.type}</span>
                        <div className="flex">
                            <div className="mx-auto my-0">
                                {game.image && <img src={"../storage/" + game.image[0].location} width="100" height="100" alt="game photo" />}
                            </div>
                        </div>
                        {/*Random*/}
                        {
                            tournament.type == "Random" &&
                            <RandomUsers users={users}></RandomUsers>
                        }
                        {/*endrandom*/}
                        {
                            !tournament.started &&
                            <div className="flex">
                                <div className={`mx-auto my-0 ${clasaCuloare}`}>
                                    {tournament.date.split(' ')[0]}
                                </div>
                            </div>
                        }
                        {
                            !tournament.started &&
                            <div className="flex">
                                <div className={`mx-auto my-0 ${clasaCuloare}`}>
                                    {tournament.hour}
                                </div>
                            </div>
                        }
                        {
                            tournament.started && !tournament.ended &&
                            <TimerComponent tournament={tournament} ended={false}></TimerComponent>
                        }
                        {
                            tournament.ended &&
                            <TimerComponent tournament={tournament} ended={true}></TimerComponent>
                        }
                        <div className="flex justify-end">
                            {auth.user.isAdmin  && !tournament.started ? <PrimaryButton onClick={() => post(route('tournaments.startTournament', [tournament.id, {users:users}]))}>Start tournament</PrimaryButton> : ""}
                            {auth.user.isAdmin  && tournament.started && !tournament.ended ? <PrimaryButton disabled={true}>Waiting for the finish</PrimaryButton> : ""}
                            {auth.user.isAdmin  && tournament.ended  && tournament.winnable_id == 0 ? <PrimaryButton onClick={() => router.visit(route('tournaments.completedTournament', [tournament.id, {tournament:tournament, users:users}]))}>Give prizes</PrimaryButton> : ""}
                            {auth.user.isAdmin  && tournament.ended && tournament.winnable_id != 0 ? <PrimaryButton disabled={true}>Completed</PrimaryButton> : ""}
                            {!auth.user.isAdmin  && !tournament.started ? <PrimaryButton >waiting for players..</PrimaryButton> : ""}
                            {!auth.user.isAdmin  && tournament.started  && !tournament.ended ? <UploadPhotoButton tournament={tournament}/> : ""}
                            {!auth.user.isAdmin  && tournament.ended && tournament.winnable_id == 0 ? <PrimaryButton disabled={true}>Waiting for the prizes</PrimaryButton> : ""}
                            {!auth.user.isAdmin  && tournament.ended && tournament.winnable_id != 0 ? <PrimaryButton disabled={true}>Tournament completed</PrimaryButton> : ""}
                        </div>
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg h-96">
                        <ChatBox messages={stateMessage} currentUser={auth.user}></ChatBox>
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <ChatInput form={form}
                            onInputChange={handleInputChange}
                            method={submitMessage}>
                        </ChatInput>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

