class MediaLibraryNullPage {
  constructor() {
    $("#musicianCommonList .musicianList > .createMusicianButton").removeClass("close");
  }

  close() {
    $("#musicianCommonList .musicianList > .createMusicianButton").addClass("close");
  }
}

class MediaLibrary {
  constructor() {
    $("#musicianCommonList").removeClass("close");
    this._page = new MediaLibraryNullPage();

    $("#musicianCommonList .musicianList > .createMusicianButton").click(this._clickCreateMusicianButton.bind(this));

    this._sendAbcCountRequest();
  }

  _sendAbcCountRequest() {
    var successFunction = this._getMusiciansCountByAbc.bind(this);
    doRequest({
      url: "/musicians?abc=true",
      success: successFunction
    });
  }

  close() {
    $("#musicianCommonList .abcList table").html("");
    $("#musicianCommonList").addClass("close");
    $("#musicianCommonList .musicianList > .createMusicianButton").off("click");

    this._page.close();
  }

  getId() {
    return "medialibrary";
  }

  setPage(href) {
    if (href == "") {
      this._page.close();
      this._page = new MediaLibraryNullPage();
    }
    if (href.startsWith("abcmusician_")) {
      var letter = href.split("abcmusician_")[1];
      if (letter === "") {
        return;
      }
      this._page.close();
      this._page = new MediaLibraryMusiciansListPage(letter);
      return;
    }
    if (href.startsWith("musician_")) {
      var id = parseInt(href.split("musician_")[1]);
      if (id === NaN) return;
      this._page.close();
      this._page = new MediaLibraryReadMusician(id, this._cancel.bind(this), this._clickEditMusicianHandler.bind(this),
        this._cancel.bind(this), this._clickCreateAlbumButton.bind(this));
      return;
    }
    if (href.startsWith("newalbum/")) {
      var album = JSON.parse(href.split("newalbum/")[1]);
      this._showNewAlbum(album);
      return;
    }
    if (href.startsWith("album_")) {
      href = href.split("album_")[1].split("_");
      var albumId = href[0];
      var musicianId = href[1];
      this._showAlbum(albumId, musicianId);
      return;
    }
    if (href.startsWith("editalbum/")) {
      var album = JSON.parse(href.split("editalbum/")[1]);
      this._editAlbum(album);
      return;
    }
    if (href.startsWith("loadtracks/")) {
      var id = parseInt(href.split("loadtracks/")[1]);
      if (id === NaN) return;
      this._loadTracks(id);
      return;
    }
  }


  _getMusiciansCountByAbc(musicians_) {
    var html = $.templates("#musicianAbcList-template").render({musicians: musicians_});
    $("#musicianCommonList .abcList table").html(html);
  }

  _clickCreateMusicianButton () {
    this._page.close();
    this._page = new MediaLibraryCreateMusiciansListPage(this._musicianIsCreated.bind(this), this._cancel.bind(this));
  }

  _clickEditMusicianHandler(musicianInfo) {
    this._page.close();
    this._page = new MediaLibraryEditMusician(musicianInfo.id, musicianInfo.name, musicianInfo.description,
      this._clickGotoMusician.bind(this) ,this._musicianIsCreated.bind(this));
  }

  _clickGotoMusician(musicianId) {
    this._page.close();
    this._page = new MediaLibraryReadMusician(musicianId, this._cancel.bind(this), this._clickEditMusicianHandler.bind(this),
      this._cancel.bind(this), this._clickCreateAlbumButton.bind(this), null);
  }

  _musicianIsCreated(musician) {
    this._page.close();
    this._page = new MediaLibraryReadMusician(musician.id, this._cancel.bind(this), this._clickEditMusicianHandler.bind(this),
      this._cancel.bind(this), this._clickCreateAlbumButton.bind(this), musician);
    this._sendAbcCountRequest();
  }

  _clickCreateAlbumButton(musicianId) {
    this._page.close();
    this._page = new CreateAlbumPage(musicianId);
  }

  _showNewAlbum(album) {
    this._page.close();
    this._page = new ReadAlbumPage(album.id, album.musician.musicianId, album);
  }

  _showAlbum(id, musicianId) {
    this._page.close();
    this._page = new ReadAlbumPage(id, musicianId);
  }

  _cancel() {
    this._page.close();
    this._page = new MediaLibraryNullPage();
    this._sendAbcCountRequest();
  }

  _editAlbum(album) {
    this._page.close();
    this._page = new EditAlbumPage(album);
  }

  _loadTracks(id) {
    this._page.close();
    this._page = new LoadTracksPage(id);
  }
}
