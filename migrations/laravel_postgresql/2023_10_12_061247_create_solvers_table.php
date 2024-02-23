<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSolversTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('solvers', function (Blueprint $table) {
            $table->bigIncrements('solver_id');
            $table->unsignedBigInteger('user_id');
            $table->string('no_telp');
            $table->string('email');
            $table->string('foto')->nullable();
            $table->boolean('aktif')->default(1);
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
        Schema::dropIfExists('solvers');
    }
}