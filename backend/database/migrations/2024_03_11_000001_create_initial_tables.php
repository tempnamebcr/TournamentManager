<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->after('password')->default('')->unique();
            $table->string('level')->after('username')->default('1');
            $table->integer('currency')->after('level')->default('100');
            $table->boolean('isAdmin')->after('currency')->default(false);
            $table->string('experience')->after('isAdmin')->default(0);
        });
        Schema::create('images', function (Blueprint $table) {
            $table->id();
            $table->morphs('imageable');
            $table->text('location');
            $table->timestamps();
        });
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });
        Schema::create('tournaments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('game_id');
            $table->foreign('game_id')->references('id')->on('games');
            $table->date('date');
            $table->integer('prize');
            $table->integer('participation_fee');
            $table->string('type');
            $table->morphs('winnable');
            $table->unsignedBigInteger('admin_id');
            $table->foreign('admin_id')->references('id')->on('users');
            $table->boolean('is_recurrent');
            $table->timestamps();
        });
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');
            $table->string('type');
            $table->string('content');
            $table->timestamps();
        });
        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('games_won');
            $table->timestamps();
        });
        Schema::create('banned_players', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('admin_id');
            $table->foreign('admin_id')->references('id')->on('users');
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');
            $table->string('reason');
            $table->date('period');
            $table->timestamps();
        });
        Schema::create('team_players', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('team_id');
            $table->foreign('team_id')->references('id')->on('teams');
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');
        });
        Schema::create('player_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');
            $table->integer('number_of_wins');
            $table->integer('number_of_losses');
            $table->integer('amount_won');
            $table->integer('amount_lost');
            $table->string('average_score');
        });
        Schema::create('tournament_players', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');
            $table->unsignedBigInteger('tournament_id');
            $table->foreign('tournament_id')->references('id')->on('tournaments');
            $table->string('final_score');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('images');

        Schema::table('tournament_players', function (Blueprint $table) {
            $table->dropForeign(['tournament_id', 'user_id']);
        });
        Schema::table('player_details', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });
        Schema::table('tournaments', function (Blueprint $table) {
            $table->dropForeign(['game_id', 'admin_id']);
        });
        Schema::table('banned_players', function (Blueprint $table) {
            $table->dropForeign(['admin_id', 'user_id']);
        });
        Schema::table('notifications', function (Blueprint $table) {
            $table->dropForeign([ 'user_id']);
        });
        Schema::table('team_players', function (Blueprint $table) {
            $table->dropForeign(['team_id', 'user_id']);
        });

        Schema::dropIfExists('games');

        Schema::dropIfExists('tournaments');

        Schema::dropIfExists('notifications');

        Schema::dropIfExists('team');

        Schema::dropIfExists('banned_players');

        Schema::dropIfExists('team_players');

        Schema::dropIfExists('player_details');

        Schema::dropIfExists('tournament_players');
    }
};
