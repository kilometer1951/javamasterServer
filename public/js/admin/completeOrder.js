$(document).ready(function() {
  var socket = io();
  socket.on("newOrder", function(msg) {
    //display new order toast and play sound
    var sound = new Audio("/audio/neworder.mp3");
    console.log(sound);
    var playPromise = sound.play();
    if (playPromise !== undefined) {
      playPromise
        .then(_ => {
          // Automatic playback started!
          // Show playing UI.
        })
        .catch(error => {
          // Auto-play was prevented
          // Show paused UI.
        });
    }
    //console.log(msg);
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function() {
      x.className = x.className.replace("show", "");
    }, 3000);
    //ajax request to get new order
    $.get("/adminApi/newIncomingOrder/" + msg).then(orders => {
      orders.forEach(function(order, indx) {
        var html = "";
        html += `<tr id="orders${order._id}">`;
        html += `<td>${order.user.name}</td>`;
        html += '<td style="background-color:blue;color:#fff;">';
        order.items.forEach(function(item, idx, array) {
          html += `${displayOrderItems(
            item.product.name,
            item.qty,
            idx,
            array
          )}`;
        });
        html += "</td>";
        html += `<td>$${numberWithCommas(
          parseFloat(order.total).toFixed(2)
        )}</td>`;
        html += `
        <td>
          <button type="button" name="button" id="${
            order._id
          }" class="btn btn-warning maximizeOrder" data-toggle="modal" data-target="#maximizeOrder-modal">Maximize order</button>
          <button type="button" name="button" id="${
            order._id
          }" class="btn btn-primary completeOrder">Complete Order</button>
        </td>`;
        html += `</tr>`;

        $("#orderTable").append(html);
      });
    });
  });

  $(document).on("click", ".completeOrder", function(e) {
    e.preventDefault();
    var orderID = $(this).attr("id");
    //alert(phonenumber);
    //ajax call to send message and update order to complete
    //$("#orders" + orderID).css({ display: "none" });
    $.post("/adminApi/completeOrder", {
      orderID
    }).then(result => {
      if (result.suc) {
        $("#orders" + orderID).css({ display: "none" });
        $(".orderSentMessage").html("<p>Order is complete</p>");
        setTimeout(function() {
          $(".orderSentMessage").html("");
        }, 5000);
        //display orderhas been updated
      }
    });
  });
  //toggle auth-modal
  $(document).on("click", ".maximizeOrder", function(e) {
    e.preventDefault();
    $("#maximizeOrder-tableBody").html("");
    var orderID = $(this).attr("id");

    $.get("/adminApi/maximizeOrder/" + orderID).then(order => {
      //console.log(order[0].user.fname);
      $(".modal-title").text("Order For - " + order[0].user.name);
      order[0].items.forEach(function(item) {
        const items = `<tr>
          <td>${item.product.name}</td>
          <td>${displayItemOptions(item)}</td>
          <td>${item.qty}</td>
          <td>$${item.price}</td>
        </tr>`;
        $("#maximizeOrder-tableBody").append(items);
      });
    });
  });
});

function displayItemOptions(item) {
  if (item.optionSelected.length === 0) {
    console.log(item.optionSelected.length);
    return "Null";
  } else {
    return item.optionSelected.map(function(result) {
      return result.optionContent;
    });
  }
}
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function displayOrderItems(str, qty, idx, array) {
  if (str !== "") {
    if (idx === array.length - 1) {
      return str + ":" + qty;
    }

    return str + ":" + qty + ",";
  } else {
    return str;
  }
}
