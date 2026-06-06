<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Keys extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'key',
        'key_hash',
    ];

    protected $hidden = [
        'id',
        'user_id',
        'key_hash',
    ];

    protected $casts = [
        'key' => 'encrypted',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
