<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;
    protected $fillable = ['body', 'user_id', 'tournament_id'];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['timeAgo'];

    public function getTimeAgoAttribute() {
        return $this->created_at->diffForHumans();
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function tournament() {
        return $this->belongsTo(Tournament::class);
    }
}
