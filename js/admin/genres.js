class Genres {
  constructor() {
    this._templ = $.templates("#genres-template");

  doRequest({
      url: "/genres",
      success: this._acceptGenresInfo.bind(this)
    });
  }

  getId() {
    return "genres";
  }

  _acceptGenresInfo(genres) {
    $("#genres").html(this._templ.render({
      genres: genres
    }));
    $("#genres").removeClass("close");
  }

  close() {
    $("#genres").addClass("close");
    $("#genres").html("");
  }
}


class CreateGenre {
  constructor() {
    $("#createGenre").removeClass("close");

    $("#createGenre .createGenreButton").click(this._createGenre.bind(this));
  }

  getId() {
    return "createGenre";
  }

  _createGenre() {
    var name = $("#createGenre .name").val().trim();
    var description = $("#createGenre .description").val().trim();

    if ((name == "") || (description == "")) {
      return;
    }

    doRequest({
      url: "/genre",
      type: "POST",
      data: {
        name: name,
        description: description
      },
      success: this._acceptGenreInfo.bind(this)
    });
  }

  _acceptGenreInfo(genre) {
    //Router.getInstance().gotoHref("#genres"); // TODO: потом заменить на страницу жанра
    Router.getInstance().gotoHref("#genre/json/" + JSON.stringify(genre));
  }

  close() {
    $("#createGenre").addClass("close");
    $("#createGenre .createGenreButton").off("click");
  }
}

class ReadGenre {
  constructor(id, genreInfo) {
    this._tmpl = $("#genre-template");
    if (genreInfo) {
      this._acceptGenreInfo(genreInfo);
    } else {
      this._id = id;
      doRequest({
        url: "/genre/" + id,
        success: this._acceptGenreInfo.bind(this)
      });
    }
  }

  getId() {
    return "readGenre";
  }

  _acceptGenreInfo(genre) {
    $("#genre").html(this._tmpl.render(genre));

    $("#genre").removeClass("close");
    getImage("/genre/" + genre.id + "/image", null, $("#genre img"));
    $("#genre .deleteGenreButton").click(this._deleteGenre.bind(this));
    $("#genre .editGenreButton").click(function() {
      Router.getInstance().gotoHref("#editGenre/" + JSON.stringify(genre));
    });
  }

  close() {
    $("#genre").addClass("close");
    $("#genre").html("");
  }

  _deleteGenre() {
    doRequest({
      url: "/genre/" + this._id,
      type: "DELETE",
      success: function() {
        Router.getInstance().gotoHref("#genres");
      }
    });
  }
}


class EditGenre {
  constructor(genre) {
    this._id = genre.id;
    $("#editGenre").html($.templates("#editGenre-template").render(genre));
    $("#editGenre").removeClass("close");
    getImage("/genre/" + genre.id + "/image", null, $("#editGenre img"));
    setImageLoader("/genre/" + genre.id + "/image", $("#editGenre .loader"),  $("#editGenre img"));
    $("#editGenre .editGenreButton").click(this._sendGenreInfo.bind(this));
  }

  getId() {
    return "editGenre";
  }

  _sendGenreInfo() {
    var name = $("#editGenre .name").val().trim();
    var description = $("#editGenre .description").val().trim();

    if ((name == "") || (description == "")) return;

    doRequest({
      url: "/genre/" + this._id,
      type: "PUT",
      data: {
        name: name,
        description: description
      },
      success: function(genre) {
        Router.getInstance().gotoHref("#genre/json/" + JSON.stringify(genre));
      }
    });
  }

  close() {
    $("#editGenre").addClass("close");
    $("#editGenre").html("");
  }
}
