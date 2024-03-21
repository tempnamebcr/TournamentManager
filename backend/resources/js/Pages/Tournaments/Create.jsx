import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import TimePicker from 'react-time-picker';


export default function Create({ auth, games }) {

    const { flash } = usePage().props

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        date: '',
        type: '',
        hour: '10:00',
        image: '',
    });
    const submit = (e) => {
        e.preventDefault();
        console.log(flash);
        post(route('games.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Games</h2>}
        >
            <Head title="Games" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={submit}>
                        <div>
                            <InputLabel htmlFor="name" value="Name" />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />

                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="game" value="Game" />
                            <select
                                id="game"
                                name="game"
                                value={data.name}
                                className="mt-1 block w-full"
                                autoComplete="game"
                                isFocused={true}
                                onChange={(e) => setData('game', e.target.value)}
                                required
                            >
                            {games.map((game)=>{
                                return <option value={game.id}>{game.name}</option>
                            })}

                            </select>

                            <InputError message={errors.game} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="date" value="Date" />
                            <DatePicker selected={data.date} onChange={(date) => setData('date',date)} />
                            <InputError message={errors.date} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="hour" value="Hour" />
                            <TimePicker value={data.hour} onChange={(hour) => setData('hour',hour)} />
                            <InputError message={errors.hour} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="type" value="Type" />
                            <select
                                id="type"
                                name="type"
                                value={data.type}
                                className="mt-1 block w-full"
                                autoComplete="type"
                                isFocused={true}
                                onChange={(e) => setData('type', e.target.value)}
                                required
                            >
                                <option>Single</option>
                                <option>Random</option>
                                <option>Team</option>
                            </select>

                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        {flash.message && (
                            <div className="alert alert-success">
                                {flash.message}
                            </div>
                        )}

                        <div className="flex items-center justify-end mt-4">

                            <PrimaryButton className="ms-4" disabled={processing}>
                                Confirm
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
