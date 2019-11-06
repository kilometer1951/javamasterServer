$(document).ready(function() {
  //toggle auth-modal
  $("#next").on("click", function(e) {
    e.preventDefault();

    //ajax call
    $.post("/adminApi/firstUse", {
      userid: $("#userid").val()
    }).then(result => {
      if (result.length === 0) {
        //no user found
        console.log("no user found");
      } else {
        $("#section1").css({ display: "none" });
        $("#section2").css({ display: "block" });
        $(".loader").css({ display: "none" });
      }
    });
  });
  $("#back").on("click", function(e) {
    e.preventDefault();
    $("#section1").css({ display: "block" });
    $("#section2").css({ display: "none" });
  });
  $("#firstUseLogin").on("click", function(e) {
    e.preventDefault();
    //check confirm password
    if ($("#password").val() === $("#cpassword").val()) {
      //matches
      //update and redirect to login
      //ajax call
      $.post("/adminApi/updatePasswordForFirstUse", {
        userid: $("#userid").val(),
        password: $("#password").val()
      }).then(result => {
        //update success display to login button
        if (result.succ) {
          //success
          $(".loginLink").css({ display: "block" });
          $(".loginLink").html(
            '<a href="/admin/login">Click here to login</a>'
          );

          $("#section1").css({ display: "none" });
          $("#section2").css({ display: "none" });
        } else {
          //error
          $(".loginLink").css({ display: "block" });
          $(".loginLink").html("<p style='color:red;'>Error</p>");
          $("#section1").css({ display: "none" });
          $("#section2").css({ display: "none" });
        }
      });
    } else {
      //does not match error
      console.log("Password does not match");
    }
  });
});
