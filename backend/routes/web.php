<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\TournamentController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\NotificationController;
use App\Models\Tournament;
use App\Models\TournamentPlayer;
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
    $data = [
        $amount_won = TournamentPlayer::where('user_id', auth()->user()->id)->sum('amount_won'),
        $fee_paid = TournamentPlayer::where('user_id', auth()->user()->id)->sum('fee_paid'),
        $tournamentIds = TournamentPlayer::with('tournament')->where('user_id', auth()->user()->id)->orderBy('id', 'desc')->get(),
        $stats = TournamentPlayer::where('user_id', auth()->user()->id)->get('final_score'),
        // $tournamentIds = TournamentPlayer::where('user_id', auth()->user()->id)->pluck('tournament_id'),
        // $tournaments = Tournament::whereIn('id', $tournamentIds)->get(),

    ];
    return Inertia::render('Dashboard', ['data' => $data]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::post('users/ban/{id}', [UserController::class, 'ban'])->name('users.ban');
Route::get('users/{id}/is-banned', [UserController::class, 'isBanned'])->name('users.is-banned');
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
Route::post('/tournaments/{id}/startTournament', [TournamentController::class, 'startTournament'])->name('tournaments.startTournament');
Route::post('/tournaments/{id}/finishTournament', [TournamentController::class, 'finishTournament'])->name('tournaments.finishTournament');
Route::get('/tournaments/{id}/completedTournament', [TournamentController::class, 'completedTournament'])->name('tournaments.completedTournament');
Route::post('/tournaments/{id}/uploadPhoto', [TournamentController::class, 'uploadPhoto'])->name('tournaments.uploadPhoto');
Route::post('/tournaments/{id}/getCount', [TournamentController::class, 'getCount'])->name('tournaments.getCount');
Route::post('/tournaments/{id}/givePrizes', [TournamentController::class, 'givePrizes'])->name('tournaments.givePrizes');
Route::resource('tournaments', TournamentController::class);
Route::get('permissions/initial', [RoleController::class, 'initial'])->name('permissions.initial');
Route::resource('permissions', RoleController::class);
Route::post('teams/addPlayer', [TeamController::class, 'addPlayer'])->name('teams.addPlayer');
Route::resource('teams', TeamController::class);

require __DIR__.'/auth.php';
