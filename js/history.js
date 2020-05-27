class History {
  constructor(player) {
    this._trackList = new TrackList(player);
    $("#history").removeClass("close");

    doRequest({
      url: "/history",
      success: this._acceptHistory.bind(this)
    });
  }

  close() {
    this._trackList.close();
    $("#history").addClass("close");
  }

  _acceptHistory(response) {
    var tracks = [];
    response.forEach((item, i) => {
      tracks.push({
        favourite: item.favourite,
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
