<?php

namespace App\Http\Resources;

use App\Models\Message;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id'=>$this->id,
            'body'=>$this->body,
            'room_id'=>$this->room_id,
            'user_id'=>$this->user_id,
            'readed'=>$this->readed,
            'readed_at'=>$this->readed_at,
            'time'=>$this->created_at,
            'parent'=>$this->message_id != null ? new MessageResource(Message::find($this->message_id)) : []
        ];
    }
}
