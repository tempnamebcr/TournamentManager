<?php

namespace App\Console\Commands;

use App\Events\TournamentCreated;
use App\Models\Tournament;
use Carbon\Carbon;
use Illuminate\Console\Command;
use User;

class CreateRecurrentTournaments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-recurrent-tournaments';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $tournaments = Tournament::where('is_recurrent', 1)->get();
        foreach($tournaments as $tournament){
            $creating = Tournament::create([
                'name' => $tournament->name,
                'game_id' => $tournament->game_id,
                'date' => Carbon::now()->toDateString(),
                'hour' => Carbon::now()->format('H:i'),
                'participation_fee' => $tournament->participation_fee,
                'type' => $tournament->type,
                'winnable_id' => 0,
                'admin_id' => $tournament->admin_id,
                'prize' => $tournament->prize,
                'winnable_type' => $tournament->winnable_type,
                'is_recurrent' => 0,
            ]);
        }
    }
}
