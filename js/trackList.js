$(document).ready(function() {
  $(document).click(function() {
    $("#trackList .menu .submenu").addClass("close");
  });
});

class TrackList {
  constructor(player) {
    this._tmpl = $.templates("#trackList-template");
    this._trackList = $(".main #trackList");
    this._player = player;
    this._tracks = [];
    this._favourites;
    this._currentTrackIndex = null;
    this._basement = 0;

    this._player.setCurrentTreckIndexHandler(this._getCurrentTrackIndex.bind(this));
    //this._isPlaying = false;

    this._trackList.removeClass("close");
    //var test = $("#trackList .play img");
    //test.click(this._onClickPlayButton.bind(this));
  }

  showTracks(tracks) {
      this._tracks = [];
      this._favourites = [];
      tracks.forEach((item, i) => {
        this._tracks.push(item.trackId);
        this._favourites.push(item.favourite);
        item.id = i;

        item.infoForGenres = JSON.stringify({
          id: item.trackId,
          trackName: item.track,
          albumId: item.album.albumId
        });
      });

      $("#trackList .trackListPage").html(this._tmpl.render({tracks: tracks}));

      $("#trackList .play img").click(this._onClickPlayButton.bind(this));
      $("#trackList .like img").click(this._onClickLikeButton.bind(this));

      $("#trackList .menu img").click(function(e) {
        $("#trackList .menu .submenu").not($(e.target).parents(".menu").children(".submenu")).addClass("close");
        $(e.target).parents(".menu").children(".submenu").toggleClass("close");
        e.stopPropagation();
      });
  }

  close() {
    $("#trackList .trackListPage").html("");
    this._trackList.addClass("close");
    this._player.setTrackListPlayHandler(null);
  }

  _changePlayIcon(isPlay) {
    if (isPlay) {
      $("#trackListPlay" + this._currentTrackIndex).attr("src", "img/player/play.svg");
    } else {
      $("#trackListPlay" + this._currentTrackIndex).attr("src", "img/player/pause.svg");
    }
  }

  _onClickPlayButton(e) {
    var id = parseInt($(e.target).attr("id").split("trackListPlay")[1]);
    if (typeof id != "number") return;

    if (this._currentTrackIndex === null) {
      this._currentTrackIndex = id;
      this._basement = id;
      var tracks = [];
      var nextTracks = [];
      this._tracks.forEach((item, i) => {
        if (i < id) {
          nextTracks.push(item);
        } else {
          tracks.push(item);
        }
      });
      tracks = tracks.concat(nextTracks);
      this._player.setTrackList(tracks);
      this._player.setTrackListPlayHandler(this._changePlayIcon.bind(this));
      return;
    }
    if (this._currentTrackIndex == id) {
      this._player.clickPlayButton();
      return;
    }
    this._changePlayIcon(true);
    this._player.setTrackListPlayHandler(false);
    this._currentTrackIndex = null;
    this._onClickPlayButton(e);
  }

  _getCurrentTrackIndex(index) {
    this._changePlayIcon(true);
    this._currentTrackIndex = this._basement + index;
    if (this._currentTrackIndex >= this._tracks.length) {
      this._currentTrackIndex = Math.abs(this._tracks.length - this._currentTrackIndex);
    }
  }

  _changeLikeIcon(like, imgElement) {
    var img = like? "img/like.svg" : "img/nolike.svg";
    imgElement.attr("src", img);
  }

  _onClickLikeButton(e) {
    var id = parseInt($(e.target).attr("id").split("trackListLike")[1]);
    if (typeof id != "number") return;

    var successFunction = function(response) {
      this._changeLikeIcon(response.favourite, $(e.target));
      this._favourites[id] = response.favourite;
    };
    successFunction = successFunction.bind(this);

    doRequest({
      url: "/favourite",
      type: "PUT",
      data: {
        id: this._tracks[id],
        favourite: !this._favourites[id]
      },
      success: successFunction
    });
  }
}
