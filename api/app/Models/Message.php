<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    public function room()
    {
        return $this->belongsTo(Room::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function child()
    {
        return $this->hasOne(Message::class, 'message_id');
    }
    public function parent()
    {
        return $this->belongsTo(Message::class, 'id');
    }
}
