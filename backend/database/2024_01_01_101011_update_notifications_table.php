<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateNotificationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('notifications', function (Blueprint $table) {
            // Eliminați coloanele existente
            $table->dropForeign(['user_id']);
            $table->dropColumn(['id', 'user_id', 'content']);

            // Adăugați noile coloane
            $table->uuid('id')->primary();
            $table->morphs('notifiable');
            $table->string('type');
            $table->text('data');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('notifications', function (Blueprint $table) {
            // Întoarceți modificările efectuate în metoda up()
            $table->dropPrimary('notifications_id_primary');
            $table->dropColumn(['id', 'type', 'notifiable_id', 'notifiable_type', 'data', 'read_at', 'created_at', 'updated_at']);

            // Adăugați coloanele eliminare și restricții
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');
            $table->string('type');
            $table->string('content');
            $table->timestamps();
        });
    }
}
