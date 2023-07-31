<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Roster extends Model
{
    use HasFactory;
    protected $fillable = [
        "name",
        "order",
        "board_id"
    ];
    public function board()
    {
        return $this->belongsTo(Board::class, "board_id");
    }
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
