<?php

namespace App\Http\Controllers;

use App\Events\AddedToTeamEvent;
use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\Image;
use App\Models\TeamPlayer;
use App\Models\TournamentPlayer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class TeamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = auth()->user()->id;
        $teams = Team::whereHas('users', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->get();
        return Inertia::render('Teams/Index', ['status' => session('status'), 'teams' => $teams]);
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
    public function seeMembers(string $id)
    {
        $teams = TeamPlayer::join('users', 'team_players.user_id', '=', 'users.id')->join('teams', 'team_players.team_id', '=', 'teams.id')->where('team_id', $id)->get();
        return back()->with('message', $teams);
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
        $team = TeamPlayer::where('team_id', $id)->where('user_id', auth()->user()->id)->first();
        $team->delete();
        return back()
            ->with('message', 'Left team successfully');
    }
    public function addPlayer(Request $request)
    {
        $team = Team::find($request->team_id);
        if ($team->users()->where('user_id', $request->user_id)->exists()) {
            return back()->with('message', 'Utilizatorul este deja în echipa!');
        }
        $team->users()->attach($request->user_id);
        $user = User::find($request->user_id);
        event(new AddedToTeamEvent($user, $team));
        return back()->with('message', 'Prieten adaugat cu succes!');
    }
}
