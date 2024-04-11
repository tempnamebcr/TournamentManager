<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        \App\Events\FriendRequestReceivedEvent::class => [
            \App\Listeners\FriendRequestReceivedListener::class,
        ],
        \App\Events\FriendRequestAcceptedEvent::class => [
            \App\Listeners\FriendRequestAcceptedListener::class,
        ],
        \App\Events\TournamentCreated::class => [
            \App\Listeners\TournamentCreatedListener::class,
        ],
        \App\Events\AddedToTeamEvent::class => [
            \App\Listeners\AddedToTeamListener::class,
        ],
        // \App\Events\NewChatMessageEvent::class => [
            // \App\Listeners\NewChatMessageListener::class,
        // ]
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
