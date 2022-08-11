<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\User;
use App\Models\Message;
use Illuminate\Http\Request;
use App\Http\Resources\RoomResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\MessageResource;

class RoomController extends Controller
{
    public function userList(Request $request)
    {
        $request->validate([
            'email'=>'nullable'
        ]);
        try {
            $user = User::where('email','LIKE','%'.$request->email.'%')->where('id','!=',$request->user()->id)->get();
            if(!$user){
                return response()->json([
                    'status'=>'User not found'
                ],400);
            }
            return (UserResource::collection($user))
                    ->response()
                    ->setStatusCode(200);
        } catch (\Throwable $th) {
            return response()->json([
                'status'=>'Internal Server Error'
            ],500);
        }
    }
    public function roomList(Request $request)
    {
        try {
            return (RoomResource::collection(Room::where('user_1_id',$request->user()->id)->orWhere('user_2_id',$request->user()->id)->orderBy('updated_at','desc')->get()))
                    ->response()
                    ->setStatusCode(200);
        } catch (\Throwable $th) {
            return response()->json([
                'status'=>'Internal Server Error'
            ],500);
        }
    }
    public function createRoom(Request $request)
    {
        $request->validate([
            'opponent'=>'required|numeric'
        ]);
        try {
            $room = Room::where('user_1_id',$request->opponent)
                        ->where('user_2_id',$request->user()->id)
                        ->first();
            if ($room){
                return (new RoomResource($room))
                        ->response()
                        ->setStatusCode(200);
            }
            $room = Room::where('user_2_id',$request->opponent)
                        ->where('user_1_id',$request->user()->id)
                        ->first();
            if ($room){
                return (new RoomResource($room))
                        ->response()
                        ->setStatusCode(200);
            }
            $room = Room::create([
                'user_1_id'=>$request->user()->id,
                'user_2_id'=>$request->opponent
            ]);
            return (new RoomResource($room))
                    ->response()
                    ->setStatusCode(201);
        } catch (\Throwable $th) {
            return response()->json([
                'status'=>'Internal Server Error',
                'error'=>$th
            ],500);
        }
    }
    public function roomDetail(Request $request, Room $room)
    {
        if($room->user_1_id != $request->user()->id && $room->user_2_id != $request->user()->id){
            return response()->json([
                'status'=>'You are not in this room'
            ],422);
        }
        return (MessageResource::collection(Message::where('room_id',$room->id)->paginate(10)))
                ->response()
                ->setStatusCode(200);
    }
}
