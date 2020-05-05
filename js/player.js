class Player {
  constructor() {
      this._trackId = null;
      this._albumId = null;
      this._musicianId = null;
      this._currentHowl = null;
      this._trackList = null;
      this._currentTrackIndex = null;
      this._randomTrackList = null;
      this._autoplay = null;
      this._trackListPlayHandler = null;
      this._currentTrackIndexHandler = null;

      $(".player .play").click(this._onClickPlayButton.bind(this));
      $(".player .next").click(this._onClickNextButton.bind(this));
      $(".player .prev").click(this._onClickPrevButton.bind(this));
      $(".player .strip").click(this._onClickStrip.bind(this));
      $(".player .random").click(this._onClickRandonButton.bind(this));

      setInterval(this._onCurrentTimeTimer.bind(this), 50);
  }

  _formatTime(sec) {
    var minutes = ((sec - sec % 60) / 60);
    var seconds = Math.floor(sec % 60);
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    return minutes + ":" + seconds;
  }
  _setCurrentTime(currentTime) {
    $(".player .currentTime").text(this._formatTime(currentTime));
  }

  _setFinalTime(finalTime) {
    $(".player .finalTime").text(this._formatTime(finalTime));
  }

  setTrackList(trackList) {
      if ((this._currentHowl !== null)) {
        this._currentHowl.stop();
      }
      this._trackList = trackList;
      this._currentTrackIndex = 0;
      this._loadCurrentTrack(this._trackList[0]);
    }

  clickPlayButton() {
    this._onClickPlayButton();
  }

  setTrackListPlayHandler(handler) {
    this._trackListPlayHandler = handler;
  }

  setCurrentTreckIndexHandler(handler) {
    this._currentTrackIndexHandler = handler;
  }

  _loadCurrentTrack(id) {
    this._setFinalTime(0);
    var successFun = this._acceptTrackInfo.bind(this);
    doRequest({
      url: '/track/' + id,
      success: successFun
    });

  }

  _acceptTrackInfo(trackInfo) {
    this._trackId = trackInfo.id;
    this._albumId = trackInfo.albumId;
    this._musicianId = trackInfo.musicianId;
    getImage("/album/" + this._albumId + "/image", null, $(".player .cover"));

    $(".player .musician a").text(trackInfo.musicianName);
    $(".player .song a").text(trackInfo.name);
    this._changePlayIcon(false);

    var onPlay = this._onTrackPlay.bind(this);
    var onEnd = this._onTrackEnd.bind(this);
    this._autoplay = true;
    if (this._currentHowl !== null) {
      this._currentHowl.unload();
    }
    this._currentHowl = new Howl({
      src: host + '/track/' + trackInfo.id + '/audio',
      format: ['mp3'],
      xhrHeaders:{
        Authorization: localStorage.getItem('token')
      },
      autoplay: true,
      onplay: onPlay,
      onend: onEnd
    });
  }

  _changePlayIcon(isPlay) {
    if (isPlay) {
      $(".player .play").attr("src", "img/player/play.svg");
    } else {
      $(".player .play").attr("src", "img/player/pause.svg");
    }
    if (typeof this._trackListPlayHandler == "function") {
      this._trackListPlayHandler(isPlay);
    }
  }

  _onTrackEnd() {
    this._currentTrackIndex++;
    if (this._trackList.length <= this._currentTrackIndex) {
      this._currentTrackIndex = 0;
    }
    this._sendCurrentIndex();
    this._loadCurrentTrack(this._trackList[this._currentTrackIndex]);
  }

  _onTrackPlay(id) {
    var finalTime = this._currentHowl.duration();
    this._setFinalTime(finalTime);

    if (this._currentHowl.playing()) {
      this._changePlayIcon(false);
    } else {
      this._changePlayIcon(true);
    }
  }


  _onClickPlayButton() {
    if (this._currentHowl === null) {
      this._changePlayIcon(true);
      return;
    }
    if (this._currentHowl.playing()) {
      this._currentHowl.pause();
      this._changePlayIcon(true);
      return;
    }
    if (this._currentHowl.state() != "loaded") {
      if (this._autoplay) {
        this._changePlayIcon(true);
        this._autoplay = false;
        this._currentHowl.pause();
      } else {
        this._changePlayIcon(false);
        this._autoplay = true;
        this._currentHowl.play(true);
      }
      return;
    } else {
      this._currentHowl.play();
      this._changePlayIcon(false);
    }
  }

  _onClickNextButton() {
    if (this._trackList === null) return;
    if (this._currentHowl !== null) {
      this._currentHowl.stop();
    }
    this._onTrackEnd();
  }

  _onClickPrevButton() {
    if (this._trackList === null) return;
    if (this._currentHowl !== null) {
      if (this._currentHowl.seek() > 5) {
        this._currentHowl.seek(0);
        return;
      }
      this._currentHowl.stop();
    }
    this._currentTrackIndex--;
    if (this._currentTrackIndex < 0) {
      this._currentTrackIndex = this._trackList.length - 1;
    }
    this._sendCurrentIndex();
    this._loadCurrentTrack(this._trackList[this._currentTrackIndex]);
  }

  _onClickStrip(e) {
    var width = $(".player .strip").width();
    var pos = e.pageX - $(".player .strip").offset().left;
    var proc = (pos / width * 100) + "%";
    $(".player .strip .played").css("width", proc);

    if (this._currentHowl !== null) {
      var newTime = (pos / width) * this._currentHowl.duration();
      this._currentHowl.seek(newTime);
    }
  }

  _onClickRandonButton() {
      if (this._trackList === null) return;

      if (this._randomTrackList === null) {
        this._randomTrackList = [this._trackList[this._currentTrackIndex]];
        this._randomTrackList = this._randomTrackList.concat(this._shaffleList(this._trackList));

        let temp = this._randomTrackList;
        this._randomTrackList = this._trackList;
        this._trackList = temp;
        this._currentTrackIndex = 0;

        $(".player .random").attr("src", "img/player/random_pressed.svg");
      } else {
        let current = this._trackList[this._currentTrackIndex];
        let newIndex = this._randomTrackList.indexOf(current);
        this._trackList = this._randomTrackList;
        this._randomTrackList = null;
        this._currentTrackIndex = newIndex;

        $(".player .random").attr("src", "img/player/random.svg");
      }
  }

  _shaffleList(list) {
    list = [...list];
    for(let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = list[i];
      list[i] = list[j];
      list[j] = temp;
    }
    return list;
  }

  _onCurrentTimeTimer() {
    if (this._currentHowl === null) return;

    var duration = this._currentHowl.duration();
    if (duration == 0) return;
    var currentTime = this._currentHowl.seek();
    var proc = (currentTime/duration * 100) + "%";
    $(".player .strip .played").css("width", proc);

    this._setCurrentTime(currentTime);
  }

  _sendCurrentIndex() {
    if (typeof this._currentTrackIndexHandler != "function") {
      return;
    }
    if (this._randomTrackList == null) {
      this._currentTrackIndexHandler(this._currentTrackIndex);
    } else {
      var trackId = this._trackList[this._currentTrackIndex];
      this._currentTrackIndexHandler(this._randomTrackList.indexOf(trackId));
    }
  }
}
