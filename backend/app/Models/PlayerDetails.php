<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlayerDetails extends Model
{
    use HasFactory;

    public function player() : BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
