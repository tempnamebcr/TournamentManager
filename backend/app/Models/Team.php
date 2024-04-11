<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'games_won'];
    protected $with = ['users'];

    public function users()
    {
        return $this->belongsToMany(User::class, 'team_players');
    }
}
