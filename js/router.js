class NullPage {
  constructor() {}

  close() {}

  getHref() {
    return "nullpage";
  }
}


class Router {
  constructor(player, page) {
    this._player = player;
    if ((typeof page != "undefined")&&(page !== null)) {
      this._page = page;
    } else {
      this._page = new NullPage();
    }

    this._searchString = new SearchString(this._handleSearch.bind(this));
    let handleFunction = this._handle.bind(this);
    $(document).on("click", "a", handleFunction);
  }

  _handleSearch(query, type) {
    this._page.close();
    this._page = new SearchPage(query, type);
  }

  _handle(e) {
    var href = $(e.target).attr("href");
    if (typeof href !== "string") return;
    if ((href.length < 1) || (href[0] != "#")) return;

    e.preventDefault();
    href = href.split("#")[1].trim().toLowerCase();
    if (this._page.getId() == href) return;

    if (href.startsWith("album/")) {
      var id = parseInt(href.split("album/")[1]);
      if (id == NaN) return;
      this._gotoAlbum(id); return;
    }
  }

  _gotoAlbum(id) {
    this._page.close();
    this._page = new Album(id, this._player);
  }

  setPage(page) {
    this._page.close();
    this._page = page;
  }
}
