<?php

namespace App\Notifications;

use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\User;

class ReportedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $user;
    public $admin;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($user) {
        $this->user = $user;
        $this->admin = User::where('isAdmin', 1)->first();
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable) {
        return ['database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable) {
        // return (new MailMessage)->markdown('mail.friendrequest.received', [
        //     'user' => $this->user,
        // ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable) {
        return [
            'info' => [
                'message' => "User ".$this->user->username." has been reported.",
                'link' => '#',
                'avatar' => $this->user->profile_photo_url,
                'sent' => Carbon::now()
            ]
        ];
    }
}
