<?php

namespace App\Http\Resources;

use App\Models\User;
use App\Models\Message;
use Illuminate\Http\Resources\Json\JsonResource;

class OtherRoomResource extends JsonResource
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
            'opponent'=>new UserResource(User::find($this->user_1_id == $this->op ? $this->user_2_id : $this->user_1_id)),
            'last_active'=>$this->updated_at->diffForHumans(),
            'last_message'=>new MessageResource(Message::where('room_id',$this->id)->orderBy('id','desc')->first())
        ];
    }
}
