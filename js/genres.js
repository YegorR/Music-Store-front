class GenresList {
  constructor(trackId, trackName, albumId) {
    this._trackId = trackId;
    this._trackName = trackName;
    this._albumId = albumId;
    $("#genresList").removeClass("close");

    doRequest({
      url: "/track/" + trackId + "/genre",
      success: function(genres) {
        $("#genresList").html($.templates("#genresList-template").render({
          genres: genres,
          trackName: trackName,
          trackId: trackId,
          albumId: albumId
        }));
      }
    });
  }

  getId() {
    return "genresList";
  }

  close() {
    $("#genresList").addClass("close");
    $("#genresList").html("");
  }
}

class ReadGenre {
  constructor(id, genreInfo) {
    this._id = id;

    $("#genre").removeClass("close");
    doRequest({
      url: "/genre/" + id,
      success: function(genre) {
        $("#genre").html($.templates("#genre-template").render(genre));
        getImage("/genre/" + id + "/image", null, $("#genre img"));
      }
    });
  }

  close() {
    $("#genre").addClass("close");
    $("#genre").html("");
  }

  getId() {
    return "readGenre";
  }
}
