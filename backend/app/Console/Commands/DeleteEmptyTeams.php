<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Team;
use Illuminate\Support\Facades\Storage;

class DeleteEmptyTeams extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:delete-empty-teams';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete teams that have no remaining players';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Team::doesntHave('users')->each(function ($team) {
            if ($team->image) {
                Storage::disk('public')->delete($team->image->location);
                $team->image->delete();
            }
            $team->delete();
        });
    }
}
