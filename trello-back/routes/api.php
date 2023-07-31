<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\RosterController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserBoardController;
use App\Models\UserBoard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return $request->user();
});

Route::post("login", [AuthController::class, "login"]);
Route::post("register", [AuthController::class, "register"]);

Route::group(["middleware" => "auth:sanctum"], function () {
    Route::get("board", [BoardController::class, "index"]);
    Route::post("board", [BoardController::class, "store"]);
    Route::get("board/{id}", [BoardController::class, "show"]);
    Route::put("board/{id}", [BoardController::class, "update"]);
    Route::patch("board/{id}", [BoardController::class, "update"]);
    Route::delete("board/{id}", [BoardController::class, "destroy"]);
});
Route::resource("roster", RosterController::class);
Route::get("userBoard/{id}", [UserBoardController::class, "getBoardsByUserId"]);
Route::post("task/orderSum/{id}", [TaskController::class, "upOrderTask"]);
Route::post("task/orderRest/{id}", [TaskController::class, "downOrderTask"]);
Route::post("task/moveNextRoster/{idBoard}/{idTask}", [BoardController::class, "moveNextRosterTask"]);
Route::post("task/moveBackRoster/{idBoard}/{idTask}", [BoardController::class, "moveBackRosterTask"]);
Route::resource("userBoard", UserBoardController::class);
Route::resource("task", TaskController::class);
