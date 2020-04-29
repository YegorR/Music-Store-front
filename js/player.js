class Player {
  constructor() {
      this._trackId = null;
      this._albumId = null;
      this._musicianId = null;
      this._currentHowl = null;
      this._trackList = null;
      this._currentTrackIndex = null;

      $(".player .play").click(this._onClickPlayButton.bind(this));
      $(".player .next").click(this._onClickNextButton.bind(this));
      $(".player .prev").click(this._onClickPrevButton.bind(this));
      $(".player .strip").click(this._onClickStrip.bind(this));

      setInterval(this._onCurrentTimeTimer.bind(this), 50);
  }

  _formatTime(sec) {
    var minutes = ((sec - sec % 60) / 60);
    var seconds = Math.floor(sec % 60);
    /*if (seconds == 60) {
      minutes++;
      seconds = 0;
    }*/
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
      this._trackList = trackList;
      this._currentTrackIndex = 0;
      this._loadCurrentTrack(this._trackList[0]);
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

    $(".player .musician a").text(trackInfo.musicianName);
    $(".player .song a").text(trackInfo.name);

    var onPlay = this._onTrackPlay.bind(this);
    var onEnd = this._onTrackEnd.bind(this);
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
  }

  _onTrackEnd() {
    this._currentTrackIndex++;
    if (this._trackList.length <= this._currentTrackIndex) {
      this._currentTrackIndex = 0;
    }
    this._loadCurrentTrack(this._trackList[this._currentTrackIndex]);
  }

  _onTrackPlay(id) {
    var finalTime = this._currentHowl.duration();
    this._setFinalTime(finalTime);
    this._changePlayIcon(false);
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
      this._changePlayIcon(true);
      return;
    } else {
      this._currentHowl.play();
    }
  }

  _onClickNextButton() {
    if (this._currentHowl !== null) {
      this._currentHowl.stop();
    }
    this._onTrackEnd();
  }

  _onClickPrevButton() {
    if (this._currentHowl !== null) {
      if (this._currentHowl.seek() < 5) {
        this._currentHowl.seek(0);
        return;
      }
      this._currentHowl.stop();
    }
    this._currentTrackIndex--;
    if (this._currentTrackIndex < 0) {
      this._currentTrackIndex = this._trackList.length - 1;
    }
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

  _onCurrentTimeTimer() {
    if (this._currentHowl === null) return;

    var duration = this._currentHowl.duration();
    if (duration == 0) return;
    var currentTime = this._currentHowl.seek();
    var proc = (currentTime/duration * 100) + "%";
    $(".player .strip .played").css("width", proc);

    this._setCurrentTime(currentTime);
  }
}
