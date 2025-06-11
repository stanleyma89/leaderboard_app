<?php

namespace Tests\Feature;

use App\Jobs\GenerateQRCodeJob;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    public function it_returns_paginated_users()
    {
        User::factory()->count(20)->create();

        $response = $this->getJson('/api/v1/users');

        $response->assertOk()
            ->assertJsonStructure(['data', 'links', 'meta']);
    }

    public function it_creates_a_user_and_dispatches_qr_job()
    {
        Queue::fake();

        $response = $this->postJson('/api/v1/users', [
            'name' => 'John Doe',
            'age' => 30,
            'address' => '123 Main St, Springfield',
            'points' => 10,
        ]); 

        $response->assertCreated()
             ->assertJsonFragment([
                 'name' => 'John Doe',
                 'age' => 30,
                 'address' => '123 Main St, Springfield',
                 'points' => 10,
             ]);

        $this->assertDatabaseHas('users', [
            'name' => 'John Doe',
            'age' => 30,
            'address' => '123 Main St, Springfield',
        ]);

        Queue::assertPushed(GenerateQRCodeJob::class);
    }

    public function it_shows_a_user_detail()
    {
        $user = User::factory()->create();

        $response = $this->getJson("/api/v1/users/{$user->id}");

        $response->assertOk()
                 ->assertJsonFragment(['id' => $user->id]);
    }

    public function it_increments_user_points()
    {
        $user = User::factory()->create(['points' => 5]);

        $response = $this->patchJson("/api/v1/users/{$user->id}/points/increment", [
            'points' => 10
        ]);

        $response->assertOk()
                 ->assertJsonFragment(['points' => 15]);
    }

    public function it_decrements_user_points_and_resets_below_zero()
    {
        $user = User::factory()->create(['points' => 3]);

        $response = $this->patchJson("/api/v1/users/{$user->id}/points/decrement", [
            'points' => 5
        ]);

        $response->assertOk()
                 ->assertJsonFragment(['points' => 0]);
    }

    public function it_deletes_a_user()
    {
        $user = User::factory()->create();

        $response = $this->deleteJson("/api/v1/users/{$user->id}");

        $response->assertOk()
                 ->assertJson(['message' => 'User deleted successfully']);

        $this->assertSoftDeleted($user);
    }

    public function it_groups_users_by_score()
    {
        User::factory()->create(['name' => 'Alice', 'points' => 10, 'age' => 20]);
        User::factory()->create(['name' => 'Bob', 'points' => 10, 'age' => 30]);
        User::factory()->create(['name' => 'Eve', 'points' => 5, 'age' => 25]);

        $response = $this->getJson('/api/v1/users-grouped-by-score');

        $response->assertOk()
                 ->assertJsonFragment([
                     'names' => ['Alice', 'Bob'],
                     'average_age' => 25.0
                 ])
                 ->assertJsonFragment([
                     'names' => ['Eve'],
                     'average_age' => 25.0
                 ]);
    }
}
