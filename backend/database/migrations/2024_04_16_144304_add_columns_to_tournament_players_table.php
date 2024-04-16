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
        Schema::table('tournament_players', function (Blueprint $table) {
            $table->integer('fee_paid')->unsigned()->nullable()->after('final_score');
            $table->integer('amount_won')->unsigned()->nullable()->after('final_score');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tournament_players', function (Blueprint $table) {
            //
        });
    }
};
