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
use App\Models\User;
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
    $maxUserKDA = DB::table('tournament_players')
    ->select('user_id', DB::raw('GROUP_CONCAT(final_score) as final_scores'))
    ->groupBy('user_id')
    ->get();
    $max = 0;
    $max_user_id = null;
    $max_user_score = null;
    foreach($maxUserKDA as $user){
        $scoresArray = explode(',', $user->final_scores);
        $k = 0;
        $d = 0;
        $a = 0;
        foreach ($scoresArray as $scoreSet) {
            list($kills, $deaths, $assists) = explode('/', $scoreSet);
            $k+=$kills;
            $d+=$deaths;
            $a+=$assists;
        }
        $kda = ($k+$a)/max(1, $d);
        $scores_number = count($scoresArray);
        if ($kda > $max){
            $max = $kda;
            $max_user_id = $user->user_id;
            $max_user_score = ''. $k/$scores_number . '/' . $d/$scores_number . '/'. $a/$scores_number;
        }
    }
    $usr = User::where('id', $max_user_id)->first();
    $max_user = $usr->username;
    //max amount won
    $max_amount_won = DB::table('tournament_players')
    ->select('user_id', DB::raw('MAX(amount_won) as max_amount_won'))
    ->groupBy('user_id')
    ->get();
    $max_am = 0;
    $max_am_user_name= '';
    foreach($max_amount_won as $maw){
        if ($maw->max_amount_won > $max_am){
            $max_am = $maw->max_amount_won;
            $max_am = $maw->max_amount_won;
            $max_am_user_name = User::where('id', $maw->user_id)->first()->username;
        }
    }
    //most wins :
    $most_wins = DB::table('tournament_players')
            ->select('user_id', DB::raw('COUNT(*) as total_rows'))
            ->where('amount_won', '!=', 0)
            ->groupBy('user_id')
            ->orderByDesc('total_rows')
            ->get();
    $most_wins_username = User::where('id', $most_wins[0]->user_id)->first()->username;
    $no_of_wins = $most_wins[0]->total_rows;

    $authenticated_user_wins = TournamentPlayer::where('user_id', auth()->user()->id)->where('amount_won', '>', 0 )->count();
    $data = [
        $amount_won = TournamentPlayer::where('user_id', auth()->user()->id)->sum('amount_won'),
        $fee_paid = TournamentPlayer::where('user_id', auth()->user()->id)->sum('fee_paid'),
        $tournamentIds = TournamentPlayer::with('tournament')->where('user_id', auth()->user()->id)->orderBy('id', 'desc')->get(),
        $stats = TournamentPlayer::where('user_id', auth()->user()->id)->get('final_score'),
        $currency = auth()->user()->currency,
        $max, //max kda
        $max_user, //username for guy with max kda
        $max_user_score, //note for future self this code is a crime against humanity, dar e seara si esti obosit
        $max_am,
        $max_am_user_name,
        $no_of_wins,
        $most_wins_username,
        $authenticated_user_wins

    ];
    return Inertia::render('Dashboard', ['data' => $data]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::post('users/ban/{id}', [UserController::class, 'ban'])->name('users.ban');
Route::get('users/report/{id}', [UserController::class, 'report'])->name('users.report');
Route::get('users/numberOfReports/{id}', [UserController::class, 'numberOfReports'])->name('users.numberOfReports');
Route::get('users/{id}/is-banned', [UserController::class, 'isBanned'])->name('users.is-banned');
Route::get('users/fetch-banned', [UserController::class, 'fetchBannedPlayers'])->name('users.fetch-banned');
Route::resource('users', UserController::class);
Route::post('friends/deny/{id}', [FriendController::class, 'deny'])->name('friends.deny');
Route::post('friends/accept/{id}', [FriendController::class, 'accept'])->name('friends.accept');
Route::post('friends/delete/{id}', [FriendController::class, 'delete'])->name('friends.delete');
Route::resource('friends', FriendController::class);
Route::prefix('notifications')->name('notifications.')->group(function() {
    Route::get('/mark-one/{id}', [NotificationController::class, 'store'])->name('store');
    Route::get('/mark-all', [NotificationController::class, 'update'])->name('update');
    Route::get('/mark-delete/{id}', [NotificationController::class, 'destroy'])->name('destroy');
});
Route::get('notifications/markAsRead/{id}', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');
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
Route::get('/teams/{id}/seeMembers', [TeamController::class, 'seeMembers'])->name('teams.seeMembers');
Route::resource('teams', TeamController::class);

require __DIR__.'/auth.php';
