<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\Roster;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class BoardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $boards = Board::with("rostersWithTasks")->get();
        return $boards;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $validator = Validator::make($request->json()->all(), [
            'title' => 'required',
            'user_id' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->messages(), ResponseAlias::HTTP_BAD_REQUEST);
        }

        $board = new Board();
        $board->fill($request->json()->all());
        $board->save();

        return $board;
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $board = Board::find($id);
        $board = Board::with("rostersWithTasks")->find($id);
        if ($board == null) {
            return response()->json(['message' => 'Board not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        return $board;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Board $board)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $board = Board::find($id);
        if ($board == null) {
            return response()->json(['message' => 'Board not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        if ($request->method() != "PATCH") {
            $validator = Validator::make($request->json()->all(), [
                'title' => 'required',
                'user_id' => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json($validator->messages(), ResponseAlias::HTTP_BAD_REQUEST);
            }
        }
        $board->fill($request->json()->all());
        $board->save();

        return $board;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $board = Board::find($id);
        if ($board == null) {
            return response()->json(["message" => "Item not found"], ResponseAlias::HTTP_NOT_FOUND);
        }
        $board->delete();

        return response()->json(['message' => 'Board deleted successfully.']);
    }

    //move a task to the next roster
    public function moveNextRosterTask($idBoard, $idTask)
    {
        $board = Board::with("rostersWithTasks")->find($idBoard)->toArray();
        $rosters = $board["rosters_with_tasks"];
        //find the task and save the roster id
        //Also save the next roster id
        $rosterId = 0;
        $nextRosterId = 0;
        for ($i = 0; $i < count($rosters); $i++) {
            $tasks = $rosters[$i]["tasks"];
            for ($j = 0; $j < count($tasks); $j++) {
                if ($tasks[$j]["id"] == $idTask) {
                    $rosterId = $rosters[$i]["id"];
                    if ($i + 1 < count($rosters)) {
                        $nextRosterId = $rosters[$i + 1]["id"];
                    }
                }
            }
        }
        //with the $nextRosterId, we can update the task
        $task = Task::find($idTask);
        $task->roster_id = $nextRosterId;
        //with the $nextRosterId find the length of the tasks array
        $tasks = Roster::find($nextRosterId)->tasks;
        $task->order = count($tasks) + 1;
        $task->save();
        return $task;
    }
    public function moveBackRosterTask($idBoard, $idTask)
    {
        $board = Board::with("rostersWithTasks")->find($idBoard)->toArray();
        $rosters = $board["rosters_with_tasks"];
        //find the task and save the roster id
        //Also save the next roster id
        $rosterId = 0;
        $nextRosterId = 0;
        for ($i = 0; $i < count($rosters); $i++) {
            $tasks = $rosters[$i]["tasks"];
            for ($j = 0; $j < count($tasks); $j++) {
                if ($tasks[$j]["id"] == $idTask) {
                    $rosterId = $rosters[$i]["id"];
                    if ($i - 1 >= 0) {
                        $nextRosterId = $rosters[$i - 1]["id"];
                    }
                }
            }
        }
        //with the $nextRosterId, we can update the task
        $task = Task::find($idTask);
        $task->roster_id = $nextRosterId;
        $tasks = Roster::find($nextRosterId)->tasks;
        $task->order = count($tasks) + 1;
        $task->save();
        return $task;
    }


}
