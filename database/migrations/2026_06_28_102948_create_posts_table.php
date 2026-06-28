<?php

use App\Enums\PostStatus;
use App\Enums\PostType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('type')->default(PostType::Artikel->value);
            $table->string('cover_image')->nullable();
            $table->text('excerpt')->nullable();
            $table->longText('body');
            $table->string('status')->default(PostStatus::Draft->value);
            $table->timestamp('published_at')->nullable();
            $table->unsignedSmallInteger('reading_time')->default(1);
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
