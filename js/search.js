class SearchPage {
  constructor(query, type) {
    this._query = query;
    this._page = null;
    $("#search").removeClass("close");
    if (type == "albums") {
      this._type = "Albums";
      this._page = $("#search .albumSearchPage");
      this._searchAlbums();
    } else if (type == "musicians") {
      this._type = "Musicians";
      this._page = $("#search .musicianSearchPage");
      this._searchMusicians();
    } else if (type == "tracks") {
      this._type = "Tracks";
      this._page = $("#search .trackSearchPage");
      this._searchTracks();
    } else if (type == "genres") {
      this._type = "Genres";
      this._page = $("#search .genreSearchPage");
      this._searchGenres();
    }
  }


  getId() {
    return "search" + this._type + "/" + this._query;
  }

  close() {
    if (this._page != null) {
      this._page.html("");
    }
    $("#search").addClass("close");
  }

  _searchAlbums() {
    var successFunction = this._getAlbums.bind(this);
    doRequest({
      url: "/albums?query=" + this._query,
      success: successFunction
    });
  }

  _getAlbums(result) {
    var albums = [];
    result.forEach((item, i) => {
      let album = {
        id: item.id,
        single: item.single,
        album: item.name,
        musician: item.musician.name,
        musicianId: item.musician.id,
        index: i
      };
      albums.push(album);
    });

    this._page.html($.templates("#albumSearchPage-template").render({
      query: this._query,
      count: albums.length,
      albums: albums
    }));

    albums.forEach((item, i) => {
      getImage("/album/" + item.id + "/image", null, $("#searchAlbumCover" + i));
    });
  }

  _searchMusicians() {
    doRequest({
      url: "/musicians?query=" + this._query,
      success: this._getMusicians.bind(this)
    });
  }

  _getMusicians(result) {
    var musicians = [];
    result.forEach((item, i) => {
      let musician = {
        id: item.id,
        name: item.name,
        index: i
      };
      musicians.push(musician);
    });

    this._page.html($.templates("#musicianSearchPage-template").render({
      query: this._query,
      count: musicians.length,
      musicians: musicians
    }));

    musicians.forEach((item, i) => {
      getImage("/musician/" + item.id + "/image", null, $("#searchMusicianImage" + i));
    });
  }

  _searchTracks() {
    doRequest({
      url: "/tracks?query=" + this._query,
      success: this._getTracks.bind(this)
    });
  }

  _getTracks(result) {
    var tracks = result;
    tracks.forEach((item, i) => {
      item.index = i;
    });

    this._page.html($.templates("#trackSearchPage-template").render({
      query: this._query,
      count: tracks.length,
      tracks: tracks
    }));

    tracks.forEach((item, i) => {
      getImage("/album/" + item.albumId + "/image", null, $("#searchTrackCover" + i));
    });
  }

  _searchGenres() {
    doRequest({
      url: "/genres?query=" + this._query,
      success: this._getGenres.bind(this)
    });
  }

  _getGenres(result) {
    var genres = [];
    result.forEach((item, i) => {
      let genre = {
        id: item.id,
        name: item.name,
        index: i
      };
      genres.push(genre);
    });

    this._page.html($.templates("#genreSearchPage-template").render({
      query: this._query,
      count: genres.length,
      genres: genres
    }));

    genres.forEach((item, i) => {
      getImage("/genre/" + item.id + "/image", null, $("#searchGenreImage" + i));
    });
  }

}


class SearchString {
  constructor(searchHandler) {
    this._searchHandler = searchHandler;
    $("#searchString input").keypress(this._onPressEnter.bind(this));
  }

  _onPressEnter(e) {
    if (e.which != 13) return;

    var query = $("#searchString input").val().trim();
    var type = $("#searchString select").val();
    $("#searchString input").val("");

    if (!query) return;
    if (!type) return;

    this._searchHandler(query, type);
  }

}
