const host = "http://localhost:8080";

//ПОТОМ УДАЛИТЬ
const admin_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6Mn0.YAiLbdN-gMjxp5q4iK_7zCPl1sPJ5eZKBe7YQym0kt0';
const yegor_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6M30.oro6PL9ajtJazPBdifIgxZ08ypot3V85FyTY5JDdBaU';
//ПОТОМ УДАЛИТЬ

function doRequest(requestParams) {
  if (typeof requestParams.dataType == "string") {
      var dataType = requestParams.dataType;
  } else {
      var dataType = "json"
  }
  if (typeof requestParams.type == "string") {
    var type = requestParams.type;
  } else {
    var type = "GET";
  }
  if (requestParams.data) {
    var data = requestParams.data;
  } else {
    var data = undefined;
  }
  $.ajax({
    url: host + requestParams.url,
    dataType: dataType,
    contentType: "application/json",
    type: type,
    data: JSON.stringify(data),
    contentType: 'application/json',
    headers: {
      "Authorization": localStorage.getItem("token")
    },
    success: function(data, textStatus, jqXHR) {
        if (typeof requestParams.success == "function") {
          requestParams.success(data.body);
        }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      if (typeof requestParams.error == "function") {
        requestParams.error(jqXHR, textStatus, errorThrown);
      } else {
        alert(textStatus, errorThrown);
      }
    }
  });
}

function getImage(url, errorFunction, element) {
  $.ajax({
    url: host + url,
    headers: {
      "Authorization": localStorage.getItem("token")
    },
    success: function(data, textStatus, jqXHR) {
      element.attr("src", "data:image;base64, " + data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      if (typeof errorFunction == "function") {
        requestParams.error(jqXHR, textStatus, errorThrown);
      } else {
        alert(textStatus, errorThrown);
      }
    }
  });
}

function setImageLoader(url, element, successElement, errorFunction) {
  element.attr("accept", "image/*");
  element.dmUploader({
    url: host + url,
    queue: false,
    method: "PUT",
    auto: true,
    headers: {
      'Authorization': localStorage.getItem("token")
    },
    fieldName: "image",
    onUploadSuccess: function() {
      if (successElement) {
        getImage(url, null, successElement);
      }
    },
    allowedTypes: "image/*",
    extFilter: ["jpeg", "jpg", "gif", "png", "apng", "bmp"]
  });
}

function removeImageLoader(element) {
  element.dmUploader("destroy");
}

function setAudioLoader(url, element, confirmHandler, startHandler, errorFunction) {
  element.attr("accept", ".mp3");
  element.dmUploader({
    url: host + url,
    queue: false,
    auto: true,
    method: "PUT",
    fieldName: "audio",
    onUploadSuccess: confirmHandler,
    onNewFile: startHandler,
    // allowedTypes: "audio/mp3",
    // extFilter: ["mp3"],
    headers: {
      "Authorization": localStorage.getItem("token")
    }
  });
}

function removeAudioLoader(element) {
  element.dmUploader("destroy");
}
