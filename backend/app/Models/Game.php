<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    protected $guarded = [];
    protected $with=['image'];

    public function tournaments(): HasMany
    {
        return $this->hasMany(Tournament::class);
    }
    public function image()
    {
        return $this->morphMany(Image::class, 'imageable');
    }
}
