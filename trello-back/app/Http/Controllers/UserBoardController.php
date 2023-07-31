<?php

namespace App\Http\Controllers;

use App\Models\UserBoard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class UserBoardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userBoards = UserBoard::with('creator:name', 'board:title')->get();
        return $userBoards;
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
            'user_id' => 'required',
            'board_id' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->messages(), ResponseAlias::HTTP_BAD_REQUEST);
        }
        $userBoard = new UserBoard();
        $userBoard->fill($request->json()->all());
        $userBoard->save();

        return $userBoard;
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $userBoard = UserBoard::find($id);
        if ($userBoard == null) {
            return response()->json(['message' => 'UserBoard not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        return $userBoard;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UserBoard $userBoard)
    {

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $userBoard = UserBoard::find($id);
        if ($userBoard == null) {
            return response()->json(['message' => 'UserBoard not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        if ($request->method() != "PATCH") {
            $validator = Validator::make($request->json()->all(), [
                'user_id' => 'required',
                'board_id' => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json($validator->messages(), ResponseAlias::HTTP_BAD_REQUEST);
            }
        }
        $userBoard->fill($request->json()->all());
        $userBoard->save();
        return $userBoard;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $userBoard = UserBoard::find($id);
        if ($userBoard == null) {
            return response()->json(['message' => 'UserBoard not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        $userBoard->delete();
        return response()->json(['message' => 'UserBoard deleted.']);
    }

    public function getBoardsByUserId($id)
    {
        $userBoards = UserBoard::where('user_id', $id)->with('board')->get();
        return $userBoards;
    }

}
