class Musician{
  constructor(id) {
    this._id = id;
    this._template = $.templates("#musician-template");

    $("#musician").removeClass("close");

    doRequest({
      url: "/musician/" + id,
      success: function(response) {
        $("#musician").html(this._template.render(response));
        getImage("/musician/" + response.id + "/image", null, $("#musician .image"));

        for (let i = 0; i < response.albums.length; ++i) {
          getImage("/album/" + response.albums[i].id + "/image", null, $("#musician .cover").eq(i));
        }
        for (let i = 0; i < response.singles.length; ++i) {
          getImage("/album/" + response.singles[i].id + "/image", null, $("#musician .cover").eq(response.albums.length + i));
        }
      }.bind(this)
    });
  }

  close() {
    $("#musician").addClass("close");
    $("#musician").html("");
  }
}
