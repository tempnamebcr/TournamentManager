<?php

namespace App\Http\Controllers;

use App\Events\FriendRequestAcceptedEvent;
use App\Events\FriendRequestReceivedEvent;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class FriendController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        // $d = Team::whereHas('users', function ($query) {
        //     $query->where('user_id', auth()->user()->id);
        // })->get();
        // dd($d);
        return Inertia::render('Friends/Index', [
            'friends' => auth()->user()->friends(),
            'requests' => auth()->user()->pending_friend_requests(),
            'teams' => Team::whereHas('users', function ($query) {
                $query->where('user_id', auth()->user()->id);
            })->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User $user
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request) {
        $user = User::where("id", $request->id)->first();
        if (!$user) {
            return back()->withErrors(['message' => 'This user could not be found']);
        }
        auth()->user()->add_friend($user->id);
        event(new FriendRequestReceivedEvent($user));
        return back();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User $user
     * @return \Illuminate\Http\Response
     */
    public function accept(Request $request, $id) {
        $user = User::where('id', $id)->first();
        if (!$user) {
            return back()->withErrors(['message' => 'This user could not be found']);
        }
        auth()->user()->accept_friend($user->id);
        event(new FriendRequestAcceptedEvent($user));
        return back();
    }
    public function update(Request $request, $id) {

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\User $user
     * @return \Illuminate\Http\Response
     */
    public function delete($id) {
        $user = User::where('id', $id)->first();
        if (!$user) {
            return back()->withErrors(['message' => 'This user could not be found']);
        }
        auth()->user()->delete_friend($user->id);
        return back();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User $user
     * @return \Illuminate\Http\Response
     */
    public function deny($id) {
        $user = User::where('id', $id)->first();
        if (!$user) {
            return back()->withErrors(['message' => 'This user could not be found']);
        }
        auth()->user()->deny_friend($user->id);
        return back();
    }
}
