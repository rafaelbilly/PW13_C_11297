<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Contents;
use App\Models\User;
use App\Models\Komentars;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class KomentarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $komentars = Komentars::all();

        if (count($komentars) > 0) {
            return response([
                'message' => 'All Komentar Retrieved',
                'data' => $komentars
            ], 200);
        }

        return response([
            'message' => 'Komentar not found',
            'data' => null
        ], 400);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function showKomentarsbyContent($id)
    {
        $content = Contents::find($id);
        if (!$content) {
            return response([
                'message' => 'Content Not Found',
                'data' => null
            ], 404);
        }

        $komentars = Komentars::where('id_content', $content->id)->get();
        return response([
            'message' => 'Comments of ' . $content->title . ' Retrieved',
            'data' => $komentars
        ], 200);
    }

    public function store(Request $request)
    {
        $storeData = $request->all();
        $storeData['date_added'] = now()->format('Y-m-d H:i:s');

        $validate = Validator::make($storeData, [
            'comment' => 'required',
            'date_added' => 'date',
            'id_content' => 'required|exists:contents,id',
        ]);

        if ($validate->fails()) {
            return response(['message' => $validate->errors()], 400);
        }

        $user = Auth::user();

        if (is_null($user)) {
            return response(['message' => 'User Not Authenticated'], 401);
        }

        $storeData['id_user'] = $user->id;

        $id_content = $storeData['id_content'];
        $content = Contents::find($id_content);

        if (is_null($content)) {
            return response([
                'message' => 'Content Not Found'
            ], 404);
        }

        $storeData['id_content'] = $content->id;

        $komentar = Komentars::create($storeData);

        return response([
            'message' => 'Komentar Added Successfully',
            'data' => $komentar,
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $komentars = Komentars::find($id);

        if ($komentars) {
            return response([
                'message' => 'Komentar Found',
                'data' => $komentars
            ], 200);
        }

        return response([
            'message' => 'Komentar Not Found',
            'data' => null
        ], 404);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $komentar= Komentars::find($id);
        if (is_null($komentar)) {
            return response([
                'message' => 'Komentar Not Found',
                'data' => null
            ], 404);
        }

        $updateData = $request->all();

        $validate = Validator::make($updateData, [
            'comment' => 'required',
            'id_content' => 'exists:contents,id',
        ]);

        if ($validate->fails()) {
            return response(['message' => $validate->errors()], 400);
        }

        $user = Auth::user();

        if (is_null($user)) {
            return response(['message' => 'User Not Authenticated'], 401);
        }

        $id_content = $updateData['id_content'];
        $content = Contents::find($id_content);

        if (is_null($content)) {
            return response([
                'message' => 'Content Not Found'
            ], 404);
        }

        $komentar->update($updateData);

        return response([
            'message' => 'Komentar Updated Successfully',
            'data' => $komentar,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $komentars = Komentars::find($id);

        if (is_null($komentars)) {
            return response([
                'message' => 'Komentar Not Found',
                'data' => null
            ], 404);
        }

        if ($komentars->delete()) {
            return response([
                'message' => 'Komentar Deleted Successfully',
                'data' => $komentars,
            ], 200);
        }

        return response([
            'message' => 'Delete Komentar Failed',
            'data' => null,
        ], 400);
    }
}
