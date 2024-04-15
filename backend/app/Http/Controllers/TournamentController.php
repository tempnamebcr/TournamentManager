<?php

namespace App\Http\Controllers;

use App\Events\NewChatMessageEvent;
use App\Events\TournamentCreated;
use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Team;
use App\Models\TournamentTeam;
use Carbon\Carbon;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
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
        return Inertia::render('Tournaments/Index', ['status' => session('status'), 'games' => Game::all(), 'tournaments' => Tournament::all(), 'teams' =>auth()->user()->teams]);
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
        // dd(broadcast(new NewChatMessageEvent("dddddddddd", auth()->user()))->toOthers());
        $tournament = Tournament::where('id', $id)->first();
        if(request()->team_id != null){
            $team = Team::where('id', request()->team_id)->first();
            $tournament_team = TournamentTeam::where('tournament_id', $id)->first();
            if ($tournament_team==null){
                $tournament_team = TournamentTeam::create([
                    'tournament_id' => $tournament->id,
                    'first_team_id' => $team->id,
                    'second_team_id' => null,
                ]);
            }
            else{
                if ($tournament_team->second_team_id == null && request()->team_id != $tournament_team->first_team_id){
                    $tournament_team->update([
                        'second_team_id' => $team->id,
                    ]);
                }
            }
            $first_team = Team::where('id', $tournament_team->first_team_id)->first();
            $second_team = Team::where('id', $tournament_team->second_team_id)->first();
        }
        // dd($tournament->game);
        $messages = Message::where('tournament_id', $id)
            ->with('user')
            ->oldest()
            ->get();
        // $the = new PrivateChannel('tournament.1');
        // dd($the);
        $type = $tournament->type;
        return Inertia::render('Tournaments/'.$type, [
            'status' => session('status'),
            'tournament' => $tournament,
            'messages' => $messages,
            'game' => $tournament->game,
            'team' => $team ?? null,
            'firstTeam' => $first_team ?? null,
            'secondTeam' => $second_team ?? null,
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
        // event(new NewChatMessageEvent($message, auth()->user()));
        broadcast(new NewChatMessageEvent($message, auth()->user()));
        // $b = broadcast(new NewChatMessageEvent($message, auth()->user()));
        // dd($b);
        return back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }
    public function getCount(Request $request)
    {
        return $request->count;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
    public function startTournament(Request $request, $id)
    {
        $tournament = Tournament::where('id', $id)->first();
        $tournament->started = Carbon::now();

        //todo take the fee from the players

        // if ($tournament->type == "Random"){

        // }
        // if ($tournament->type == "Single"){

        // }
        // if ($tournament->type == "Team"){

        // }
        $tournament->save();
    }
    public function finishTournament(Request $request, $id){
        $tournament = Tournament::where("id", $id)->first();
    }
    public function uploadPhoto(Request $request, $id){
        $tournament = Tournament::where("id", $id)->first();
        if ($request->hasFile('image')) {
            $image = $request->file('image')->getClientOriginalName();
            $path = $request->file('image')->storeAs('tournaments', $image, 'public');
            $image = Image::create([
                'imageable_type' => "App\Models\Tournament",
                'imageable_id' => $tournament->id,
                'location' => $path,
            ]);
        }
        $tournament->ended = Carbon::now();
        $tournament->save();
        return response()->json(['message' => 'Imaginea a fost încărcată cu succes.']);
    }
    public function completedTournament(Request $request, $id){
        $tournament = Tournament::where("id", $id)->first();
        $users = $request->users;
        //todo daca nu esti admin sau nu s-a finalizat turneul, n-ai voie pe ruta

        return Inertia::render('Tournaments/Completed', ['tournament' => $tournament, 'users' => $users]);
    }
    public function givePrizes(Request $request, $id){
        $tournament = Tournament::where("id", $id)->first();

        //todo notifications, maybe on level up
    }
}
