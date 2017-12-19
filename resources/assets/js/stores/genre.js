/*eslint camelcase: ["error", {properties: "never"}]*/

import Vue from 'vue';
import { reduce, each, find, union, difference, take, filter, orderBy, pluck } from 'lodash';

import config from '../config';
import stub from '../stubs/genre';

const UNKNOWN_GENRE_ID = 1;

export const genreStore = {
  stub,
  cache: [],

  state: {
    genres: [],
  },

  /**
   * Init the store.
   *
   * @param  {Array.<Object>} genres The array of genres we got from the server.
   */
  init(genres) {
    this.all = genres;

    // Traverse through genre array to get the cover and number of songs for each.
    each(this.all, genre => this.setupGenre(genre))
  },

  /**
   * Set up the (reactive) properties of an genre.
   *
   * @param  {Object} genre
   */
  setupGenre(genre) {
    Vue.set(genre, 'playCount', 0)
    Vue.set(genre, 'songs', [])
    Vue.set(genre, 'fmtLength', 0)
    if (!genre.image) genre.image = config.unknownCover;

    this.cache[genre.id] = genre

    return genre
  },

  /**
   * Get all genres.
   *
   * @return {Array.<Object>}
   */
  get all() {
    return this.state.genres
  },

  /**
   * Set all genres.
   *
   * @param  {Array.<Object>} value
   */
  set all(value) {
    this.state.genres = value
  },

  /**
   * Get an genre object by its ID.
   *
   * @param  {Number} id
   */
  byId(id) {
    return this.cache[id]
  },

  /**
   * Adds an genre/genres into the current collection.
   *
   * @param  {Array.<Object>|Object} genres
   */
  add (genres) {
    genres = [].concat(genres);
    each(genres, genre => {
      this.setupGenre(genre)
      genre.playCount = reduce(genre.songs, (count, song) => count + song.playCount, 0)
    })

    this.all = union(this.all, genres);
  },

  purify () {
    this.compact()
  },

  /**
   * Remove empty genres from the store.
   */
  compact () {
    const emptyGenres = filter(this.all, genre => genre.songs.length === 0)
    if (!emptyGenres.length)
      return
    

    this.all = difference(this.all, emptyGenres)
    each(emptyGenres, genre => delete this.cache[genre.id])
  },

  /**
   * Get top n most-played genres.
   *
   * @param  {Number} n
   *
   * @return {Array.<Object>}
   */
  getMostPlayed (n = 6) {
    // Only non-unknown genres with actually play count are applicable.
    const applicable = filter(this.all, genre => {
      return genre.playCount && !this.isUnknownGenre(genre)
    })

    return take(orderBy(applicable, 'playCount', 'desc'), n)
  },

  /**
   * Checks if an genre is empty.
   *
   * @param  {Object}  genre
   *
   * @return {boolean}
   */
  isGenreEmpty(genre) {
    return !genre.songs.length;
  },

  /**
   * Determine if the genre is the special "Unknown Genre".
   *
   * @param  {Object}  genre [description]
   *
   * @return {Boolean}
   */
  isUnknownGenre(genre) {
    return genre.id === UNKNOWN_GENRE_ID;
  },

  /**
   * Get all songs for this genre.
   *
   * @param {Object} genre
   *
   * @return {Array.<Object>}
   */
  getSongsByGenre(genre) {
    return genre.songs;
  }
  
};
