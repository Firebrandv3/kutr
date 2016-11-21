<?php

namespace App\Services;

use App\Models\Album;
use App\Models\Artist;
use App\Models\Song;
use App\Models\Genre;
use Cache;

class MediaCache
{
    protected $keyName = 'media_cache';

    /**
     * Get media data.
     * If caching is enabled, the data will be retrieved from the cache.
     *
     * @return array
     */
    public function get()
    {
        if (!config('koel.cache_media')) {
            return $this->query();
        }

        return Cache::rememberForever($this->keyName, function () {
            return $this->query();
        });
    }

    /**
     * Query fresh data from the database.
     *
     * @return array
     */
    private function query()
    {
        //TODO move this in Model\Genre and not here!
        $genres = Genre::orderBy('name')->with('songs')->get()->toArray();

        // We don't need full song data either here, only ID's
        foreach ($genres as &$genre) {
            $genre['songs'] = array_pluck($genre['songs'], 'id');
        }
        return [
            'albums' => Album::orderBy('name')->get(),
            'artists' => Artist::orderBy('name')->get(),
            'genres' => $genres,
            'songs' => Song::all(),
        ];
    }

    /**
     * Clear the media cache.
     */
    public function clear()
    {
        Cache::forget($this->keyName);
    }
}
