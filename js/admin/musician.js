class MediaLibraryMusiciansListPage {
  constructor (letter) {
    this._letter = letter;
    $("#musicianCommonList .musicianList > .createMusicianButton").removeClass("close");
    var successFunction = this._acceptInfo.bind(this);
    doRequest({url: "/musicians?letter=" + letter, success: successFunction});
  }

  _acceptInfo(musicians) {
    $("#musicianCommonList .musicianList .list").html($.templates("#musicianList-template").render({musicians: musicians}));
  }

  close() {
    $("#musicianCommonList .musicianList .list").html("");
    $("#musicianCommonList .musicianList > .createMusicianButton").addClass("close");
  }
}

class MediaLibraryCreateMusiciansListPage {
  constructor(musicianIsCreatedHandler, cancelHandler) {
    this._createdHandler = musicianIsCreatedHandler;
    this._cancelHandler = cancelHandler;

    $("#musicianCommonList .createMusician").removeClass("close");

    $("#musicianCommonList .createMusician .createMusicianButton").click(this._clickCreateMusicianButton.bind(this));
    $("#musicianCommonList .createMusician .cancel").click(this._clickCancelButton.bind(this));
  }

  _clickCreateMusicianButton() {
    var name = $("#musicianCommonList .createMusician .name").val().trim();
    var description = $("#musicianCommonList .createMusician .description").val().trim();

    if ((name == "") || (description == "")) {
      return;
    }
    var successFunction = this._musicianIsCreated.bind(this);
    doRequest({
      url: "/musician",
      type: "POST",
      data: {
        name: name,
        description: description
      },
      success: successFunction
    });
  }

  _clickCancelButton() {
    this._cancelHandler();
  }

  _musicianIsCreated(musician) {
    this._createdHandler(musician);
  }

  close() {
    $("#musicianCommonList .createMusician").addClass("close");
    var name = $("#musicianCommonList .createMusician .name").val("");
    var description = $("#musicianCommonList .createMusician .description").val("");
    $("#musicianCommonList .createMusician .createMusicianButton").off("click");
    $("#musicianCommonList .createMusician .cancel").off("click");
  }
}

class MediaLibraryReadMusician {
  constructor(id, cancelHandler, editHandler, deleteHandler, createAlbumHandler, musicianInfo) {
    this._id = id;
    this._deleteHandler = deleteHandler;
    this._editHandler = editHandler;
    this._createAlbumHandler = createAlbumHandler;

    this._musicianInfo = null;
    $("#musicianCommonList .musicianList .readMusician").removeClass("close");

    if (musicianInfo) {
      this._acceptMusicianInfo(musicianInfo);
    } else {
      var successFunction = this._acceptMusicianInfo.bind(this);
      doRequest({
        url: "/musician/" + id,
        success: successFunction
      });
    }

    getImage("/musician/" + id + "/image", null, $("#musicianCommonList .musicianList .readMusician img"));

    $("#musicianCommonList .musicianList .readMusician .deleteMusicianButton").click(this._deleteMusician.bind(this));
    $("#musicianCommonList .musicianList .readMusician .cancel").click(cancelHandler);
    $("#musicianCommonList .musicianList .readMusician .editMusicianButton").click(this._clickEditMusician.bind(this));
    $("#musicianCommonList .musicianList .readMusician .createAlbumButton").click(this._clickCreateAlbum.bind(this));
  }

  _clickCreateAlbum() {
    this._createAlbumHandler(this._id);
  }

  _clickEditMusician() {
    if (this._musicianInfo) {
      this._editHandler(this._musicianInfo);
    }
  }

  _deleteMusician() {
    var successFunction = this._deleteHandler;
    doRequest({
      url: "/musician/" + this._id,
      type: "DELETE",
      success: successFunction
    });
  }

  _acceptMusicianInfo(info) {
    this._musicianInfo = info;
    $("#musicianCommonList .musicianList .readMusician .name").html(info.name);
    $("#musicianCommonList .musicianList .readMusician .description").html(info.description);

    var musicianId = this._id;
    info.albums.forEach((item, i) => {
      item.musicianId = musicianId
    });

    info.singles.forEach((item, i) => {
      item.musicianId = musicianId
    });


    $("#musicianCommonList .musicianList .readMusician .albumsList").html($.templates("#albumsList-template").render({
      single: false,
      count: info.albums.length,
      items: info.albums
      // musicianId: musicianId
    }));
    $("#musicianCommonList .musicianList .readMusician .singlesList").html($.templates("#albumsList-template").render({
      single: true,
      count: info.singles.length,
      items: info.singles
      // musicianId: musicianId
    }));
  }

  close() {
    $("#musicianCommonList .musicianList .readMusician").addClass("close");
    $("#musicianCommonList .musicianList .readMusician .name").html("");
    $("#musicianCommonList .musicianList .readMusician .description").html("");
    $("#musicianCommonList .musicianList .readMusician .albumsList").html("");
    $("#musicianCommonList .musicianList .readMusician .singlesList").html("");
    $("#musicianCommonList .musicianList .readMusician .deleteMusicianButton").off("click");
    $("#musicianCommonList .musicianList .readMusician .cancel").off("click");
    $("#musicianCommonList .musicianList .readMusician .editMusicianButton").off("click");
    $("#musicianCommonList .musicianList .readMusician img").removeAttr("src");
  }
}

class MediaLibraryEditMusician {
  constructor(id, name, description, cancelHandler, editHandler) {
    this._cancelHandler = cancelHandler;
    this._editHandler = editHandler;
    this._id = id;

    $("#musicianCommonList .editMusician").removeClass("close");
    $("#musicianCommonList .editMusician .name").val(name);
    $("#musicianCommonList .editMusician .description").val(description);
    getImage("/musician/" + id + "/image", null, $("#musicianCommonList .editMusician img"));

    $("#musicianCommonList .editMusician .editMusicianButton").click(this._clickEdit.bind(this));
    $("#musicianCommonList .editMusician .cancel").click(this._clickCancel.bind(this));

    setImageLoader("/musician/" + id + "/image", $("#musicianCommonList .editMusician .loader"), $("#musicianCommonList .editMusician img"));
  }

  _clickEdit() {
    var name = $("#musicianCommonList .editMusician .name").val().trim();
    var description = $("#musicianCommonList .editMusician .description").val().trim();

    if ((name == "") || (description == "")) {
      return;
    }
    var successFunction = this._musicianIsEdited.bind(this);
    doRequest({
      url: "/musician/" + this._id,
      success: successFunction,
      type: "PUT",
      data: {
        name: name,
        description: description
      }
    });
  }

  _musicianIsEdited(musicianInfo) {
    this._editHandler(musicianInfo);
  }

  _clickCancel() {
    this._cancelHandler(this._id);
  }

  close() {
    $("#musicianCommonList .editMusician .name").val("");
    $("#musicianCommonList .editMusician .description").val("");
    $("#musicianCommonList .editMusician img").removeAttr("src");

    $("#musicianCommonList .editMusician .editMusicianButton").off("click");
    $("#musicianCommonList .editMusician .cancel").off("click");

    removeImageLoader($("#musicianCommonList .editMusician .loader"));

    $("#musicianCommonList .editMusician").addClass("close");
  }
}
