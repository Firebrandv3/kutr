<?php

namespace App\Http\Controllers\API;

use App\Http\Requests\API\SettingRequest;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class SettingController extends Controller
{
    /**
     * Save the application settings.
     *
     * @param SettingRequest $request
     *
     * @return JsonResponse
     */
    public function store(SettingRequest $request)
    {
        // For right now there's only one setting to be saved
        Setting::set('media_path', rtrim(trim($request->media_path), '/'));

        // Changing the settings does not force scanning the library anymore
        return response()->json();
    }
}
