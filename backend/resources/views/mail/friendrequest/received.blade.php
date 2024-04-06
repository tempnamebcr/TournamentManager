@component('mail::message')
# Friend Request Received

**You have received a new friend request from:**

**Name:** {{ $user->name }}

**Username:** {{ $user->username }}

@component('mail::button', ['url' => ''])
Visit their profile
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
