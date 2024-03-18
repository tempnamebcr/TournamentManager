<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    public function users()
    {
        return $this->hasMany(User::class, 'team_players', 'team_id', 'user_id');
    }
}
