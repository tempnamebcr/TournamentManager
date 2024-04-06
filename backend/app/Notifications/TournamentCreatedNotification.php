<?php

namespace App\Notifications;

use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TournamentCreatedNotification extends Notification
{
    use Queueable;

    public $tournament;
    /**
     * Create a new notification instance.
     */
    public function __construct($tournament)
    {
        $this->tournament = $tournament;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail', 'broadcast'];
    }

    public function toArray($notifiable)
    {
        return [
            'info' => [
                'message' => ' '. $this->tournament->name,
                'link' => '#',
                'avatar' => '#',
                'sent' => Carbon::now(),
            ]
        ];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        //todo markdown
        return (new MailMessage)->markdown('mail.tournaments.created', [
            'tournament' => $this->tournament,
        ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
}
