<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UserIndexRequest;
use App\Http\Requests\UpdateUserPointsRequest;
use App\Http\Resources\UserResource;
use App\Http\Resources\UserDetailResource;
use App\Jobs\GenerateQRCodeJob;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function index(UserIndexRequest $request)
    {
        $validated = $request->validated();

        $query = User::query();

        if (!empty($validated['search'])) {
            $query->search($validated['search']);
        }

        $sortBy = $validated['sort_by'] ?? 'points';
        $sortDirection = $validated['sort_direction'] ?? ($sortBy === 'points' ? 'desc' : 'asc');

        if ($sortBy === 'name') {
            $query->orderByName($sortDirection);
        } else {
            $query->orderByPoints($sortDirection);
        }

        $perPage = $validated['per_page'] ?? 15;

        $users = $query->paginate($perPage);

        return UserResource::collection($users);
    }

    public function store(StoreUserRequest $request)
    {
        $user = User::create($request->validated());
        GenerateQRCodeJob::dispatch($user);
        return new UserResource($user);
    }

    public function show(User $user)
    {
        return new UserDetailResource($user);
    }

    public function incrementPoints(UpdateUserPointsRequest $request, User $user)
    {
        $validated = $request->validated();
        $user->increment('points', $validated['points']);
        return new UserResource($user->fresh());
    }

    public function decrementPoints(UpdateUserPointsRequest $request, User $user)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($user, $validated) {
            $user->decrement('points', $validated['points']);
            if ($user->fresh()->points < 0) {
                $user->update(['points' => 0]);
            }
        });

        return new UserResource($user->fresh());
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    public function groupedByScore()
    {
        $users = User::all()->groupBy('points');
        $result = [];
        
        foreach ($users as $points => $userGroup) {
            $result[$points] = [
                'names' => $userGroup->pluck('name')->toArray(),
                'average_age' => round($userGroup->avg('age'), 1)
            ];
        }

        return response()->json($result);
    }
}
