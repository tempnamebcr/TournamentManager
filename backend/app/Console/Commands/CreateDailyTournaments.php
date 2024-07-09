<?php

namespace App\Console\Commands;

use App\Events\TournamentCreated;
use App\Models\Tournament;
use Carbon\Carbon;
use Illuminate\Console\Command;
use User;

class CreateDailyTournaments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-daily-tournaments';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create tournaments daily';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $tournament = Tournament::create([
            'name' => "Daily Tournament",
            'game_id' => 2,
            'date' => Carbon::now()->toDateString(),
            'hour' => Carbon::now()->format('H:i'),
            'participation_fee' => 30,
            'type' => "Single",
            'winnable_id' => 0,
            'admin_id' => 1,
            'prize' => 50,
            'winnable_type' => User::class,
            'is_recurrent' => 0,
        ]);
    }
}
