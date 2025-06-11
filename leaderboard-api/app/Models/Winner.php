<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Winner extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'points_at_win',
        'declared_at'
    ];

    protected $casts = [
        'points_at_win' => 'integer',
        'declared_at' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
