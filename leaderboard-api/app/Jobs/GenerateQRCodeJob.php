<?php

namespace App\Jobs;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class GenerateQRCodeJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function handle()
    {
        try {
            $response = Http::get('https://api.qrserver.com/v1/create-qr-code/', [
                'size' => '200x200',
                'data' => $this->user->address,
                'format' => 'png'
            ]);

            if ($response->successful()) {
                $filename = 'qr_codes/user_' . $this->user->id . '_' . time() . '.png';
                Storage::disk('public')->put($filename, $response->body());
                $this->user->update(['qr_code_path' => $filename]);
            }
        } catch (\Exception $e) {
            Log::error('QR Code generation failed for user ' . $this->user->id . ': ' . $e->getMessage());
        }
    }
}
