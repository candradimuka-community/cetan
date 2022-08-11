<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\Message;
use Illuminate\Http\Request;
use App\Http\Resources\MessageResource;

class MessageController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'room_id'=>'required|numeric',
            'body'=>'required',
            'message_id'=>'nullable',
        ]);
        try {
            $room = Room::find($request->room_id);
            if($room->user_1_id != $request->user()->id && $room->user_2_id != $request->user()->id ){
                return response()->json([
                    'status'=>'you are not in this room'
                ], 422);
            }
            $message = Message::create([
                'room_id'=>$room->id,
                'message_id'=>$request->message_id,
                'user_id'=>$request->user()->id,
                'body'=>$request->body
            ]);
            $room->updated_at = now();
            $room->save();
            return (new MessageResource($message))
                    ->response()
                    ->setStatusCode(201);
        } catch (\Throwable $th) {
            return response()->json([
                'status'=>'Internal Server Error'
            ],500);
        }
    }
    public function deleteMessage(Request $request, Message $message){
        try {
            if($message->user_id != $request->user()->id){
                return response()->json([
                    'status'=>'you are not in this room'
                ], 422);
            }
            try {
                $message->child->message_id = null;
                $message->child->save();
            } catch (\Throwable $th) {
                //throw $th;
            }
            $message->delete();
            return response()->json([
                'status'=>'deleted'
            ], 200);
        } catch (\Throwable $th) {
            return $th;
            return response()->json([
                'status'=>'Internal Server Error'
            ],500);
        }
    }
}
