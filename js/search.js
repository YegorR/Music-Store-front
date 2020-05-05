class SearchPage {
  constructor(query, type) {
    this._query = query;
    this._page = null;
    $("#search").removeClass("close");
    if (type == "albums") {
      this._type = "Albums";
      this._page = $("#search .albumSearchPage");
      this._searchAlbums();
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
