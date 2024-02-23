<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLaporanTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('laporan', function (Blueprint $table) {
            $table->bigINcrements('laporan_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('solver_id')->nullable();
            $table->string('no_wa');
            $table->date('tanggal');
            $table->string('nama_pengaju');
            $table->unsignedBigInteger('unit_id');
            $table->boolean('aktif')->default(1);
            $table->longText('deskripsi');
            $table->longText('deskripsi_solver')->nullable();
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
        Schema::dropIfExists('laporan');
    }
}
