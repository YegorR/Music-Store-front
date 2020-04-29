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
  $.ajax({
    url: host + requestParams.url,
    dataType: dataType,
    contentType: "application/json",
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
