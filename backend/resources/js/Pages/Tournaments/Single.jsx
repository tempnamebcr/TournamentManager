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

export default function Single({ tournament, auth, messages, game }) {

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

    let [stateMessage, setStateMessage] = useState(messages);
    const [body, setBody] = useState('');
    const [form, setForm] = useState({ body: body,
        tournament: tournament.id,
        processing: false
    });
    //tournament users, their count
    const [activeCount, setActiveCount] = useState(0);
    const [users, setUsers] = useState([]);
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
                console.log('chat-message-cu-punct')
                let newMessage = {
                    body:e.message.body,
                    user:e.user
                }
                const updatedMessages = [...messages, newMessage];
                setStateMessage(updatedMessages);
                messages.push(newMessage)
                console.log(users);
            })
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
                        {/* VERSUS */}
                        { tournament.type == "Versus" &&
                            <VersusUsers users={users}></VersusUsers>
                        }
                        {/* END VERSUS */}
                        <div className="flex">
                            <div className={`mx-auto my-0 ${clasaCuloare}`}>
                                {tournament.date.split(' ')[0]}
                            </div>
                        </div>
                        <div className="flex">
                            <div className={`mx-auto my-0 ${clasaCuloare}`}>
                                {tournament.hour}
                            </div>
                        </div>
                        <div className="flex justify-end">
                            {auth.user.isAdmin ? <PrimaryButton >Start tournament</PrimaryButton> : ""}
                            {!auth.user.isAdmin ? <PrimaryButton >waiting for players..</PrimaryButton> : ""}
                        </div>
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg h-96">
                        <ChatBox messages={stateMessage} currentUser={auth.user}></ChatBox>
                        <ChatInput form={form}
                            onInputChange={handleInputChange}
                            method={submitMessage}>
                        </ChatInput>
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

