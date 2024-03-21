<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Game;
use App\Models\Image;
use App\Helper\Reply;
use Inertia\Inertia;
use Inertia\Response;

class GameController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Games/Index', ['status' => session('status'), 'games' => Game::all()]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        if (auth()->user()->can('create-games')){
            return Inertia::render('Games/Create');
        }
        abort(403);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $game = Game::create([
            'name' => $request->name,
        ]);
        if ($request->hasFile('image')) {
            $image = $request->file('image')->getClientOriginalName();
            $path = $request->file('image')->storeAs('avatars', $image, 'public');
            $image = Image::create([
                'imageable_type' => "App\Models\Game",
                'imageable_id' => $game->id,
                'location' => $path,
            ]);
        }
        return back()->with('message', 'Jocul a fost creat cu succes!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //useful
        // return Inertia::render('Event', ['event' => $event])
        //     ->withViewData(['meta' => $event->meta]);
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
}
