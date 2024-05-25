<?php

namespace App\Http\Controllers;

use App\Events\NewChatMessageEvent;
use App\Events\TournamentCreated;
use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\RandomTournamentTeam;
use App\Models\Team;
use App\Models\TournamentPlayer;
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
        $search = request()->search;
        $orderBy = request()->orderBy;
        $tournaments = Tournament::where(function ($query) use ($search) {
            $query->where('name', 'like', "%$search%")
                  ->orWhere('type', 'like', "%$search%");
        })
        ->orWhereHas('game', function ($query) use ($search) {
            $query->where('name', 'like', "%$search%");
        })
        ->orderBy($orderBy == '' ? 'created_at' : $orderBy , 'desc')
        ->get();
        return Inertia::render('Tournaments/Index', ['status' => session('status'), 'games' => Game::all(), 'tournaments' => $tournaments, 'teams' =>auth()->user()->teams]);
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
            $prize = $request->fee * 3.6;
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
        if ($tournament->winnable_id != 0){
            $winners = TournamentPlayer::join('users', 'tournament_players.user_id', '=', 'users.id')->where('tournament_id', $tournament->id)->where('tournament_players.amount_won', '!=', 0)->get();
            return back()->with('message', $winners);
        }
        if(auth()->user()->currency < $tournament->participation_fee){
            return back()->with('message', 'Nu aveti destul currency pentru a intra in turneu');
        }
        if(request()->team_id != null){
            $team = Team::where('id', request()->team_id)->first();
            $tournament_team = TournamentTeam::where('tournament_id', $id)->first();
            if ($tournament_team==null){
                $tournament_team = TournamentTeam::create([
                    'tournament_id' => $tournament->id,
                    'first_team_id' => $team->id,
                    'second_team_id' => null,
                    'first_user_id' => auth()->user()->id,
                    'second_user_id' => null,
                    'third_user_id' => null,
                    'fourth_user_id' => null,
                ]);
            }
            else if ($tournament_team->second_team_id == null && request()->team_id != $tournament_team->first_team_id){
                $tournament_team->update([
                    'second_team_id' => $team->id,
                    'third_user_id' => auth()->user()->id
                ]);
            }
            else if ($tournament_team->first_team_id != null && request()->team_id == $tournament_team->first_team_id && $tournament->second_user_id == null){
                $tournament_team->update([
                    'second_user_id' => auth()->user()->id
                ]);
            }
            else if ($tournament_team->second_team_id != null && request()->team_id == $tournament_team->second_team_id && $tournament->fourth_user_id == null){
                $tournament_team->update([
                    'fourth_user_id' => auth()->user()->id
                ]);
            }
            $first_team = Team::where('id', $tournament_team->first_team_id)->first();
            $second_team = Team::where('id', $tournament_team->second_team_id)->first();
            $current_tournament_teams = $tournament_team;
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
            'currentTournamentTeam' => $current_tournament_teams ?? null
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $tournament = Tournament::where('id', $id)->first();
        $games = Game::all();
        return Inertia::render('Tournaments/Edit', [
            'status' => session('status'),
            'tournament' => $tournament,
            'games' => $games,
        ]);
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
        if ($request->type == 'Single') {
            $winnable_type = "App\Models\User";
            $prize = $request->fee * 1.9;
        }
        else if ($request->type == "Team") {
            $winnable_type = "App\Models\Team";
            $prize = $request->fee * 3.6;
        }
        else {
            $winnable_type = "App\Models\RandomTournamentTeam";
            $prize = $request->fee * 3.6;
        }
        $pattern = '/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.\d+Z$/';
        if (preg_match($pattern, $request->date, $matches)) {
            $formattedDate = $matches[1] . '-' . $matches[2] . '-' . $matches[3] . ' ' . $matches[4] . ':' . $matches[5] . ':' . $matches[6];
        }
        $tournament = Tournament::where('id', $request->tournament)->first();
        $tournament->update([
            'name' => $request->name,
            'game_id' => $request->game,
            'date' => preg_match($pattern, $request->date, $matches) ? $formattedDate : $tournament->date,
            'hour' => $request->hour,
            'participation_fee' => $request->fee,
            'type' => $request->type,
            'winnable_id' => 0,
            'admin_id' => auth()->user()->id,
            'prize' => $prize,
            'winnable_type' => $winnable_type,
            'is_recurrent' => $request->is_recurrent,
        ]);
        return back()->with('message', 'Turneul a fost editat cu succes!');
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
        if (auth()->user()->can('delete-tournaments')){
            $tournament = Tournament::where('id', $id)->first();
            $tournamentTeam = TournamentTeam::where('tournament_id', $tournament->id)->first();
            if($tournamentTeam == null){
                $tournament->delete();
                return back()->with('message', 'Turneu sters cu success');
            }
            else {
                return back()->with('message', 'Nu poti sterge turneul deoarece a inceput sau are echipe inscrise');
            }
        }
    }
    public function startTournament(Request $request, $id)
    {
        $tournament = Tournament::where('id', $id)->first();
        $tournament->started = Carbon::now();
        // dd($request);
        $users = $request->users;
        //todo take the fee from the players

        if ($tournament->type == "Random"){
            RandomTournamentTeam::create(
                [
                    "tournament_id"=> $tournament->id,
                    "first_user_id" => 0,
                    "second_user_id" => 0,
                ]
            );
            RandomTournamentTeam::create(
                [
                    "tournament_id"=> $tournament->id,
                    "first_user_id" => 0,
                    "second_user_id" => 0,
                ]
            );
        }
        // if ($tournament->type == "Single"){

        // }
        // if ($tournament->type == "Team"){

        // }
        $tournament->save();
        broadcast(new NewChatMessageEvent($tournament->id, auth()->user()));
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
            $tournament->ended = Carbon::now();
            $tournament->save();
            return redirect()->back()->with('message', 'Imaginea a fost incarcata cu success.');
        }
        return redirect()->back()->with('message', 'Incarcati o imagine.');
    }
    public function completedTournament(Request $request, $id){
        $tournament = Tournament::where("id", $id)->first();
        $users = $request->users;
        $teams = null;
        $random_teams =  null;
        if ($tournament->type=="Random"){
            $random_teams = RandomTournamentTeam::where("tournament_id", $tournament->id)->get();
        }
        if($tournament->type=="Team"){
            $tournament_teams = TournamentTeam::where("tournament_id", $tournament->id)->first();
            $teams = [];
            $first_team = Team::where("id", $tournament_teams->first_team_id)->first();
            $second_team = Team::where("id", $tournament_teams->second_team_id)->first();
            array_push($teams, $first_team);
            array_push($teams, $second_team);
        }
        //todo daca nu esti admin sau nu s-a finalizat turneul, n-ai voie pe ruta
        return Inertia::render('Tournaments/Completed', ['tournament' => $tournament, 'users' => $users, 'teams'=>$teams, 'random_teams'=>$random_teams]);
    }
    public function givePrizes(Request $request, $id){
        $users = $request->users;
        $tournament = Tournament::where("id", $id)->first();

        $tournament->winnable_id = intval($request->winner);
        $tournament->save();
        $array_of_winners = [];
        if($tournament->type=="Single"){
            array_push($array_of_winners, intval($request->winner));
        }
        if ($tournament->type == "Random"){
            // sa fie creata random team si sa fie pusa ea ca winner
            $random_team = RandomTournamentTeam::where('id', intval($request->winner))->first();
            $first_user = User::where('id', $random_team->first_user_id)->first();
            $second_user = User::where('id', $random_team->second_user_id)->first();
            array_push($array_of_winners, $first_user->id);
            array_push($array_of_winners, $second_user->id);
        }
        if ($tournament->type == "Team"){
            // winner sa fie echipa; poate sa fac un select multiplu cu winner ids?
            $team = Team::where("id", intval($request->winner))->first();
            $team->games_won ++ ;
            $team->save();
            $tournament_team = TournamentTeam::where("tournament_id", $tournament->id)->first();
            if(intval($request->winner) == $tournament_team->first_team_id){
                array_push($array_of_winners, $tournament_team->first_user_id);
                array_push($array_of_winners, $tournament_team->second_user_id);
            }
            else {
                array_push($array_of_winners, $tournament_team->third_user_id);
                array_push($array_of_winners, $tournament_team->fourth_user_id);
            }
        }
        foreach( $users as $usr){
            TournamentPlayer::create(
                [
                    'user_id'=> intval($usr['id']),
                    'tournament_id' => $tournament->id,
                    'final_score' => $usr['value'],
                    'fee_paid' => $tournament->participation_fee,
                    'amount_won' => intval($usr['id']) == intval($request->winner) ? $tournament->prize : 0
                ]
            );
            $user = User::where('id', $usr['id'])->first();
            //todo calculate experience, lv up and all
            $user->currency-=$tournament->participation_fee;
            if($user->id == $request->winner){
                $user->experience+= 100;
                $user->currency+=$tournament->prize;
            }
            $user->experience+=100;
            if ($user->experience >= 500){
                $user->experience = 50;
                $user->level +=1;
                //event new lvl up
            }
            $user->save();
        }
        return Inertia::render('Dashboard');
        //todo notifications, maybe on level up
    }
}
