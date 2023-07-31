<?php

namespace App\Http\Controllers;

use App\Models\Roster;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tasks = Task::all();
        return $tasks;
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
            'name' => 'required',
            'order' => 'required',
            'roster_id' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->messages(), ResponseAlias::HTTP_BAD_REQUEST);
        }

        $task = new Task();
        $task->fill($request->json()->all());
        $task->save();

        return $task;
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $task = Task::find($id);
        if ($task == null) {
            return response()->json(['message' => 'Task not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        return $task;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $task = Task::find($id);
        if ($task == null) {
            return response()->json(['message' => 'Task not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        if ($request->method() != "PATCH") {
            $validator = Validator::make($request->json()->all(), [
                'name' => 'required',
                'order' => 'required',
                'roster_id' => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json($validator->messages(), ResponseAlias::HTTP_BAD_REQUEST);
            }
        }
        $task->fill($request->json()->all());
        $task->save();
        return $task;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $task = Task::find($id);
        if ($task == null) {
            return response()->json(['message' => 'Task not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        $task->delete();
        return response()->json(['message' => 'Task deleted.']);
    }








    //find the task by de id with the next task and sum the 1 to the current task and rest 1 to the next task
    public function upOrderTask($id)
    {
        $task = Task::find($id);
        if ($task == null) {
            return response()->json(['message' => 'Task not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        $nextTask = Task::where('order', $task->order + 1)->first();
        if ($nextTask == null) {
            return response()->json(['message' => 'Task not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        $task->order = $task->order + 1;
        $nextTask->order = $nextTask->order - 1;
        $task->save();
        $nextTask->save();
        return $task;
    }

    public function downOrderTask($id){
        $task = Task::find($id);
        if ($task == null) {
            return response()->json(['message' => 'Task not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        $nextTask = Task::where('order', $task->order - 1)->first();
        if ($nextTask == null) {
            return response()->json(['message' => 'Task not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        $task->order = $task->order - 1;
        $nextTask->order = $nextTask->order + 1;
        $task->save();
        $nextTask->save();
        return $task;
    }

    //select all the rosters by the user_id and move the task next roster
    public function moveTaskNextRoster($id){
        $task = Task::find($id);
        if ($task == null) {
            return response()->json(['message' => 'Task not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        $nextRoster = Task::where('roster_id', $task->roster_id + 1)->first();
        if ($nextRoster == null) {
            return response()->json(['message' => 'Task not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        $task->roster_id = $task->roster_id + 1;
        $task->save();
        return $task;
    }


    public function moveTaskBackRoster($id){
        $task = Task::find($id);
        if ($task == null) {
            return response()->json(['message' => 'Task not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        $nextRoster = Task::where('roster_id', $task->roster_id - 1)->first();
        if ($nextRoster == null) {
            return response()->json(['message' => 'Task not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        $task->roster_id = $task->roster_id - 1;
        $task->save();
        return $task;
    }

    //save all the rosters by the user_id and move the task next roster




}
