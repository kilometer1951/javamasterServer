$(document).ready(function() {
  //render product data
  $.get("/api/products", function(data) {
    data.products.forEach(function(result, indx) {
      const products = `<div class="col-md-3" style="margin-bottom:10px;">
            <div class="product-box">
               <div class="product-img-div">
                 <img src="${result.image}" alt="">
               </div>
               <div class="product-text-div">
               <p>${result.category.name}</p>
                 <p><span id="productName${result._id}">${result.name}  ${
        result.discountIsApplied ? "- " + result.discount + "% OFF" : ""
      }</span> (${result.calories} cal) </p>
                 <p style="color:#3F729B;display:none;">Price - $<span id="productPrice${
                   result._id
                 }" >${displayPrice(
        result.discountIsApplied,
        result.discount,
        result.price
      )}</span></p>
               </div>
               <div class="addtocart-button-div">
                 <button type="button" name="button" class="addtocart-btn removeAddCart${
                   result._id
                 }" id="${
        result._id
      }"><i class="fas fa-plus"></i> Add to cart ($${displayPrice(
        result.discountIsApplied,
        result.discount,
        result.price
      )})</button>
      <div style="display:none" class="discount-div">
        <p id="discountIsApplied${result._id}">${result.discountIsApplied}</p>
        <p id="discount${result._id}">${result.discount}</p>
      </div>
           <button type="button" name="button" class="viewCart-btn displayViewCart${
             result._id
           }" style="display:none;"> View Cart</button>

               </div>
            </div>
        </div>`;
      $("#products").append(products);
      //console.log(result);
    });
  });
  $(document).on("click", ".viewCart-btn", function() {
    $("#openCart").trigger("click");
  });
  //addToCart
  $(document).on("click", ".addtocart-btn", function() {
    const id = $(this).attr("id");
    const price = $("#productPrice" + id).text();
    const discountIsApplied = $("#discountIsApplied" + id).text();
    const discount = $("#discount" + id).text();
    const product = id;

    $.post("/api/addToCart", {
      product,
      price,
      discountIsApplied,
      discount
    }).then(result => {
      if (result.error) {
        //  user has not been autnticated open login modal and display error message
        $(".signupSection").css({ display: "block" });
        $(".loginSection").css({ display: "none" });
        $(".auth-modal-text").text("Signup");
        $(".auth-modal").modal();
      } else {
        $(".removeAddCart" + id).css({ display: "none" });
        $(".displayViewCart" + id).css({ display: "block" });
        $(".cartNumber").attr("data-badge", result[0].items.length);
        //display toast
        var x = document.getElementById("snackbar");
        x.className = "show";
        setTimeout(function() {
          x.className = x.className.replace("show", "");
        }, 3000);
      }
    });
  });
  $(document).on("click", ".addtocart-promotion-btn", function() {
    const id = $(this).attr("id");
    const price = $("#productPrice1" + id).text();
    const discountIsApplied = $("#discountIsApplied1" + id).text();
    const discount = $("#discount1" + id).text();
    const product = id;

    $.post("/api/addToCart", {
      product,
      price,
      discountIsApplied,
      discount
    }).then(result => {
      if (result.error) {
        //  user has not been autnticated open login modal and display error message
        $(".signupSection").css({ display: "block" });
        $(".loginSection").css({ display: "none" });
        $(".auth-modal-text").text("Signup");
        $(".auth-modal").modal();
      } else {
        $(".promotion-btn" + id).css({ display: "none" });
        $(".cartNumber").attr("data-badge", result[0].items.length);
        //display toast
        var x = document.getElementById("snackbar");
        x.className = "show";
        setTimeout(function() {
          x.className = x.className.replace("show", "");
        }, 3000);
      }
    });
  });
  $(document).on("click", "#openCart", function() {
    //ajax call to get cart data
    $("#cart-modal").modal();
    fetchCart((displayCheckOutMessage = false));
  });
});
function fetchCart(displayCheckOutMessage) {
  $.get("/api/fetchCart").then(result => {
    //  console.log(result);
    //$(".checkout_btn").css({ display: "block" });
    //$(".loading_bar").css({ display: "none" });
    var length = result.length ? result[0].items.length : 0;
    if (length === 0) {
      //no data in cart
      !displayCheckOutMessage
        ? $(".loading_bar").css({ display: "none" })
        : $(".loading_bar p").text(
            "Checkout success your order has been submited"
          );
      $("#cart-data").html("");
      const noData = `<div class="col-md-12 noitems" style="text-align:center;margin-top:7vh;color:#9e9e9e;">
                          <h2 style="font-family: 'Lora', serif;"><i class="fas fa-cart-plus"></i> Cart is Empty</h2>
                        </div>`;
      $("#cart-data").append(noData);
    } else {
      //   //cart has data
      $(".checkout-progress").css({ display: "block" });
      $(".checkout-heading-div").css({ display: "block" });
      $(".checkout-footer").css({ display: "block" });
      $(".cartTotal").css({ display: "block" });
      //   // //  console.log(result[0].items);
      //   // $(".cart_content").html("");
      //
      $(".loading_bar").css({ display: "none" });
      $("#cart-data").html("");
      result[0].items.forEach(function(cart) {
        cartHTML(cart, result);
      });
    }
  });
}
function cartHTML(cart, result) {
  const cartData = `
  <p id="cartCheckoutId" style="display:none;">${result[0]._id}</p>
              <div class="row">
                <div class="col-md-12" id="itemDiv${cart.products._id}">
                  <div class="row">
                    <div class="col-md-4">
                       <p>${cart.products.name}</p>
                    </div>
                    <div class="col-md-6">
                       <form>
                         <button type="button" onclick="cartOperation('${
                           result[0]._id
                         }', '${cart.products._id}', '${
    cart._id
  }','inc')">+</button>
                         <input type="number" class="cartQty" disabled min="0" value="${
                           cart.qty
                         }" id="cartQty${cart.products._id}"/>
                         <button type="button" onclick="cartOperation('${
                           result[0]._id
                         }', '${cart.products._id}', '${
    cart._id
  }','dec')">-</button>
                         $<span class="cartPrice" id="cartPrice${
                           cart.products._id
                         }">${cart.price}</span>
                       </form>
                    </div>
                    <div class="col-md-2">
                       <button onclick="deleteCartItems('${result[0]._id}', '${
    cart.products._id
  }','${cart._id}', 'del')">X</button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="invisible-divs" style="display:none;">
              <span  id="originalPrice${cart.products._id}">${
    cart.products.price
  }</span>
               </div>

  `;
  $("#cart-data").append(cartData);
  displayTotalPrice();
}
function cartOperation(cartId, productId, itemId, actionType) {
  //console.log(cartId, productId, itemId, actionType);
  var cartQty = parseInt($("#cartQty" + productId).val());
  var cartPrice = parseFloat($("#originalPrice" + productId).text());
  if (actionType === "inc") {
    var inc = cartQty + 1;
    var totalPricePerItem = (cartPrice * inc).toFixed(2);
    $("#cartQty" + productId).val(inc);
    $("#cartPrice" + productId).text(totalPricePerItem);
    //update cart
    updateCart(actionType, totalPricePerItem, cartId, productId, itemId);
  }
  if (actionType === "dec") {
    //var cartQty = parseInt($("#cartQty" + productId).val());
    var dec = cartQty - 1;
    if (dec >= 1) {
      var totalPricePerItem = (cartPrice * dec).toFixed(2);
      $("#cartQty" + productId).val(dec);
      $("#cartPrice" + productId).text(totalPricePerItem);
      //update cart
      updateCart(actionType, totalPricePerItem, cartId, productId, itemId);
    }
    //console.log(cartId, productId, actionType);
  }
  //Delete Cart
  // if (actionType === "del") {
  //   if (actionType === "del") {
  //     updateCart(actionType, totalPricePerItem, cartId, productId, itemId);
  //   }
  // }
}
function deleteCartItems(cartId, productId, itemId, actionType = "del") {
  $.post("/api/updateCart", {
    actionType,
    cartId,
    productId,
    itemId
  }).then(result => {
    $("#itemDiv" + productId).remove();
    var cartNumber = parseInt($(".cartNumber").attr("data-badge")) - 1;
    $(".cartNumber").attr("data-badge", cartNumber);
    displayTotalPrice();
    if (result[0].items.length === 0) {
      //no data in cart
      // $(".close_cartbtn").css({ display: "block" });
      // $(".checkout_btn").css({ display: "none" });
      // $(".loading_bar").css({ display: "none" });
      // $(".noitems").css({ display: "block" });
      //$(".modal-body").html("No data in Cart");
      window.location.href = "/product";
    }
  });
}
function updateCart(actionType, totalPricePerItem, cartId, productId, itemId) {
  $.post("/api/updateCart", {
    actionType,
    totalPricePerItem,
    cartId,
    productId
  }).then(result => {
    console.log(itemId);
    //remove html conent and render content from db to ensure correct data
    $("#cart-data").html("");
    //console.log(result);
    result[0].items.forEach(function(cart) {
      cartHTML(cart, result);
    });
    displayTotalPrice();
  });
}
function close_cart() {
  $("#cart-modal").modal("hide");
}
function displayPrice(discountIsApplied, discount, price) {
  if (discountIsApplied) {
    const newDiscount = parseFloat((discount / 100) * price).toFixed(2);
    const newPrice = parseFloat(price - newDiscount).toFixed(2);
    return newPrice;
  } else {
    return price;
  }
}
//checkout
$(document).on("click", ".checkout", function(e) {
  //checkout
  const priceTotal = parseFloat(displayTotalCheckoutPrice());
  const stripePriceTotal = parseFloat(displayTotalCheckoutPrice()) * 100;
  var email = $("#email").val();
  var fname = $("#fname").val();
  var lname = $("#lname").val();
  const handler = StripeCheckout.configure({
    key: "pk_test_HR6sgMddOlVwJ7AwqvR8Wu0e",
    image: "https://stripe.com/img/documentation/checkout/marketplace.png",
    locale: "auto",
    token: function(token) {
      //display loader
      $(".checkout-progress").css({ display: "none" });
      $(".close_cartbtn").css({ display: "none" });
      $(".checkout-heading-div").css({ display: "none" });
      $("#cart-data").css({ display: "none" });
      $(".cartTotal").css({ display: "none" });
      $(".checkout-footer").css({ display: "none" });
      $("#cart-details").css({ display: "none" });
      $(".loading_bar").css({ display: "block" });
      $(".loading_bar p").text(
        "Please wait a moment while we process your payment"
      );

      var token = token.id;
      $.post("/api/checkout", {
        token,
        email: email,
        fname: fname,
        lname: lname,
        priceTotal,
        stripePriceTotal
      }).then(result => {
        if (result.message === "success") {
          $(".loading_bar img").css({ display: "none" });
          $(".loading_bar p").text(
            "Checkout success your order has been submited"
          );
          $(".close_cartbtn").css({ display: "block" });
          $("#cart-data").css({ display: "block" });
          $(".cartNumber").attr("data-badge", 0);
          //get cartid and send to socket
          var socket = io();
          socket.emit("newOrder", $("#cartCheckoutId").text());
          fetchCart((displayCheckOutMessage = true));

          //refresh page after 10 seconds
          setTimeout(function() {
            location.reload();
          }, 3000);
        } else {
          alert("error payment not processed");
        }
      });
    }
  });

  document.getElementById("customButton");
  // Open Checkout with further options:
  console.log(priceTotal);

  console.log(priceTotal);
  handler.open({
    name: "drinkcoffee.com",
    description: "Drink Coffee Purchase",
    zipCode: true,
    amount: stripePriceTotal,
    email: email
  });
  e.preventDefault();

  // Close Checkout on page navigation:
  window.addEventListener("popstate", function() {
    handler.close();
  });
});
function displayTotalPrice() {
  var totalPrice = 0;
  var g = document.getElementsByClassName("cartPrice");
  for (var i = 0; i < g.length; i++) {
    totalPrice += parseFloat(g[i].innerHTML);
  }

  $(".cartTotal").text("Total: $" + numberWithCommas(totalPrice.toFixed(2)));
  $(".proceedToCheckout").text(
    `Proceed to checkout ($${numberWithCommas(totalPrice.toFixed(2))}) `
  );
}

function displayTotalCheckoutPrice() {
  var totalPrice = 0;
  var g = document.getElementsByClassName("cartPrice");
  for (var i = 0; i < g.length; i++) {
    totalPrice += parseFloat(g[i].innerHTML);
  }

  return numberWithCommas(totalPrice.toFixed(2));
}
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$(document).on("click", ".proceedToCheckout", function() {
  $(".step1").css({ background: "#fff", color: "#000" });
  $(".step2").css({ background: "blue", color: "#fff" });
  $(".proceedToCheckout").css({ display: "none" });
  $(".backBtn").css({ display: "inline-block" });
  $(".checkout").css({ display: "inline-block" });
  $("#cart-data").css({ display: "none" });
  $("#cart-details").css({ display: "block" });
  $(".checkout-heading").text("Checkout");
});
$(document).on("click", ".backBtn", function() {
  $(".step1").css({ background: "blue", color: "#fff" });
  $(".step2").css({ background: "#fff", color: "#000" });
  $(".proceedToCheckout").css({ display: "inline-block" });
  $(".backBtn").css({ display: "none" });
  $(".checkout").css({ display: "none" });
  $("#cart-data").css({ display: "block" });
  $("#cart-details").css({ display: "none" });
  $(".checkout-heading").text("Cart Data");
});

$(document).on("click", ".test", function() {
  // var socket = io();
  // socket.emit("newOrder", $("#cartCheckoutId").text());
});
