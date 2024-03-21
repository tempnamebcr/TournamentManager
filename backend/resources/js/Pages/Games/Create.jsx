import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';


export default function Create({ auth }) {

    const { flash } = usePage().props

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
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
                    <form onSubmit={submit} encType="multipart/form-data">
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
                            <InputLabel htmlFor="image" value="Image" />
                            <input
                                type="file"
                                id="image"
                                name="image"
                                className="mt-1 block w-full"
                                onChange={(e) => setData('image',e.target.files[0])}
                                required
                            />
                            <InputError message={errors.image} className="mt-2" />
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
