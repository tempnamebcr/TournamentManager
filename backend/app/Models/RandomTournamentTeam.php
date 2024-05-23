<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RandomTournamentTeam extends Model
{
    use HasFactory;
    protected $guarded = [];
    public $timestamps = false;
    protected $table = "random_tournament_teams";


}
