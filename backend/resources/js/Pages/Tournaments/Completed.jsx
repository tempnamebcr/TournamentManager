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


export default function Completed({ auth, games, tournament, users }) {

    const { flash } = usePage().props

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        date: new Date(),
        type: '',
        game: null,
        recurrent: false,
        fee: null,
        hour: '10:00',
        image: '',
    });
    const submit = (e) => {
        e.preventDefault();
        post(route('tournaments.store'));
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
                        {/* <div>
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
                        </div> */}

                        <div>
                            <img src={"../../storage/" + tournament.image.location} alt="" height={1000} width={1000} />
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
                                <option value="none">--</option>
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
                                    name="recurrent"
                                    checked={data.recurrent}
                                    onChange={(e) => setData('recurrent', e.target.checked)}
                                />
                                <span className="ms-2 text-sm text-gray-600">Recurrent</span>
                            </label>
                        </div>

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
