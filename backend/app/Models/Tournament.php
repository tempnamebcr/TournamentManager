<?php

namespace App\Models;

use App\Events\TournamentCreated;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tournament extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $with = ['game'];

    public function game()
    {
        return $this->belongsTo(Game::class);
    }
    public function users()
    {
        return $this->hasMany(User::class, 'tournament_players', 'team_id', 'user_id');
    }
    protected $dispatchesEvents = [
        'created' => TournamentCreated::class,
    ];
}
