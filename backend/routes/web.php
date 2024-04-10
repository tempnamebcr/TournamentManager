<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\TournamentController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\NotificationController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::resource('users', UserController::class);
Route::post('friends/deny/{id}', [FriendController::class, 'deny'])->name('friends.deny');
Route::post('friends/accept/{id}', [FriendController::class, 'accept'])->name('friends.accept');
Route::post('friends/delete/{id}', [FriendController::class, 'delete'])->name('friends.delete');
Route::resource('friends', FriendController::class);
Route::prefix('notifications')->name('notifications.')->group(function() {
    Route::post('/mark-one/{id}', [NotificationController::class, 'store'])->name('store');
    Route::get('/mark-all', [NotificationController::class, 'update'])->name('update');
    Route::get('/mark-delete/{id}', [NotificationController::class, 'destroy'])->name('destroy');
});
Route::post('notifications/markAsRead/{id}', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');
// Route::resource('notifications', NotificationController::class);
Route::resource('games', GameController::class);
Route::post('/tournaments/{id}/message', [TournamentController::class, 'message'])->name('tournaments.message');
Route::resource('tournaments', TournamentController::class);
Route::get('permissions/initial', [RoleController::class, 'initial'])->name('permissions.initial');
Route::resource('permissions', RoleController::class);

require __DIR__.'/auth.php';
