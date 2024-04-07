<?php

namespace App\Http\Controllers;

use App\Events\NewChatMessageEvent;
use App\Events\TournamentCreated;
use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;
use App\Models\Game;
use App\Models\User;
use app\Notifications\TournamentCreatedNotification;
use App\Models\Image;
use App\Models\Tournament;
use Inertia\Inertia;
use Inertia\Response;

class TournamentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Tournaments/Index', ['status' => session('status'), 'games' => Game::all(), 'tournaments' => Tournament::all()]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        if (auth()->user()->can('create-tournaments')){
            return Inertia::render('Tournaments/Create', ['games' => Game::all()]);
        }
        abort(403);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if ($request->type == 'Single') {
            $winnable_type = "App\Models\User";
            $prize = $request->fee * 1.9;
        }
        else if ($request->type == "Team") {
            $winnable_type = "App\Models\Team";
            $prize = $request->fee * 9;
        }
        else {
            $winnable_type = "App\Models\RandomTournamentTeam";
            $prize = $request->fee * 3.6;
        }
        $pattern = '/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.\d+Z$/';
        if (preg_match($pattern, $request->date, $matches)) {
            $formattedDate = $matches[1] . '-' . $matches[2] . '-' . $matches[3] . ' ' . $matches[4] . ':' . $matches[5] . ':' . $matches[6];
        }
        $tournament = Tournament::create([
            'name' => $request->name,
            'game_id' => $request->game,
            'date' => $formattedDate,
            'hour' => $request->hour,
            'participation_fee' => $request->fee,
            'type' => $request->type,
            'winnable_id' => 0,
            'admin_id' => auth()->user()->id,
            'prize' => $prize,
            'winnable_type' => $winnable_type,
            'is_recurrent' => $request->recurrent,
        ]);
        //for pusher
        event(new TournamentCreated($tournament));
        return back()->with('message', 'Turneul a fost creat cu succes!');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $tournament = Tournament::where('id', $id)->first();
        $messages = Message::where('tournament_id', $id)
            ->with('user')
            ->oldest()
            ->get();
        return Inertia::render('Tournaments/Show', [
            'status' => session('status'),
            'tournament' => $tournament,
            'messages' => $messages
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }
    public function message(Request $request, $id)
    {
        $tournament = Tournament::where('id', $id)->first();
        $message = $tournament->messages()->create([
            'body' => $request->body,
            'user_id' => auth()->id()
        ]);
        broadcast(new NewChatMessageEvent($message, auth()->user()))->toOthers();
        return back();
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
}
