<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $r)
    {
        $r->validate(['name' => 'required', 'email' => 'required|email|unique:users', 'password' => 'required|min:6']);
        $user = User::create(['name' => $r->name, 'email' => $r->email, 'password' => Hash::make($r->password)]);
        $token = JWTAuth::fromUser($user);
        return response()->json(['user' => $user, 'token' => $token]);
    }

    public function login(Request $r)
    {
        $credentials = $r->only('email', 'password');
        if (! $token = auth()->guard('api')->attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }
        return response()->json(['token' => $token, 'user' => auth()->guard('api')->user()]);
    }

    public function me()
    {
        return response()->json(auth()->guard('api')->user());
    }

    public function logout()
    {
        auth()->guard('api')->logout();
        return response()->json(['message' => 'Logged out']);
    }
}
