@component('mail::message')
# A new tournament was created

**{{ $tournament->name }}** was created

@component('mail::button', ['url' => route('dashboard')])
Go check it out
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
