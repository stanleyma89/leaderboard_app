<?php

namespace App\Console;

use App\Jobs\DeclareWinnerJob;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        Commands\ResetUserScores::class,
    ];

    protected function schedule(Schedule $schedule)
    {
        $schedule->job(new DeclareWinnerJob())->everyMinute();
    }

    protected function commands()
    {
        $this->load(__DIR__.'/Commands');
        require base_path('routes/console.php');
    }
}
