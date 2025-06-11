<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class ResetUserScores extends Command
{
    protected $signature = 'app:reset-user-scores';
    protected $description = 'Reset all user scores to 0';

    public function handle()
    {
        $count = User::query()->update(['points' => 0]);
        $this->info("Successfully reset scores for {$count} users.");
        return 0;
    }
}
