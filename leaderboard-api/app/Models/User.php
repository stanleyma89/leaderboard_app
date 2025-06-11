<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class User extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'age',
        'points',
        'address',
        'qr_code_path'
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    protected $casts = [
        'points_at_win' => 'integer',
        'declared_at' => 'datetime'
    ];

    public function winners()
    {
        return $this->hasMany(Winner::class);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where('name', 'LIKE', '%' . $search . '%');
    }

    public function scopeOrderByName($query, $direction = 'asc')
    {
        return $query->orderBy('name', $direction);
    }

    public function scopeOrderByPoints($query, $direction = 'desc')
    {
        return $query->orderBy('points', $direction);
    }

    public function addPoints(int $amount): bool
    {
        return $this->increment('points', $amount);
    }
    
    public function subtractPoints(int $amount): bool
    {
        if ($this->points < $amount) {
            return $this->update(['points' => 0]);
        }
        return $this->decrement('points', $amount);
    }
}
