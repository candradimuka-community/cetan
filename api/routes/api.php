<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/register',[LogController::class,'register']);
Route::post('/login',[LogController::class,'login']);
Route::post('/code',[LogController::class,'validateCode']);
Route::post('/code/{user:email}',[LogController::class,'resendCode']);
Route::post('/set-password',[LogController::class,'setPassword']);
Route::post('/reset-password/{user:email}',[LogController::class,'resetPassword']);

Route::group(['middleware'=>'auth:sanctum'], function (){
    Route::get('/user',[LogController::class,'user']);
    Route::post('/change-password',[LogController::class,'changePassword']);


    Route::post('/user', [RoomController::class,'userList']);
    Route::get('/room', [RoomController::class,'roomList']);
    Route::post('/room', [RoomController::class,'createRoom']);
    Route::get('/room/{room}', [RoomController::class,'roomDetail']);
});
