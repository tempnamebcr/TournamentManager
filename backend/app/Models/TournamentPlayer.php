<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TournamentPlayer extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = "tournament_players";
    public $timestamps = false;

    public function tournament()
    {
        return $this->belongsTo(Tournament::class, 'tournament_id');
    }
}
