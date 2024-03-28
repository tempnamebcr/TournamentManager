<?php

namespace App\Models;

use App\Events\TournamentCreated;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tournament extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function game(): HasOne
    {
        return $this->hasOne(Game::class);
    }
    public function users()
    {
        return $this->hasMany(User::class, 'tournament_players', 'team_id', 'user_id');
    }
    protected $dispatchesEvents = [
        'created' => TournamentCreated::class,
    ];
}
