<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\Image;
use App\Models\TeamPlayer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // dd(Team::all());
        return Inertia::render('Teams/Index', ['status' => session('status'), 'teams' => Team::all()]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Teams/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $team = Team::create([
            'name' => $request->name,
            'games_won' => 0
        ]);
        if ($request->hasFile('image')) {
            $image = $request->file('image')->getClientOriginalName();
            $path = $request->file('image')->storeAs('avatars', $image, 'public');
            $image = Image::create([
                'imageable_type' => "App\Models\Team",
                'imageable_id' => $team->id,
                'location' => $path,
            ]);
        }
        $team->users()->attach(auth()->user()->id);
        return back()->with('message', 'Echipa a fost creata cu succes!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
    public function addPlayer(Request $request)
    {
        $team = Team::find($request->team_id);
        if ($team->users()->where('user_id', auth()->user()->id)->exists()) {
            return back()->with('message', 'Utilizatorul este deja în echipa!');
        }
        $team->users()->attach(auth()->user()->id);
        return back()->with('message', 'Prieten adăugat în echipă cu succes!');
    }
}
