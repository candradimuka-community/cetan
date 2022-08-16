<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\Message;
use Illuminate\Http\Request;
use App\Events\NewMessageEvent;
use App\Http\Resources\RoomResource;
use App\Http\Resources\MessageResource;
use App\Http\Resources\OtherRoomResource;

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
            $op = $room->user_1_id == $request->user()->id ? $room->user_2_id : $room->user_1_id;
            $newRoom = Room::where('user_1_id',$op)->orWhere('user_2_id',$op)->orderBy('updated_at','desc')->get();
            foreach($newRoom as $nR){
                $nR->op = $op;
            }
            broadcast(new NewMessageEvent($op, new MessageResource($message), OtherRoomResource::collection($newRoom)));
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
            return response()->json([
                'status'=>'Internal Server Error'
            ],500);
        }
    }
    public function getMessageById(Request $request, Message $message)
    {
        try {
            $room = Room::find($message->room_id);
            if(($room->user_1_id != $request->user()->id && $room->user_2_id != $request->user()->id))
            {
                return response()->json([
                    'status'=>'No Content'
                ], 204);
            }
            $message->readed = true;
            $message->readed_at = now();
            $message->save();
            return (New MessageResource($message))
                    ->response()
                    ->setStatusCode(200);
        } catch (\Throwable $th) {
            return response()->json([
                'status'=>'Internal Server Error'
            ],500);
        }
    }
}
