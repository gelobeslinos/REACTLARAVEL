<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    public function index() {
        return Project::where('user_id', Auth::id())->get();
    }

    public function store(Request $request) {
        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'status' => 'required|in:pending,in progress,completed'
        ]);

        $project = Project::create([
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status,
            'user_id' => Auth::id()
        ]);

        return response()->json($project, 201);
    }

    public function update(Request $request, Project $project) {
        if ($project->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'status' => 'required|in:pending,in progress,completed'
        ]);

        $project->update([
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status
        ]);
        return response()->json($project);
    }

    public function destroy(Project $project) {
        if ($project->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $project->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
