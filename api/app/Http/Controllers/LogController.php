<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class LogController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'email'=>'required|email:dns'
        ]);
        try {
            $user = User::where('email', $request->email)->first();
            if(!$user){
                $user = User::create([
                    'email'=>$request->email,
                    'code'=>random_int(100000, 999999)
                ]);
                return response()->json([
                    'status'=>'created',
                    'data'=>$user
                ],201);
            }
            if($user->email_verified_at == null){
                $user->code = random_int(100000,999999);
                $user->save();
                return response()->json([
                    'status'=>'created',
                    'data'=>$user
                ],201);
            }
            return response()->json([
                'status'=>'ok',
                'data'=>$user
            ],200);
        } catch (\Throwable $th) {
            return response()->json([
                'status'=>'Internal Server Error'
            ],500);
        }
    }

    public function validateCode(Request $request)
    {
        $request->validate([
            'email'=>'required|email:dns',
            'code'=>'required|numeric'
        ]);
        try {
            $user = User::where('email',$request->email)->first();
            if(!$user){
                return response()->json([
                    'status'=>'Email Not Found'
                ],400);
            }
            if($user->code == $request->code){
                $user->email_verified_at = now();
                $user->save();
                return response()->json([
                    'status'=>'Code Validated',
                    'data'=>$user
                ]);
            } else {
                return response()->json([
                    'status'=>'Code Invalid'
                ],422);
            }
        } catch (\Throwable $th) {
            return response()->json([
                'status'=>'Internal Server Error'
            ],500);
        }
    }

    public function setPassword(Request $request)
    {
        $request->validate([
            'email'=>'required|email:dns',
            'password'=>'required|min:8'
        ]);
        try {
            $user = User::where('email', $request->email)->first();
            if(!$user){
                return response()->json([
                    'status'=>'Email Not Found'
                ],400);
            }
            if($user->email_verified_at == null){
                return response()->json([
                    'status'=>'Email Not Verified'
                ],422);
            }
            if($user->password != null){
                return response()->json([
                    'status'=>'Password has setted a while ago. if you forget the password, please change your password'
                ],422);
            }
            $user->password = Hash::make($request->password);
            $user->save();
            return response()->json([
                'status'=>'Password Added',
                'data'=>$user,
                'token'=>$user->createToken('Cetan-App')->plainTextToken
            ],200);
        } catch (\Throwable $th) {
            return response()->json([
                'status'=>'Internal Server Error'
            ],500);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'=>'required|email:dns',
            'password'=>'required|min:8'
        ]);
        try {
            $user = User::where('email', $request->email)->first();
            if(!$user){
                return response()->json([
                    'status'=>'Email Not Found'
                ],400);
            }
            if($user->email_verified_at == null){
                return response()->json([
                    'status'=>'Email Not Verified'
                ],422);
            }
            if(Hash::check($request->password, $user->password)){
                return response()->json([
                    'status'=>'Login Success',
                    'data'=>$user,
                    'token'=>$user->createToken('Cetan-App')->plainTextToken
                ],200);
            }
            return response()->json([
                'status'=>'Wrong Password'
            ],422);
        } catch (\Throwable $th) {
            return response()->json([
                'status'=>'Internal Server Error'
            ],500);
        }
    }
}
