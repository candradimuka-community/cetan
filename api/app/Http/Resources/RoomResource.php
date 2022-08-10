<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;

class RoomResource extends JsonResource
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
            // 'self'=>new UserResource(User::find($request->user()->id)),
            'opponent'=>new UserResource(User::find($this->user_1_id == $request->user()->id ? $this->user_2_id : $this->user_1_id)),
            'last_active'=>$this->updated_at->diffForHumans()
        ];
    }
}
