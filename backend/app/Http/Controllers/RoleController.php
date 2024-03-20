<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function initial(){
        $admin_role = Role::create(['name' => 'admin']);
        $player_role = Role::create(['name' => 'player']);
        $player_permissions = [
            'view-tournaments',
            'view-games'
        ];
        $admin_permissions = [
            'create-games',
            'edit-games',
            'delete-games',
            'create-tournaments',
            'edit-tournaments',
            'delete-tournaments',
        ];

        foreach ($admin_permissions as $permission) {
            Permission::create(['name' => $permission]);
        }
        foreach ($player_permissions as $permission) {
            Permission::create(['name' => $permission]);
        }
        $admin_role->givePermissionTo($admin_permissions);
        $admin_role->givePermissionTo($player_permissions);
        $player_role->givePermissionTo($player_permissions);
        $players = User::where('isAdmin', false)->get();
        $admins = User::where('isAdmin', true)->get();
        foreach($admins as $admin){
            $admin->assignRole('admin');
        };
        foreach($players as $player){
            $player->assignRole('admin');
        };
    }
}
