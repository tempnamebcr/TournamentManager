import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ChatBox from '@/Components/Chat/ChatBox';
import ChatInput from '@/Components/Chat/ChatInput';
import TournamentUsers from '@/Components/Tournament/TournamentUsers';
import { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import useScript from '../../Hooks/useScript';

export default function Show({ tournament, auth, messages }) {

    // const {post} = useForm({})
    let [stateMessage, setStateMessage] = useState(messages);
    const [body, setBody] = useState('');
    const [form, setForm] = useState({ body: body,
        tournament: tournament.id,
        processing: false
    });
    const [activeCount, setActiveCount] = useState(0);
    const [users, setUsers] = useState([]);
    const [formSuccess, setFormSuccess] = useState(false);

    // useEffect(() => {
    //     const listeenChat = () => {
    //         window.Echo.private(`tournament.${tournament.id}`)
    //         .listen('.chat-message', (e)=>{
    //             console.log('chat-message-cu-punct')
    //             let newMessage = {
    //                 body:e.message.body,
    //                 user:e.user
    //             }
    //             const updatedMessages = [...messages, newMessage];
    //             setStateMessage(updatedMessages);
    //             messages.push(newMessage)
    //         })
    //     }
    //     listeenChat()
    // }, []);
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
    const getActive = () => {
        this.updateUserForm.post(this.route('chat-rooms.update', this.room), {
            preserveScroll: true,
            onSuccess:()=>{}
        })
    }

    const submitMessage = async (e) => {
        try {
            setForm(prevState => ({
                ...prevState,
                processing:true
            }));
            await axios.post(route('tournaments.message', {id:tournament.id}), {body:form.body});
            // let newMessage = {
            //     body:e.message.body,
            //     user:e.user
            // }
            // messages.push(newMessage);
            // setStateMessage(messages)
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
