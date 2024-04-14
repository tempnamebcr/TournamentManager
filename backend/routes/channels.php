<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
Broadcast::channel('tournament.{id}', function ($user, $tournament_id) {
    if(Auth::check()) {
        return [
            'username' => $user->username,
            'avatar' => $user->image,
            'teams' => $user->teams
        ];
    }
});
