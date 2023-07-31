<?php

namespace App\Http\Controllers;

use App\Models\Roster;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class RosterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rosters = Roster::with("tasks")->get();
        return $rosters;
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
            'board_id' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->messages(), ResponseAlias::HTTP_BAD_REQUEST);
        }

        $roster = new Roster();
        $roster->fill($request->json()->all());
        $roster->save();

        return $roster;

    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $roster = Roster::find($id);
        if ($roster == null) {
            return response()->json(['message' => 'Roster not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        return $roster;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Roster $roster)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $roster = Roster::find($id);
        if ($roster == null) {
            return response()->json(['message' => 'Roster not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        if ($request->method() != "PATCH") {
            $validator = Validator::make($request->json()->all(), [
                'name' => 'required',
                'order' => 'required',
                'board_id' => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json($validator->messages(), ResponseAlias::HTTP_BAD_REQUEST);
            }
        }
        $roster->fill($request->json()->all());
        $roster->save();
        return $roster;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $roster = Roster::find($id);
        $roster->delete();
        return response()->json(['message' => 'Roster deleted.'], ResponseAlias::HTTP_OK);
    }

}
