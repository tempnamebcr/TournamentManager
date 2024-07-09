<?php

namespace App\Http\Controllers\Admin;

use App\Events\ReportedEvent;
use App\Http\Controllers\Controller;
use App\Models\BannedPlayer;
use App\Models\Report;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = User::where("id", auth()->user()->id)->first();
        $friends = $user->friends_ids();
        $pendingFriendReq = $user->pending_friend_requests_ids();
        $search = request()->search;
        $friendsReqSent = $user->pending_friend_requests_sent();
        return Inertia::render('Users/Index', ['status' => session('status'), 'users' => User::where('username', 'like', "%%$search%%")->where('id', '!=', $user->id)->get(), 'friends' => $friends, 'reqSentTo' => $friendsReqSent, 'pending' => $pendingFriendReq]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }
    public function report($id)
    {
        Report::insert([
            'reason' => request()->reasonForReport,
            'user_id' => $id
        ]);
        $user = User::where('id', $id)->first();
        event(new ReportedEvent($user));
        return back()->with('message', 'User reported successfuly!');
    }
    public function numberOfReports($id)
    {
        return Report::where('user_id', $id)->get()->count();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
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
    public function ban(Request $request, $id)
    {
        BannedPlayer::create([
            'admin_id' => auth()->user()->id,
            'user_id' => $id,
            'reason' => '',
            'period' => Carbon::now()->addDays(7)
        ]);
    }
    public function isBanned($id)
    {
        $banned = BannedPlayer::where('user_id', $id)->latest()->first();
        if ($banned == null) {
            return response()->json(['banned' => false]);
        }

        return response()->json(['banned' => $banned->period > Carbon::now()]);
    }
    public function fetchBannedPlayers()
    {
        $banned = BannedPlayer::all();
        $banned_list = [];
        foreach($banned as $ban){
            if($ban->period > Carbon::now()){
                $banned_list[] = $ban->user_id;
            }
        }
        if ($banned == null) {
            return response()->json(['banned_players' => []]);
        }

        return response()->json(['banned_players' => $banned_list]);
    }
}
