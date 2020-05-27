class Album {
  constructor(id, player) {
    this._id = id;
    this._album = $("#album");
    this._album.removeClass("close");
    this._trackList = new TrackList(player);

    this._loadAlbum();
  }

  getHref() {
    return "album/" + this._id;
  }

  _loadAlbum() {
    var successFunction = this._acceptAlbumInformation.bind(this);
    doRequest({
      url: "/album/" + this._id,
      success: successFunction
    });
    getImage("/album/" + this._id + "/image", null, $("#album .cover"));
  }

  _acceptAlbumInformation(info) {
    if (info.single) {
      $("#album .type").text("Сингл");
    } else {
      $("#album .type").text("Альбом");
    }

    $("#album .name").text(info.name);
    $("#album .musician a").text(info.musician.name);
    $("#album .releaseDate").text(info.releaseDate.split("-")[2]);

    var tracks = [];
    info.tracks.forEach((item, i) => {
      let oneTrack = {
        track: item.name,
        trackId : item.id,
        plays: item.playsNumber,
        musician: info.musician.name,
        album: info.name,
        favourite: item.favourite
      };
      tracks.push(oneTrack);
    });
    this._trackList.showTracks(tracks);
  }

  close() {
    $("#album .cover").removeAttr("src");
    $("#album .type").html("");
    $("#album .name").html("");
    $("#album .musician a").html("");
    $("#album .musician a").removeAttr("href");
    $("#album .releaseDate").html("");
    this._trackList.close();
    this._album.addClass("close");
  }
}
