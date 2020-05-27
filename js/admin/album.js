class CreateAlbumPage {
  constructor(musicianId) {
    this._musicianId = musicianId;
    this._item = $.templates("#createAlbum-template").render();

    $("#musicianCommonList .createAlbum").removeClass("close");

    $("#musicianCommonList .createAlbum .createAlbumButton").click(this._clickCreateAlbumButton.bind(this));
    var temp = $("#musicianCommonList .createAlbum .cancel");
    temp.attr("href", "#medialibrary/musician_" + this._musicianId);

    $("#musicianCommonList .createAlbum .trackList").append(this._item);

    $(document).on("click", "#musicianCommonList .createAlbum .item .plusButton", this._clickPlusButton.bind(this));
    $(document).on("click", "#musicianCommonList .createAlbum .item .minusButton", this._clickMinusButton.bind(this));
  }

  _clickCreateAlbumButton() {
    var name = $("#musicianCommonList .createAlbum .name").val().trim();
    if (name == "") return;

    var date = new Date($("#musicianCommonList .createAlbum .date").val());

    if ((date.getDate() == NaN)||(date.getMonth() == NaN)||(date.getFullYear() == NaN)) return;
    var releaseDate = (date.getDate() < 10? "0" + date.getDate() : "" + date.getDate()) + "-" +
                      ((date.getMonth() + 1) < 10? "0" + (date.getMonth() + 1) : "" + (date.getMonth() + 1)) + "-" +
                      date.getFullYear();

    var single = $("#musicianCommonList .createAlbum .isSingle option:selected").val() == "true";

    var tracks = [];

    $("#musicianCommonList .createAlbum .trackList").children().toArray().forEach((item, i) => {
      var name = $(item).children("input").val().trim();
      if (name != "") {
        tracks.push({
          name: name
        });
      }
    });

    var musicianId = this._musicianId;
    var successFunction = this._albumIsCreated.bind(this);
    doRequest({
      url: "/musician/" + musicianId + "/album",
      type: "POST",
      success: successFunction,
      data: {
        name: name,
        single: single,
        releaseDate: releaseDate,
        tracks: tracks
      }
    });
  }

  _albumIsCreated(album) {
    Router.getInstance().gotoHref("#medialibrary/newalbum/" + JSON.stringify(album));
  }

  _clickPlusButton() {
    $("#musicianCommonList .createAlbum .trackList").append(this._item);
  }

  _clickMinusButton(e) {
    if ($("#musicianCommonList .createAlbum .trackList .item").length == 1) {
      return;
    }
    $(e.target).parent().remove();
  }

  close() {
    $("#musicianCommonList .createAlbum").addClass("close");
    $("#musicianCommonList .createAlbum .name").val("");
    $("#musicianCommonList .createAlbum .cancel").off("click");
    $("#musicianCommonList .createAlbum .createAlbumButton").off("click");
    $("#musicianCommonList .createAlbum .trackList").html("");
    $(document).off("click", "#musicianCommonList .createAlbum .item .plusButton");
    $(document).off("click", "#musicianCommonList .createAlbum .item .minusButton");
  }
}


class ReadAlbumPage {
  constructor(id, musicianId, album) {
    $("#musicianCommonList .readAlbum").removeClass("close");

    this._id = id;
    this._musicianId = musicianId;
    this._template = $.templates("#readAlbum-template");
    this._album = null;

    if (album) {
      this._acceptAlbumInfo(album);
    } else {
      this._loadAlbumInfo();
    }
  }

  _deleteAlbum() {
    var musicianId = this._musicianId;
    doRequest({
      url: "/album/" + this._id,
      type: "DELETE",
      success: function() {
        Router.getInstance().gotoHref("#medialibrary/musician_" + musicianId);
      }
    });
  }

  _editAlbum() {
    Router.getInstance().gotoHref("#medialibrary/editalbum/" + JSON.stringify(this._album));
  }

  _loadAlbumInfo() {
    var successFunction = this._acceptAlbumInfo.bind(this);
    doRequest({
      url: "/album/" + this._id,
      success: successFunction
    });
  }

  _acceptAlbumInfo(album) {
    this._album = album;
    var page = $("#musicianCommonList .readAlbum");
    page.html(this._template.render({
      musicianName: album.musician.name,
      musicianId: album.musician.id,
      name: album.name,
      releaseDate: album.releaseDate,
      single: album.single,
      tracks: album.tracks
    }));
    $("#musicianCommonList .readAlbum .editAlbumButton").click(this._editAlbum.bind(this));
    $("#musicianCommonList .readAlbum .deleteAlbumButton").click(this._deleteAlbum.bind(this));
    $("#musicianCommonList .readAlbum .cancel").attr("href", "#medialibrary/musician_" + album.musician.id);
    $("#musicianCommonList .readAlbum .loadTracksButton").attr("href", "#medialibrary/loadtracks/" + album.id);

    getImage("/album/" + album.id + "/image", null, page.children("img"));
  }

  close() {
    $("#musicianCommonList .readAlbum").addClass("close");
    $("#musicianCommonList .readAlbum").html("");
    $("#musicianCommonList .readAlbum .editAlbumButton").off("click");
    $("#musicianCommonList .readAlbum .deleteAlbumButton").off("click");
  }
}


class EditAlbumPage {
  constructor(album) {
    this._album = album;
    this._item = $.templates("#editAlbum-item-template");
    $("#musicianCommonList .editAlbum").html($.templates("#editAlbum-template").render({
      name: album.name,
      date: this._strDateToInputDate(album.releaseDate),
      // tracks: album.tracks,
      single: album.single
    }));
    if (album.tracks.length > 0) {
      $("#musicianCommonList .editAlbum table").html(this._item.render({
        tracks: album.tracks
      }))
    } else {
      $("#musicianCommonList .editAlbum table").html(this._item.render({
        tracks: [{
          name: "",
          id: null
        }]
      }));
      album.tracks.push({name: "", id: null});
    }


    getImage("/album/" + album.id + "/image", null, $("#musicianCommonList .editAlbum .cover"));
    setImageLoader("/album/" + album.id + "/image", $("#musicianCommonList .editAlbum .loader input"),
        $("#musicianCommonList .editAlbum .cover"));

    $("#musicianCommonList .editAlbum .cancel").attr("href", "#medialibrary/album_" + album.id);

    $(document).on("click", "#musicianCommonList .editAlbum .plusButton", this._clickPlusButton.bind(this));
    $(document).on("click", "#musicianCommonList .editAlbum .minusButton", this._clickMinusButton.bind(this));
    $(document).on("click", "#musicianCommonList .editAlbum .up", this._clickUpButton.bind(this));
    $(document).on("click", "#musicianCommonList .editAlbum .down", this._clickDownButton.bind(this));

    $("#musicianCommonList .editAlbum .editAlbumButton").click(this._clickEditAlbumButton.bind(this));

    $("#musicianCommonList .editAlbum .chooseGenresButton").click(this._clickChooseGenresButton.bind(this));
  }

  close() {
    removeImageLoader($("#musicianCommonList .editAlbum .loader input"));
    if (this._chooseGenresPage) {
      this._chooseGenresPage.close();
    }
    $("#musicianCommonList .editAlbum").removeClass("close");
    $("#musicianCommonList .editAlbum").html("");
    $(document).off("click", "#musicianCommonList .editAlbum .plusButton");
    $(document).off("click", "#musicianCommonList .editAlbum .minusButton");
    $(document).off("click", "#musicianCommonList .editAlbum .up");
    $(document).off("click", "#musicianCommonList .editAlbum .down");
  }

  _strDateToInputDate(strDate) {
    var tokens = strDate.split("-");
    return tokens[2] + "-" + tokens[1] + "-" + tokens[0];
  }

  _getIndexOfItem(e) {
    return $(e.target).parents("tr").index();
  }

  _clickPlusButton(e) {
    var index = this._getIndexOfItem(e);
    var newTrack = {
      name: "",
      id: null
    }
    $(e.target).parents("tr").after(this._item.render({
      tracks: [newTrack]
    }));
    this._album.tracks.splice(index + 1, 0, newTrack);
  }

  _clickMinusButton(e) {
    var index = this._getIndexOfItem(e);
    if (this._album.tracks.length == 1) {
      this._album.tracks[0] = {name: "", id: null};
      return;
    }
    $(e.target).parents("tr").remove();
    this._album.tracks.splice(index, 1);
  }

  _clickUpButton(e) {
    var index = this._getIndexOfItem(e);
    if (index == 0) return;
    $("#musicianCommonList .editAlbum table tr").eq(index - 1).before($($(e.target).parents("tr")));

    var tracks = this._album.tracks;
    [tracks[index], tracks[index-1]] = [tracks[index-1], tracks[index]];
  }

  _clickDownButton(e) {
    var tracks = this._album.tracks;
    var index = this._getIndexOfItem(e);
    if (tracks.length - index == 1) return;
    $("#musicianCommonList .editAlbum table tr").eq(index + 1).after($($(e.target).parents("tr")));

    var tracks = this._album.tracks;
    [tracks[index], tracks[index+1]] = [tracks[index+1], tracks[index]];
  }

  _clickEditAlbumButton() {
    var albumName = $("#musicianCommonList .editAlbum .name").val().trim();
    if (albumName == "") return;

    var date = new Date($("#musicianCommonList .editAlbum .date").val());
    if ((date.getDate() == NaN)||(date.getMonth() == NaN)||(date.getFullYear() == NaN)) return;
    var releaseDate = (date.getDate() < 10? "0" + date.getDate() : "" + date.getDate()) + "-" +
                      ((date.getMonth() + 1) < 10? "0" + (date.getMonth() + 1) : "" + (date.getMonth() + 1)) + "-" +
                      date.getFullYear();

    var single = $("#musicianCommonList .editAlbum .isSingle option:selected").val() == "true";

    var tracks = [];

    for (var i = 0; i < this._album.tracks.length; i++) {
      let name = $("#musicianCommonList .editAlbum table tr input").eq(i).val().trim();
      if (name == "") continue;
      tracks.push({
        id: this._album.tracks[i].id,
        name: name
      });
    }

    doRequest({
      url: "/album/" + this._album.id,
      data: {
        name: albumName,
        releaseDate: releaseDate,
        single: single,
        tracks: tracks
      },
      type: "PUT",
      success: this._acceptAlbumInfo.bind(this)
    });
  }

  _acceptAlbumInfo(album) {
    Router.getInstance().gotoHref("#medialibrary/newalbum/" + JSON.stringify(album));
  }

  _clickChooseGenresButton(e) {
    var index = this._getIndexOfItem(e);

    if (this._album.tracks[index].id === null) return;

    $("#musicianCommonList .editAlbum").addClass("close");

    this._chooseGenresPage = new ChooseGenrePage(this._album.tracks[index].id, function() {
      this._chooseGenresPage.close();
      $("#musicianCommonList .editAlbum").removeClass("close");
      this._chooseGenresPage = null;
    }.bind(this));
  }
}

class LoadTracksPage {
  constructor(id) {
    this._id = id;
    this._tracks = null;
    doRequest({
      url: "/album/" + this._id,
      success: this._acceptAlbumInfo.bind(this)
    });
  }

  _acceptAlbumInfo(album) {
    $("#musicianCommonList .loadTracks").html($.templates("#loadTracks-template").render({
      tracks: album.tracks
    }));
    $("#musicianCommonList .loadTracks .cancel").attr("href", "#medialibrary/album_" + this._id);
    for (var i = 0; i < album.tracks.length; i++) {
      setAudioLoader("/track/" + album.tracks[i].id + "/audio", $("#musicianCommonList .loadTracks input").eq(i), (function(a) {
        return function() {
          $("#musicianCommonList .loadTracks img").eq(a).removeClass("close");
        }
        })(i), (function(a) {
          return function() {
            $("#musicianCommonList .loadTracks img").eq(a).addClass("close");
          }
        })(i), null);
    }
    this._tracks = album.tracks;
  }

  close() {
    for (var i = 0; i < this._tracks.length; ++i) {
      removeAudioLoader($("#musicianCommonList .loadTracks input").eq(i));
    }
    $("#musicianCommonList .loadTracks").html("");
  }
}

class ChooseGenrePage {
  constructor(trackId, backHandler) {
    this._trackId = trackId;
    this._backHandler = backHandler;
    $("#musicianCommonList .chooseGenre").removeClass("close");

    doRequest ({
      url: "/genres",
      success: this._acceptAllGenre.bind(this)
    });

    doRequest({
      url: "/track/" + trackId + "/genre",
      success: this._acceptTrackGenres.bind(this)
    });
  }

  _acceptAllGenre(genres) {
    this._genres = genres;
    if (this._trackGenres !== undefined) this._buildPage();
  }

  _acceptTrackGenres(genres) {
    this._trackGenres = genres;
    if (this._genres !== undefined) this._buildPage();
  }

  _buildPage() {
    this._ids = [];
    this._genres.forEach((item, i) => {
      this._ids.push(item.id);
    });
    this._chooseIds = [];
    this._trackGenres.forEach((item, i) => {
      this._chooseIds.push(item.id);
    });

    this._choosenGenres = [];

    this._genres.forEach((item, i) => {
        this._choosenGenres.push({
          name: item.name,
          belonged: this._chooseIds.includes(item.id)
        });
    });

    $("#musicianCommonList .chooseGenre").html($.templates("#chooseGenre-template").render({
      genres: this._choosenGenres
    }));

    $("#musicianCommonList .chooseGenre .cancel").click(this._backHandler);

    $("#musicianCommonList .chooseGenre input").change(function(e) {
      var index = $("#musicianCommonList .chooseGenre input").index($(e.target));
      var id = this._ids[index];
      if (this._chooseIds.includes(id)) {
        this._chooseIds = this._chooseIds.filter(chooseId => chooseId != id);
        this._trackGenres = this._trackGenres.filter(track => track.id != id);
      } else {
        this._chooseIds.push(id);
        this._trackGenres.push(this._genres.find(function(element) {
          element.id == id;
        }));
      }
      var request = [];
      this._chooseIds.forEach((item, i) => {
        request.push({
          id: item
        });
      });

      doRequest({
        url: "/track/" + this._trackId + '/genre',
        type: "PUT",
        data: request
      });
    }.bind(this));
  }

  close() {
    $("#musicianCommonList .chooseGenre").addClass("close");
    $("#musicianCommonList .chooseGenre").html("");
  }
}
