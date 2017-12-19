import { secondsToHis } from '@/utils'

export default {
  computed: {
    length () {
      return this.genre.songs.reduce((acc, song) => {
        return acc + song.length
      }, 0)
    },

    fmtLength () {
      return secondsToHis(this.length)
    }
  }
}
