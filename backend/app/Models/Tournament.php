<?php

namespace App\Models;

use App\Events\TournamentCreated;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tournament extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $with = ['game', 'image'];

    public function game()
    {
        return $this->belongsTo(Game::class);
    }
    public function users()
    {
        return $this->belongsToMany(User::class, 'tournament_players', 'team_id', 'user_id');
    }
    public function messages() {
        return $this->hasMany(Message::class);
    }
    public function image()
    {
        return $this->morphOne(Image::class, 'imageable');
    }
    // protected $dispatchesEvents = [
    //     'created' => TournamentCreated::class,
    // ];
}
