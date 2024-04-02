<?php

namespace App\Listeners;

use App\Events\TournamentCreated;
use App\Models\User;
use App\Notifications\FriendRequestReceived;
use App\Notifications\TournamentCreatedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class TournamentCreatedListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  TournamentCreated  $event
     * @return void
     */
    public function handle(TournamentCreated $event) {
        //users->where->want_to_be_mailed...
        $user = User::where('email', 'andreibucur4@gmail.com')->first();
        $user->notify(new TournamentCreatedNotification($event->tournament));
    }
}
