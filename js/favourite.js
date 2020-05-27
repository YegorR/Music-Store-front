class Favourite {
  constructor(player) {
    this._trackList = new TrackList(player);
    $("#favourite").removeClass("close");

    doRequest({
      url: "/favourite",
      success: this._acceptFavourite.bind(this)
    });
  }

  close() {
    this._trackList.close();
    $("#favourite").addClass("close");
  }

  _acceptFavourite(response) {
    var tracks = [];
    response.forEach((item, i) => {
      tracks.push({
        favourite: true,
        track: item.name,
        trackId : item.id,
        plays: item.playsNumber,
        musician: item.musicianName,
        musicianId: item.musicianId,
        album: item.albumName,
        albumId: item.albumId
      });
    });
    this._trackList.showTracks(tracks);
  }
}
