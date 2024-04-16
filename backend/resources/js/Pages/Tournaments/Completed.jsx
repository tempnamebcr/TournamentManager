import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import React, { useState } from "react";
import Checkbox from '@/Components/Checkbox';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import TimePicker from 'react-time-picker';


export default function Completed({ auth, games, tournament, users, teams, randomTeams }) {

    const { flash } = usePage().props
    console.log(teams)
    const { data, setData, post, processing, errors, reset } = useForm({
        tournament:tournament,
        users:[],
        teams:[],
        winner:null,
    });
    const submit = (e) => {
        e.preventDefault();
        let inputs = document.querySelectorAll(".userInput");

        inputs.forEach(input => {
            let pair = {
                name: input.name,
                value: input.value
            };
            setData('users', [...data.users, pair])
        });
        post(route('tournaments.givePrizes', { id: tournament.id }));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tournament Preview</h2>}
        >
            <Head title="Tournament Preview" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={submit}>
                        <div>
                            <img src={"../../storage/" + tournament.image.location} alt="" height={1000} width={1000} />
                        </div>
                        <div>
                            <InputLabel htmlFor="winner" value="winner" />
                            <select
                                id="winner"
                                name="winner"
                                value={data.winner}
                                className="mt-1 block w-full"
                                autoComplete="winner"
                                isFocused={true}
                                onChange={(e) => setData('winner', e.target.value)}
                                required
                            >
                                <option value="none">--</option>
                                {users &&  teams==null && randomTeams==null && users.map(user =>(
                                    <option value={user.id}>{user.username}</option>
                                ))}
                                {teams && teams.map(team => (
                                    <option value={team.id}>{team.name}</option>
                                ))}
                                {randomTeams!=null && randomTeams.map(randomTeam, i => (
                                    <option value={randomTeam.id}>{i == 0 && "First"}{i==1 && "Second"}</option>
                                ))}
                            </select>

                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        {flash.message && (
                            <div className="alert alert-success">
                                {flash.message}
                            </div>
                        )}
                        {
                            users && users.map((user, i) => (
                                <div key={i}>
                                <InputLabel htmlFor={`${user.username}${i + 1}`} value={user.username} />
                                <TextInput
                                    id={`${user.username}${i + 1}`}
                                    name={user.id}
                                    type="text"
                                    value={user.finalScore}
                                    className="mt-1 block w-full userInput"
                                    autoComplete={user.username}
                                    isFocused={true}
                                    onChange={(e) => {
                                        const id = e.target.name;
                                        const value = e.target.value;
                                        const index = data.users.findIndex(user => user.id === id);
                                        if (index !== -1) {
                                            setData('users', data.users.map((user, i) => {
                                                if (i === index) {
                                                    return { ...user, value };
                                                } else {
                                                    return user;
                                                }
                                            }));
                                        } else {
                                            setData('users', [...data.users, { id, value }]);
                                        }
                                    }}
                                    required
                                />
                                <InputError message={errors.fee} className="mt-2" />
                            </div>
                            ))
                        }
                        <div className="flex items-center justify-end mt-4">

                            <PrimaryButton className="ms-4" disabled={processing}>
                                Confirm winners
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
