<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Board extends Model
{
    use HasFactory;

    protected $fillable = [
        "title",
        "user_id"
    ];
        public function creator()
        {
            return $this->belongsTo(User::class, "user_id");
        }

    public function rosters()
    {
        return $this->hasMany(Roster::class);
    }
    //function that return the rosters with the tasks inside
    public function rostersWithTasks()
    {
        return $this->hasMany(Roster::class)->with('tasks');
    }
}
