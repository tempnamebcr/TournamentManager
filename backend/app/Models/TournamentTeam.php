<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TournamentTeam extends Model
{
    use HasFactory; 
    protected $table = 'tournament_teams';
    protected $guarded=[];
    public $timestamps = false;
}
