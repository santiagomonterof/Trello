<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;
    protected $fillable = [
        "name",
        "order",
        "roster_id"
    ];

    public function roster()
    {
        return $this->belongsTo(Roster::class, "roster_id");
    }
}
