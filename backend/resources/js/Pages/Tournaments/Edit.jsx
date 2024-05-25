import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import React, { useState, useEffect } from "react";
import Checkbox from '@/Components/Checkbox';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import TimePicker from 'react-time-picker';


export default function Edit({ auth, tournament, games }) {

    const { flash } = usePage().props

    const { data, setData, put, processing, errors, reset } = useForm({
        name: tournament.name,
        date: tournament.date,
        type: tournament.type,
        game: tournament.game_id,
        is_recurrent: tournament.is_recurrent,
        fee: tournament.participation_fee,
        hour: tournament.hour,
    });
    const submit = (e) => {
        e.preventDefault();
        put(route('tournaments.update', tournament));
    };
    useEffect(() => {
        if (flash.message) {
            Swal.fire({
                title: flash.message,
                confirmButtonText: 'Ok',
              })
        }
      }, [flash]);

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
                                value={data.game}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('game', e.target.value)}
                                required
                            >
                                <option value="0">select</option>
                                {games.map((game) => (
                                    <option key={game.id} value={game.id} selected={game.id === tournament.game_id}>
                                        {game.name}
                                    </option>
                                ))}

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
                                <option value="">Select</option>
                                <option>Single</option>
                                <option>Random</option>
                                <option>Team</option>
                            </select>

                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="fee" value="Fee" />
                            <TextInput
                                id="fee"
                                name="fee"
                                type="number"
                                value={data.fee}
                                className="mt-1 block w-full"
                                autoComplete="fee"
                                isFocused={true}
                                onChange={(e) => setData('fee', e.target.value)}
                                required
                            />

                            <InputError message={errors.fee} className="mt-2" />
                        </div>
                        <div className="block mt-4">
                            <label className="flex items-center">
                                <Checkbox
                                    name="is_recurrent"
                                    checked={data.is_recurrent}
                                    onChange={(e) => setData('is_recurrent', e.target.checked)}
                                />
                                <span className="ms-2 text-sm text-gray-600">Recurrent</span>
                            </label>
                        </div>

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
