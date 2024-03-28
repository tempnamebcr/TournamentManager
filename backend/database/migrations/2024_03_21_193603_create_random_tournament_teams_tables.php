<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table("tournaments", function (Blueprint $table) {
            if (!Schema::hasColumn('tournaments', 'hour')) {
                $table->string("hour")->after('date');
            }
            if (!Schema::hasColumn('tournaments', 'name')) {
                $table->string("name")->after('id');
            }
        });
        Schema::create('random_tournament_teams', function (Blueprint $table) {
            $table->unsignedBigInteger('first_user_id');
            $table->foreign('first_user_id')->references('id')->on('users');
            $table->unsignedBigInteger('second_user_id');
            $table->foreign('second_user_id')->references('id')->on('users');
            $table->unsignedBigInteger('tournament_id');
            $table->foreign('tournament_id')->references('id')->on('tournaments');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('random_tournament_teams', function (Blueprint $table) {
            $table->dropForeign(['first_user_id']);
            $table->dropForeign(['second_user_id']);
            $table->dropForeign(['tournament_id']);

            $table->dropColumn('first_user_id');
            $table->dropColumn('second_user_id');
            $table->dropColumn('tournament_id');
        });
        Schema::table("tournaments", function (Blueprint $table) {
            $table->dropColumn('hour');
            $table->dropColumn('name');
        });
    }
};
