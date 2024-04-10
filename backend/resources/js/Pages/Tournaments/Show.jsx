import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ChatBox from '@/Components/Chat/ChatBox';
import ChatInput from '@/Components/Chat/ChatInput';
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

    useEffect(() => {
        const listeen = () => {
            window.Echo.private(`tournament.${tournament.id}`)
            .listen('.NewChatMessageEvent', (e) => {
                console.log(e.user);
                console.log(e.message);
                console.log("qweqweqweqwe");
                // let newMessage = {
                //     body:e.message.body,
                //     user:e.user
                // }
                // messages.push(newMessage)
                // conso
                console.log(newMessage);
            })
            .listen('.BroadcastNotificationCreated', (e)=>{
                console.log('broadcastcupunct')
            })
            .listen('BroadcastNotificationCreated', (e)=>{
                console.log('broadcastfarapunct')
            })
            .listen('NewChatMessageEvent', (e)=>{
                console.log('newfarapunct')
            })
            .listen('chat-message', (e)=>{
                console.log('chat-message-fara-punct')
            })
            .listen('.chat-message', (e)=>{
                console.log('chat-message-cu-punct')
                let newMessage = {
                    body:e.message.body,
                    user:e.user
                }
                const updatedMessages = [...messages, newMessage];
                setStateMessage(updatedMessages);
                console.log(stateMessage)
            })
        }
        listeen();
    }, []);

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
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
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
