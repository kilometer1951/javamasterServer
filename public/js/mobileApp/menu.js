$(document).ready(function() {
  //ajax request to get menu
  document.querySelector(".loader").style.display = "block";
  $(".menu").html("");
  $.get("/api/mainCategory").then(results => {
    document.querySelector(".loader").style.display = "none";
    results.forEach(function(result, indx) {
      const html = `

      <div class="menu-list">
        <div class="menu-text">
          <h2>${result.mainCategory}</h2>
        </div>
        <div class="menu-content">
         ${displayCategories(result)}
        </div>
      </div>`;
      $(".menu").append(html);
    });
  });
});

$(document).on("click", ".addtocart", function(e) {
  const productID = $(this).attr("id");
  const arr = [];
  const optionSelected = document.getElementsByClassName("optionSelected");
  const productPrice = $("#productPrice").val();
  const productDiscount = $("#productDiscount").val();
  for (var i = 0; i < optionSelected.length; i++) {
    if (optionSelected[i].value !== "null") {
      const data = {
        optionName: optionSelected[i].getAttribute("id"),
        optionContent: optionSelected[i].value
      };
      arr.push(data);
    }
  }
  const cartID = $("#cartInputID").val();
  $(".addtocart").css({ display: "none" });
  $(".goToCart").css({ display: "inline" });
  //$(".cartItemAdded").css({ display: "inline" });
  $("#cartImg").attr("src", "/images/icons/cartHasItem.png");

  //addToCart;
  $.post("/api/addToCart/", {
    productID,
    cartID,
    arr,
    productPrice,
    productDiscount
  }).then(result => {
    //send id to productId input field
    //console.log(result);
    //change icon to green
  });
});

function displayCategories(result) {
  return result.subCategory.map(function(subCat) {
    return `<div onclick="openProduct('${result.mainCategory}','${subCat.name}')">
                    <span>${subCat.name}</span>
                    <span style="float:right;">+</span>
              </div>`;
  });
}

function openProduct(mainCategory, subCat) {
  document.querySelector(".goToCart").style.display = "none";

  document.querySelector("#appBody").style.backgroundColor = "#fff";
  document.querySelector(".products-section").style.display = "block";
  document.querySelector(".menu").style.display = "none";
  document.querySelector(".product-details").style.display = "none";
  document.querySelector(".sideMenu").style.display = "none";
  document.querySelector(".account").style.display = "none";

  document.querySelector(".loader").style.display = "block";
  //show page loader and display data then remove page loader
  document.querySelector(".productMainCatName").innerHTML = mainCategory;
  document.querySelector(".productSubCatName").innerHTML = subCat;

  $("#productData").html("");

  $.get("/api/products/" + subCat).then(results => {
    document.querySelector(".loader").style.display = "none";
    results.forEach(function(result, indx) {
      const html = `
      <div class="col-md-6" >
         <div class="product-box" >
           <div class="product-img-div" onclick="openProductDetail('${result._id}', '${result.name}')">
             <img src="${result.image}" id="productDeatilImage${result._id}">
           </div>
            <div class="product-content">
              <span>${result.name} </span>
            </div>
         </div>
      </div>
    `;
      $("#productData").append(html);
    });
  });
}

function openProductDetail(id, productDetailName) {
  document.querySelector(".goToCart").style.display = "none";

  //const image = $("#productDeatilImage" + id).attr("src");
  document.querySelector(".products-section").style.display = "none";
  document.querySelector(".product-details").style.display = "none";
  document.querySelector(".featured").style.display = "none";
  document.querySelector(".sideMenu").style.display = "none";
  document.querySelector(".account").style.display = "none";

  document.querySelector(".productDetailName").innerHTML = productDetailName;
  document.querySelector(".loader").style.display = "block";
  $.get("/api/display/products/" + id).then(result => {
    document.querySelector(".loader").style.display = "none";
    document.querySelector(".product-details").style.display = "block";
    document.querySelector(".productDetailDataSection").style.display = "block";
    $("#productImage").attr("src", result.products.image);
    $("#description").text(result.products.description);
    $(".addtocart").attr("id", result.products._id);
    $("#productPrice").val(result.products.price);
    $("#productDiscount").val(result.products.discount);

    if (result.user) {
      if (result.cartHasItem) {
        $("#cartInputID").val(result.cartID._id);
      }
      if (result.hasItem) {
        $(".cartItemAdded").css({ display: "inline" });
        $(".addtocart").css({ display: "none" });
      } else {
        $(".cartItemAdded").css({ display: "none" });

        $(".addtocart").css({ display: "inline" });
      }
    } else {
      $(".signupBeforeAddToCart").css({ display: "inline" });
    }

    //display option
    $(".options").html("");
    result.products.option.forEach(function(data) {
      const html = `<div class="form-group" style="margin-top:10px;border-bottom:1px solid #000;padding-top:20px;padding-bottom:20px;">
         <div class="row">
           <div class="col-md-6" style="float:left;">
             <span>${data.OptionName_id.optionName}:</span>
           </div>
           <div class="col-md-6">
             <select style="float:right;width:450px;" class="optionSelected" id="${
               data.OptionName_id.optionName
             }">
                 <option value="null">Select</option>
                 ${displayOptionContent(data.OptionName_id)}
             </select>
           </div>
         </div>
       </div>`;
      $(".options").append(html);
    });
  });
}

function navigateToFeatured() {
  document.querySelector(".goToCart").style.display = "none";

  document.querySelector(".products-section").style.display = "none";
  document.querySelector(".menu").style.display = "none";
  document.querySelector(".product-details").style.display = "none";
  document.querySelector(".reviewOrder").style.display = "none";
  document.querySelector(".receipt").style.display = "none";
  document.querySelector(".sideMenu").style.display = "none";
  document.querySelector(".account").style.display = "none";

  document.querySelector(".featured").style.display = "block";
  document.querySelector(".loader").style.display = "block";

  //fetch fetured products
  $(".featured").html("");
  $.get("/api/featured/").then(results => {
    $(".featured").html("");
    document.querySelector(".loader").style.display = "none";
    results.forEach(function(result, indx) {
      const html = `
      <div style="margin-bottom:30px;" onclick="openProductDetail('${result._id}', '${result.name}')">
        <img src="${result.image}" style="width:100%;max-height:800px;" />
        <div style="text-align:center;margin-top:20px;font-size:3em;font-family:boldFont">
          <span>${result.name}</span>
        </div>
      </div>
    `;
      $(".featured").append(html);
    });
  });
}

function navigateToCart() {
  // document.querySelector(".splash-screen").style.display = "none";
  document.querySelector(".products-section").style.display = "none";
  document.querySelector(".goToCart").style.display = "none";
  document.querySelector(".product-footer").style.display = "block";
  document.querySelector(".aboutUs").style.display = "none";

  document.querySelector(".menu").style.display = "none";
  document.querySelector(".product-details").style.display = "none";
  document.querySelector(".featured").style.display = "none";
  document.querySelector(".receipt").style.display = "none";
  document.querySelector(".sideMenu").style.display = "none";
  document.querySelector(".account").style.display = "none";

  document.querySelector(".reviewOrder").style.display = "block";
  document.querySelector(".loader").style.display = "block";

  $("#noDataInCartDiv").css({ display: "none" });
  //fetch cart
  $.get("/api/cart/").then(results => {
    $(".reviewOrderData").html("");

    document.querySelector(".loader").style.display = "none";
    if (results.length !== 0) {
      if (results[0].items.length !== 0) {
        results[0].items.forEach(function(result, indx) {
          $(".checkOut").attr("id", results[0]._id);
          const html = `
          <div class="col-md-12" style="margin-bottom:20px;padding:50px;border-bottom:1px solid #bdbdbd;" id="itemDiv${
            result._id
          }">
            <div class="row">
              <div class="col-md-3">
                <img src="${
                  result.product.image
                }" style="max-width:200px;max-height:300px;border-radius: 20px;">
              </div>
              <div class="col-md-6">
                 <p style="font-weight:bolder;">${result.product.name}</p>
                 ${displayCartOptions(result.optionSelected, result._id)}
                 <div id="editOptionDiv${
                   result._id
                 }" style="display:none;"></div>
                 <button class="updateCartOption" onclick="updateCartOption('${
                   results[0]._id
                 }', '${result._id}')" id="updateCartOptionBtn${
            result._id
          }">Update</button>
                 <p id="cartActionBTNS${result._id}">
                   <img src="/images/icons/add.png" style="width:60px;margin-right:20px;" class="increment" onclick="updateCart('inc', '${
                     result.product._id
                   }', '${results[0]._id}')">
                   <img src="/images/icons/minus.png" style="width:60px;margin-right:20px;" class="decrement" onclick="updateCart('dec', '${
                     result.product._id
                   }', '${results[0]._id}')" />
                   <img src="/images/icons/del.png" style="width:60px;margin-right:20px;" class="deleteItem" onclick="deleteCartItem('${
                     results[0]._id
                   }', '${result._id}')"/>
                   <a onclick="showEdit('${result._id}','${
            result.product._id
          }', '${results[0]._id}')" style="display:none;">Edit</a>
                 </p>
              </div>
              <div class="col-md-3">
                 <p id="cartPrice${result.product._id}">$${result.price}</p>
                 <p id="cartPriceTotal${
                   result.product._id
                 }" style="display:none;" class="cartPriceTotal">${
            result.price
          }</p>
              </div>
            </div>
            <input type="hidden" id="cartQty${result.product._id}" value="${
            result.qty
          }"/>
          <input type="hidden" id="originalPrice${result.product._id}" value="${
            result.price
          }"/>
          </div>
        `;

          $(".reviewOrderData").append(html);
        });
        $("#noDataInCartDiv").css({ display: "none" });
        $("#reviewOrderTotalSection").css({ display: "block" });

        displayTotalPrice();
        //console.log();
      } else {
        $("#reviewOrderTotalSection").css({ display: "none" });

        $("#noDataInCartDiv").css({ display: "block" });
      }
    } else {
      $("#reviewOrderTotalSection").css({ display: "none" });

      $("#noDataInCartDiv").css({ display: "block" });
    }
  });
}

// function showEdit(itemID, productID, cartID) {
//   $("#cartActionBTNS" + itemID).css({ display: "none" });
//   $("#editOptionDiv" + itemID).css({ display: "block" });
//   $("#updateCartOptionBtn" + itemID).css({ display: "inline" });
//   $(".cartOptionSpan" + itemID).css({ display: "none" });
//
//   //get cart options
//   $.get("/api/edit/" + itemID + "/" + productID + "/" + cartID).then(
//     results => {
//       let value = "";
//       // for (var i = 0; i < results.cart.optionSelected.length; i++) {
//       //   value = results.cart.optionSelected[i];
//       // }
//       //console.log(value.optionContent);
//       results.product.option.forEach(function(result) {
//         const html = `<p>${result.OptionName_id.optionName}</p>
//         <select
//           style="float:right;width:450px;font-size:2.5em;margin-bottom:10px;"
//           class="editSelectedOption">
//           <option value="null">Select</option>
//           ${displayEditOption(result, results.cart)}
//         </select>`;
//         $("#editOptionDiv" + itemID).append(html);
//       });
//     }
//   );
// }

// function updateCartOption(cartID, itemID) {
//   const editSelectedOption = document.getElementsByClassName(
//     "editSelectedOption"
//   );
//   const arr = [];
//   for (var i = 0; i < editSelectedOption.length; i++) {
//     if (editSelectedOption[i].value !== "null") {
//       const data = {
//         optionName: editSelectedOption[i].getAttribute("id"),
//         optionContent: editSelectedOption[i].value
//       };
//       arr.push(data);
//     }
//   }
//   //console.log(arr);
//   $.post("/api/updateCartOption/", {
//     arr,
//     cartID,
//     itemID
//   }).then(result => {
//     console.log(result);
//   });
// }

function displayEditOption(result, cart) {
  return result.OptionName_id.optionContent.map(function(result, ind) {
    return `<option value="${result.name}">${result.name}</option>`;
  });
}

function updateCart(action, productID, cartID) {
  var cartQty = parseInt($("#cartQty" + productID).val());
  var cartPrice = parseFloat($("#originalPrice" + productID).val());
  if (action === "inc") {
    //update value
    var inc = cartQty + 1;
    var totalPricePerItem = (cartPrice * inc).toFixed(2);
    $("#cartQty" + productID).val(inc);
    $("#cartPrice" + productID).text("$" + totalPricePerItem);
    $("#cartPriceTotal" + productID).text(totalPricePerItem);

    //display success Modal
    $(".updateMessage").css({ display: "block" });
    setTimeout(function() {
      $(".updateMessage").css({ display: "none" });
    }, 1000);
    $.post("/api/updateCart/", {
      action,
      totalPricePerItem,
      productID,
      cartID
    }).then(result => {
      console.log(result);
    });
    displayTotalPrice();
  }
  if (action === "dec") {
    var dec = cartQty - 1;
    if (dec >= 1) {
      var totalPricePerItem = (cartPrice * dec).toFixed(2);
      $("#cartQty" + productID).val(dec);
      $("#cartPrice" + productID).text("$" + totalPricePerItem);
      $("#cartPriceTotal" + productID).text(totalPricePerItem);
      //update cart
      //display success Modal
      $(".updateMessage").css({ display: "block" });
      setTimeout(function() {
        $(".updateMessage").css({ display: "none" });
      }, 1000);
      $.post("/api/updateCart/", {
        action,
        totalPricePerItem,
        productID,
        cartID
      }).then(result => {
        console.log(result);
      });
    }
  }
  displayTotalPrice();
}

function deleteCartItem(cartID, itemID) {
  //Delete Cart
  $.post("/api/deleteCartItem", {
    cartID,
    itemID
  }).then(result => {
    //console.log(itemID);
    $("#itemDiv" + itemID).remove();

    displayTotalPrice();
    if (result[0].items.length === 0) {
      $("#reviewOrderTotalSection").css({ display: "none" });
      $("#noDataInCartDiv").css({ display: "block" });
      $("#cartImg").attr("src", "/images/icons/cartHasNoItem.png");
    }
  });
  displayTotalPrice();
}

function displayTotalPrice() {
  var subTotal = 0;
  var g = document.getElementsByClassName("cartPriceTotal");
  for (var i = 0; i < g.length; i++) {
    subTotal += parseFloat(g[i].innerHTML);
  }

  var fee = subTotal + (0.029 + 0.3);
  const stripeFee = numberWithCommas((fee - subTotal).toFixed(2));

  var tax = numberWithCommas((0.1 * subTotal).toFixed(2));

  $("#reviewOrderSubTotal").text(
    "Subtotal...............................................$" + subTotal
  );
  if (stripeFee >= 1) {
    $("#reviewOrderFee").text(
      "Fee..........................................................$" +
        stripeFee
    );
  } else {
    $("#reviewOrderFee").text(
      "Fee............................................................¢" +
        stripeFee
    );
  }

  if (tax >= 1) {
    $("#reviewOrderTax").text(
      "Tax 10%.....................................................$" + tax
    );
  } else {
    $("#reviewOrderTax").text(
      "Tax 10%......................................................¢" + tax
    );
  }

  const total = (
    parseFloat(subTotal) +
    parseFloat(stripeFee) +
    parseFloat(tax)
  ).toFixed(2);
  $("#reviewOrderTotal").text("Total.....................$" + total);
  $(".checkOut").text("Checkout: $" + total);
  // $(".proceedToCheckout").text(
  //   `Proceed to checkout ($${numberWithCommas(totalPrice.toFixed(2))}) `
  // );
}
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$(document).on("click", ".checkOut", function(e) {
  const cartID = $(this).attr("id");
  console.log(cartID);
  var subTotal = 0;
  var g = document.getElementsByClassName("cartPriceTotal");
  for (var i = 0; i < g.length; i++) {
    subTotal += parseFloat(g[i].innerHTML);
  }

  var fee = subTotal + (0.029 + 0.3);
  const stripeFee = numberWithCommas((fee - subTotal).toFixed(2));

  var tax = numberWithCommas((0.1 * subTotal).toFixed(2));
  const total = (
    parseFloat(subTotal) +
    parseFloat(stripeFee) +
    parseFloat(tax)
  ).toFixed(2);

  window.location.href =
    "/mobileApp/payment/" +
    subTotal +
    "/" +
    stripeFee +
    "/" +
    tax +
    "/" +
    total +
    "/" +
    cartID;
});

function navigateToMenu() {
  document.querySelector(".goToCart").style.display = "none";

  // document.querySelector(".splash-screen").style.display = "none";
  document.querySelector(".products-section").style.display = "none";
  document.querySelector(".product-details").style.display = "none";
  document.querySelector(".featured").style.display = "none";
  document.querySelector(".reviewOrder").style.display = "none";
  document.querySelector(".sideMenu").style.display = "none";
  document.querySelector(".receipt").style.display = "none";
  document.querySelector(".account").style.display = "none";

  document.querySelector(".menu").style.display = "block";
}

function navigateToReceipt() {
  document.querySelector(".goToCart").style.display = "none";

  // document.querySelector(".splash-screen").style.display = "none";
  document.querySelector(".products-section").style.display = "none";
  document.querySelector(".menu").style.display = "none";
  document.querySelector(".sideMenu").style.display = "none";
  document.querySelector(".product-details").style.display = "none";
  document.querySelector(".featured").style.display = "none";
  document.querySelector(".reviewOrder").style.display = "none";
  document.querySelector(".receipt").style.display = "none";
  document.querySelector(".loader").style.display = "block";
  document.querySelector(".account").style.display = "none";

  document.querySelector(".sideMenu").style.display = "none";
  //fetch cart
  $.get("/api/receipt/").then(results => {
    $(".receipt").html("");
    document.querySelector(".receipt").style.display = "block";

    document.querySelector(".loader").style.display = "none";
    results.forEach(function(result, indx) {
      const html = `
      <div class="col-md-12" style="margin-bottom:90px;margin-top:50px;">
        <span style="font-size:2.5em;margin-left:40px;">${moment(
          result.dateAdded
        ).format("MMMM DD, YYYY")}</span>
        <div class="row">
        ${displayItem(result)}
        </div>
        <div style="margin-top:50px;margin-bottom:20px;margin-left:35px;">
          <span style="font-size:2.2em;">Subtotal............................$${
            result.subTotal
          }</span><br/>
          <span style="font-size:2.2em;display:none;">Fee............................................$${
            result.stripeFee
          }</span><br/>
          <span style="font-size:2.2em;">Tax 10.5%............................$${
            result.tax
          }</span><br/>
          <span style="font-size:2.2em;">Total.......................................$${
            result.total
          }</span>
        </div>
      </div>
      <hr style="border:3px solid #000;" />
      `;
      $(".receipt").append(html);
    });
  });
}

function displayItem(result) {
  return result.items.map(function(item) {
    return `<div class="col-md-12" style="margin-bottom:20px;padding:50px;border-bottom:1px solid #bdbdbd;">
      <div class="row">
        <div class="col-md-3">
          <img src="${
            item.product.image
          }" style="max-width:200px;height:200px;border-radius: 20px;">
        </div>
        <div class="col-md-6">
           <span style="font-size:2.5em;">${item.product.name}</span><br/>
           ${displayOption(item)}
        </div>
        <div class="col-md-3">
           <span style="font-size:2.5em;">$${item.price}</span>
        </div>
      </div>
    </div>`;
  });
}

function openSideMenu() {
  document.querySelector(".goToCart").style.display = "none";

  var x = document.querySelector(".sideMenu");
  if (x.style.display === "none") {
    // // document.querySelector(".splash-screen").style.display = "none";
    // document.querySelector(".products-section").style.display = "none";
    // document.querySelector(".product-details").style.display = "none";
    // document.querySelector(".featured").style.display = "none";
    // document.querySelector(".reviewOrder").style.display = "none";
    // document.querySelector(".receipt").style.display = "none";
    // document.querySelector(".menu").style.display = "none";
    document.querySelector(".product-footer").style.display = "none";
    document.querySelector(".sideMenu").style.display = "block";
  } else {
    // // document.querySelector(".splash-screen").style.display = "none";
    // document.querySelector(".products-section").style.display = "none";
    // document.querySelector(".product-details").style.display = "none";
    // document.querySelector(".featured").style.display = "none";
    // document.querySelector(".reviewOrder").style.display = "none";
    // document.querySelector(".receipt").style.display = "none";
    // document.querySelector(".menu").style.display = "block";
    document.querySelector(".goToCart").style.display = "none";

    document.querySelector(".product-footer").style.display = "block";
    document.querySelector(".sideMenu").style.display = "none";
  }
}

function displayOption(item) {
  return item.optionSelected.map(function(option) {
    return ` <span style="font-size:2.5em;">${option.optionContent}</span><br/>`;
  });
}

function displayCartOptions(results, itemID) {
  return results.map(function(result) {
    return `<span style="font-size:2.5em;" class="cartOptionSpan${itemID}">${result.optionContent}</span><br/>`;
  });
}

function openAboutUs() {
  document.querySelector(".goToCart").style.display = "none";

  document.querySelector(".sideMenu").style.display = "none";
  document.querySelector(".aboutUs").style.display = "block";
}

function openAccount() {
  document.querySelector(".goToCart").style.display = "none";

  document.querySelector(".products-section").style.display = "none";
  document.querySelector(".product-details").style.display = "none";
  document.querySelector(".featured").style.display = "none";
  document.querySelector(".reviewOrder").style.display = "none";
  document.querySelector(".receipt").style.display = "none";
  document.querySelector(".menu").style.display = "none";

  document.querySelector(".product-footer").style.display = "block";
  document.querySelector(".sideMenu").style.display = "none";
  document.querySelector(".account").style.display = "block";
  document.querySelector(".loader").style.display = "block";
  $("#accountData").html("");
  //get account info
  $.get("/api/accountInfo/").then(result => {
    document.querySelector(".loader").style.display = "none";

    //send info to page
    const html = `<div class="row">
      <div class="col-md-12">
      <div class="aError" style="background-color:#e65100;color:#fff;border-radius:10px;font-size:3em;"></div>
        <input type="text" id="updateName" class="accountFields"  placeholder="Name" value="${result.name}">
      </div>
      <div class="col-md-12">
        <input type="email" id="updateEmail" class="accountFields"  placeholder="Email" value="${result.email}">
      </div>
      <div class="col-md-12">
        <input type="password" id="updatePassword" class="accountFields" placeholder="New Password">
      </div>
      <div class="col-md-12">
        <input type="password" id="cpassword" class="accountFields"  placeholder="Re-Enter Password">
      </div>
    </div>
    <button type="submit" class="updateAccountBtn" onclick="UpdateAccountInfo()">Save</button>`;
    $("#accountData").append(html);
  });
}

function UpdateAccountInfo() {
  const updateName = $("#updateName").val();
  const updateEmail = $("#updateEmail").val();
  const updatePassword = $("#updatePassword").val();
  const cpassword = $("#cpassword").val();

  if (updatePassword !== "") {
    if (updatePassword !== cpassword) {
      $(".aError").text("Password does not match");
    } else {
      $(".aError").css({ display: none });
      $(".updateMessage").html(
        '<span><i class="fa fa-check-circle"></i> Account Updated</span>'
      );
      $(".updateMessage").css({ "z-index": 1 });

      $(".updateMessage").css({ display: "block" });
      setTimeout(function() {
        $(".updateMessage").css({ display: "none" });
      }, 1000);
      $.post("/api/updateAccount", {
        updateName,
        updateEmail,
        updatePassword
      });
    }
  } else {
    $(".aError").css({ display: "none" });
    $(".updateMessage").html(
      '<span><i class="fa fa-check-circle"></i> Account Updated</span>'
    );
    $(".updateMessage").css({ "z-index": 1 });

    $(".updateMessage").css({ display: "block" });
    setTimeout(function() {
      $(".updateMessage").css({ display: "none" });
    }, 1000);
    $.post("/api/updateAccount", {
      updateName,
      updateEmail,
      updatePassword
    });
  }
}

function closeAboutUs() {
  document.querySelector(".goToCart").style.display = "none";

  document.querySelector(".aboutUs").style.display = "none";

  document.querySelector(".sideMenu").style.display = "block";
}

function displayOptionContent(results) {
  return results.optionContent.map(function(result) {
    return `<option value="${result.name}">${result.name}</option>`;
  });
}

function closeProductDetails() {
  document.querySelector(".product-details").style.display = "none";
  document.querySelector(".products-section").style.display = "block";
}
