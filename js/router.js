class NullPage {
  constructor() {}

  close() {}

  getId() {
    return "nullpage";
  }
}


class Router {
  static instance = null;
  static player = null;

  static setPlayer(player) {
    this.player = player;
  }

  static getInstance() {
    if (this.instance === null) {
      this.instance = new Router(this.player);
    }
    return this.instance;
  }

  constructor(player, page) {
    this._player = player;
    if ((typeof page != "undefined")&&(page !== null)) {
      this._page = page;
    } else {
      this._page = new NullPage();
    }

    if ($("#searchString").length == 1) {
      this._searchString = new SearchString(this._handleSearch.bind(this));
    }
    let handleFunction = this._handle.bind(this);
    $(document).on("click", "a", handleFunction);
    $(document).on("click", "button", handleFunction);
  }

  _handleSearch(query, type) {
    this._page.close();
    this._page = new SearchPage(query, type);
  }

  gotoHref(href) {
    href = href.split("#")[1].trim();
    //if (this._page.getId() == href) return;

    if (href.startsWith("album/")) {
      var id = parseInt(href.split("album/")[1]);
      if (id == NaN) return;
      this._gotoAlbum(id); return;
    }

    if (href.startsWith("medialibrary/")) {
      this._gotoMedialibrary(href);
      return;
    }

    if (href.startsWith("favourite")) {
      this._gotoFavourite(); return;
    }
    if (href.startsWith("history")) {
      this._gotoHistory(); return;
    }
    if (href.startsWith("musician/")) {
      var id = parseInt(href.split("musician/")[1]);
      if (id == NaN) return;
      this._gotoMusician(id); return;
    }
    if (href.startsWith("genresList/")) {
      var infoForGenres = JSON.parse(href.split("genresList/")[1]);
      this._gotoGenresList(infoForGenres); return;
    }
    if (href.startsWith("genres")) {
      this._gotoGenres(); return;
    }

    if (href.startsWith("createGenre")) {
      this._gotoCreateGenre(); return;
    }

    if (href.startsWith("genre/")) {
      var id = parseInt(href.split("genre/")[1]);
      if (isNaN(id)) {
        if (!href.startsWith("genre/json/")) return;
        var genre = JSON.parse(href.split("genre/json/")[1]);
        this._gotoGenre(genre.id, genre); return;
      } else {
        this._gotoGenre(id, null);
        return;
      }
    }
    if (href.startsWith("editGenre/")) {
      var genre = JSON.parse(href.split("editGenre/")[1]);
      this._gotoEditGenre(genre); return;
    }


  }

  _handle(e) {
    var href = $(e.target).attr("href");
    if (typeof href !== "string") return;
    if ((href.length < 1) || (href[0] != "#")) return;

    e.preventDefault();
    this.gotoHref(href);
  }

  _gotoAlbum(id) {
    this._page.close();
    this._page = new Album(id, this._player);
  }

  _gotoMedialibrary(href) {
    if (this._page.getId() != "medialibrary") {
      this._page.close();
      this._page = new MediaLibrary();
    }
    this._page.setPage(href.split("medialibrary/")[1]);
  }

  _gotoFavourite() {
    this._page.close();
    this._page = new Favourite(this._player);
  }

  _gotoHistory() {
    this._page.close();
    this._page = new History(this._player);
  }

  _gotoMusician(id) {
    this._page.close();
    this._page = new Musician(id);
  }

  _gotoGenres() {
    this._page.close();
    this._page = new Genres();
  }

  _gotoCreateGenre() {
    this._page.close();
    this._page = new CreateGenre();
  }

  _gotoGenre(id, genreInfo) {
    this._page.close();
    this._page = new ReadGenre(id, genreInfo);
  }

  _gotoEditGenre(genre) {
    this._page.close();
    this._page = new EditGenre(genre);
  }

  _gotoGenresList(infoForGenres) {
    this._page.close();
    this._page = new GenresList(infoForGenres.id, infoForGenres.trackName, infoForGenres.albumId);
  }

  setPage(page) {
    this._page.close();
    this._page = page;
  }
}
