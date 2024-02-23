<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTasksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table ->date('tgl_task');
            $table ->string('nama_pengaju')->nullable();
            $table ->string('nama_rs');
            $table ->longText('deskripsi')->nullable();
            $table ->boolean('status')->default(0)->nullable();
            $table ->string('nama_solver');
            $table ->string('bukti_solved')->nullable();
            $table ->string('file')->nullable();
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
        Schema::dropIfExists('tasks');
    }
}
