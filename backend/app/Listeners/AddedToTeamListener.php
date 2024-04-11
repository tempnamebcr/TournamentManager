<?php

namespace App\Listeners;

use App\Events\AddedToTeamEvent;
use App\Notifications\AddedToTeamNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class AddedToTeamListener
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
     * @param  AddedToTeamEvent  $event
     * @return void
     */
    public function handle(AddedToTeamEvent $event) {
        $event->user->notify(new AddedToTeamNotification($event->team));
    }
}
