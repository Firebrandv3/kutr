<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class EnsureGenreidNotNull extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // alter table songs change column `genre_id` `genre_id`int(10) unsigned NOT NULL DEFAULT 1
        // Return if the database driver is not MySQL.
        if (DB::getDriverName() !== 'mysql')
            return;
        DB::statement('ALTER TABLE songs CHANGE COLUMN genre_id genre_id int(10) unsigned NOT NULL DEFAULT 1');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
