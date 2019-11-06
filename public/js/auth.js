function toggleToLogin() {
  document.querySelector("#footerText").innerHTML =
    'Already have an account? <span style="color:#000;" onclick="toggleToSignUp()">Login</span>';

  document.querySelector(".signin").style.display = "none";
  document.querySelector(".authLoginLogo").style.display = "none";
  document.querySelector(".authSignupTextDiv").style.display = "block";
  document.querySelector(".signup").style.display = "block";
}

function toggleToSignUp() {
  document.querySelector("#footerText").innerHTML =
    "Don't have an account? <span style='color:#000;' onclick='toggleToLogin()'>Signup</span>";

  document.querySelector(".signup").style.display = "none";
  document.querySelector(".authSignupTextDiv").style.display = "none";
  document.querySelector(".authLoginLogo").style.display = "inline";
  document.querySelector(".signin").style.display = "block";
}

$(".authBtnSignup").on("click", function(e) {
  e.preventDefault();
  //error hadling for input fields
  //check verification code

  const email = $("#sEmail").val();
  const name = $("#name").val();
  const password = $("#sPassword").val();

  //check validation
  if (email === "") {
    $(".sError").html(`<p>Email Required</p>`);
    return false;
  } else {
    if (validateEmail(email)) {
      $(".sError").html("");
    } else {
      $(".sError").html(`<p>Email Not Valid</p>`);
      return true;
    }
  }

  if (name === "") {
    $(".sError").html(`<p>Name Required</p>`);
    return false;
  } else {
    $(".sError").html("");
  }

  if (password === "") {
    $(".sError").html(`<p>Password Required</p>`);
    return false;
  } else {
    $(".sError").html("");
  }

  $(".authBtnSignup").html(
    '<span class="spinner-border" style="font-size:2em;"></span> Working on it'
  );

  $.post("/auth/signupauthentication", {
    email,
    name,
    password
  }).then(result => {
    //refresh page
    if (!result.suc) {
      $(".sError").html(`<p>Auth Error</p>`);
      $(".authBtnSignup").html("Create Account");
    } else {
      window.location.href = "/mobileApp/products";
    }
  });
});

$(".signinBtn").on("click", function(e) {
  e.preventDefault();
  //error hadling for input fields
  //check verification code

  const email = $("#lEmail").val();
  const password = $("#lPassword").val();

  //check validation
  if (email === "") {
    $(".lError").html(`<p>Email Required</p>`);
    return false;
  } else {
    if (validateEmail(email)) {
      $(".lError").html("");
    } else {
      $(".lError").html(`<p>Email Not Valid</p>`);
      return true;
    }
  }

  if (password === "") {
    $(".lError").html(`<p>Password Required</p>`);
    return false;
  } else {
    $(".lError").html("");
  }

  $(".signinBtn").html(
    '<span class="spinner-border" style="font-size:2em;"></span> Working on it'
  );

  $.post("/auth/loginauthentication", {
    email,
    password
  }).then(result => {
    //refresh page
    if (result.suc) {
      window.location.href = "/mobileApp/products";
    } else {
      $(".signinBtn").html("LOG IN");
      $(".lError").html(`<p>Wrong email or passowrd</p>`);
    }
  });
});

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// $(document).ready(function() {
//   //toggle auth-modal
//   $("#toggle-to-signup").on("click", function(e) {
//     $(".signupSection").css({ display: "block" });
//     $(".loginSection").css({ display: "none" });
//     $(".auth-modal-text").text("Signup");
//   });
//   $("#toggle-to-login").on("click", function(e) {
//     $(".signupSection").css({ display: "none" });
//     $(".loginSection").css({ display: "block" });
//     $(".auth-modal-text").text("Login");
//   });
//   $(".auth-modal-login").on("click", function(e) {
//     $(".signupSection").css({ display: "none" });
//     $(".loginSection").css({ display: "block" });
//     $(".auth-modal-text").text("Login");
//   });
//   $(".auth-modal-signup").on("click", function(e) {
//     $(".signupSection").css({ display: "block" });
//     $(".loginSection").css({ display: "none" });
//     $(".auth-modal-text").text("Signup");
//   });
//   //END
//
//   //send text Section
//   $("#sendVerificationCode").on("click", function(e) {
//     e.preventDefault();
//     //error hadling for input fields
//     //send verification code
//
//     $.post("/auth/sendVerification", { data: $("#phonenumber").val() }).then(
//       result => {
//         if (result.suc) {
//           //display verification section
//           $("#sendVerificationCode-div").css({ display: "none" });
//           $("#enterVerificationCode-div").css({ display: "block" });
//         }
//         if (result.userexist) {
//           return alert("user already exsit");
//         }
//         if (result.smserror) {
//           return alert("Error handling number");
//         }
//       }
//     );
//   });
//
//   $("#checkVerificationCode").on("click", function(e) {
//     e.preventDefault();
//     //error hadling for input fields
//     //check verification code
//     var data = {};
//     data.code1 = $("#code1").val();
//     data.code2 = $("#code2").val();
//     data.code3 = $("#code3").val();
//     data.phonenumber = $("#phonenumber").val();
//
//     $.post("/auth/checkVerificationCode", {
//       data
//     }).then(result => {
//       if (result) {
//         //display verification section
//         $("#sendVerificationCode-div").css({ display: "none" });
//         $("#enterVerificationCode-div").css({ display: "none" });
//         $("#password-div").css({ display: "block" });
//       } else {
//         alert("error code not correct");
//       }
//     });
//   });
//

//   $("#login").on("click", function(e) {
//     e.preventDefault();
//     //error hadling for input fields
//     //check verification code
//     const phonenumber = $("#phonenumber_login").val();
//     const password = $("#password_login").val();
//
//     $.post("/auth/loginauthentication", {
//       phonenumber: phonenumber,
//       password: password
//     }).then(result => {
//       if (result.suc) {
//         return (window.location.href = "/product");
//       } else {
//         return alert("error");
//       }
//     });
//   });
// });
//
// function moveCursor(fromTextBox, toTextBox) {
//   const length = fromTextBox.value.length;
//   const maxlength = fromTextBox.getAttribute("maxlength");
//   if (length == maxlength) {
//     document.getElementById(toTextBox).focus();
//   }
// }
