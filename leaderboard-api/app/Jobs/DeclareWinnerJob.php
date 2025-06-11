<?php

namespace App\Jobs;

use App\Models\User;
use App\Models\Winner;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class DeclareWinnerJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle()
    {
        $maxPoints = User::max('points');
        
        if ($maxPoints === null) {
            return;
        }

        $topUsers = User::where('points', $maxPoints)->get();

        if ($topUsers->count() === 1) {
            $winner = $topUsers->first();
            
            Winner::create([
                'user_id' => $winner->id,
                'points_at_win' => $winner->points,
                'declared_at' => now()
            ]);
        }
    }
}
