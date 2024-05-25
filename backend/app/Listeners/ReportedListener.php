<?php

namespace App\Listeners;

use App\Events\AddedToTeamEvent;
use App\Events\ReportedEvent;
use App\Notifications\AddedToTeamNotification;
use App\Notifications\ReportedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class ReportedListener
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
     * @param  \App\Events\ReportedEvent  $event
     * @return void
     */
    public function handle(ReportedEvent $event) {
        $event->admin->notify(new ReportedNotification($event->user));
    }
}
