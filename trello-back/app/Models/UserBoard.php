<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserBoard extends Model
{
    use HasFactory;
    protected $fillable = [
        "user_id",
        "board_id"
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, "user_id");
    }

    public function board()
    {
        return $this->belongsTo(Board::class, "board_id");
    }



}
