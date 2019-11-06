$(document).ready(function() {
  $(document).on("click", ".discount-modalBtn", function(e) {
    e.preventDefault();
    $("#discountTable").html("");
    $("#discountTitle").text("Discount");
    $.get("/adminApi/discounts").then(results => {
      results.forEach(function(result, indx) {
        const html = `

       <tr class="discountRow${result._id}">
         <td><span id="discountText${result._id}">${
          result.discount
        }</span>%</td>
         <td class="discountTableData${result._id}">
         <button class="btn btn-warning editDiscount-btn" id="${
           result._id
         }">Edit</button>
          <button class="btn btn-danger deleteDiscount" id="${
            result._id
          }">Delete</button>
       </td>

      </tr>
      `;
        $("#discountTable").append(html);
      });
    });
  });
  $(document).on("click", ".newDiscountBtn", function(e) {
    e.preventDefault();
    $(this).fadeOut(function() {
      $("#discountTitle").text("New Discount");
      $(".newDiscount").fadeIn();
    });
  });
  $(document).on("click", "#cancelNewDiscount", function(e) {
    e.preventDefault();
    $("#newDiscountInput").val("");
    $(".newDiscount").fadeOut(function() {
      $("#discountTitle").text("Discount");
      $(".editDiscount").addClass("addDiscount");
      $(".editDiscount").removeClass("editDiscount");
      $(".addDiscount").attr("id", "");
      $(".addDiscount").text("Add Discount");
      $(".newDiscountBtn").fadeIn();
    });
  });
  $(document).on("click", ".addDiscount", function(e) {
    e.preventDefault();
    const newDiscountInput = $("#newDiscountInput").val();
    $.post("/adminApi/new/discount/", { newDiscountInput }).then(result => {
      //render data to table
      const html = `

    <tr>
    <td><span id="discountText${result._id}">${result.discount}</span>%</td>
     <td>
      <button class="btn btn-warning editDiscount-btn" id="${
        result._id
      }">Edit</button>
      <button class="btn btn-danger deleteDiscount">Delete</button>
     </td>

    </tr>
    `;

      $("#discountTable").prepend(html);
      $("#newDiscountInput").val("");
    });
  });
  $(document).on("click", ".editDiscount-btn", function(e) {
    e.preventDefault();
    const id = $(this).attr("id");
    const discountText = $("#discountText" + id).text();
    $("#newDiscountInput").val(discountText);
    $(".newDiscount").fadeIn(function() {
      $("#discountTitle").text("Discount");
      $(".newDiscountBtn").fadeOut();
    });
    //add edit discount class and id to add button
    $(".addDiscount").addClass("editDiscount");
    $(".editDiscount").attr("id", id);
    $(".editDiscount").text("Edit Discount");
    $(".addDiscount").removeClass("addDiscount");
    //console.log($(".addDiscount"));
  });
  $(document).on("click", ".editDiscount", function(e) {
    e.preventDefault();
    const id = $(this).attr("id");
    const newDiscountInput = $("#newDiscountInput").val();
    //update discount
    $.post("/adminApi/edit/discount/" + id, { newDiscountInput }).then(
      result => {
        //render data to page
        console.log(result);

        $("#discountText" + id).text(newDiscountInput);
        $("#newDiscountInput").val("");
        $("#successMessage").css({ display: "block" });
        setTimeout(function() {
          $("#successMessage").css({ display: "none" });
        }, 3000);
        $("#cancelNewDiscount").trigger("click");
      }
    );
  });
  $(document).on("click", "#closeModal", function() {
    $("#cancelNewDiscount").trigger("click");
  });
  $(document).on("click", ".deleteDiscount", function() {
    const id = $(this).attr("id");
    $("#cancelNewDiscount").trigger("click");
    const newHtml = `
    <button class="btn btn-warning noDoNotDelete" id="${id}">Cancel</button>
    <button class="btn btn-danger yesDelete" id="${id}">Yes Delete</button>
     `;
    $(".discountTableData" + id).html(newHtml);
  });
  $(document).on("click", ".noDoNotDelete", function() {
    const id = $(this).attr("id");
    const newHtml = `
    <button class="btn btn-warning editDiscount-btn" id="${id}">Edit</button>
     <button class="btn btn-danger deleteDiscount" id="${id}">Delete</button>
     `;
    $(".discountTableData" + id).html(newHtml);
  });
  $(document).on("click", ".yesDelete", function() {
    const id = $(this).attr("id");
    $(".discountRow" + id).fadeOut();
    $("#successMessage").css({ display: "block" });
    $.post("/adminApi/delete/discount/", { id }).then(result => {
      setTimeout(function() {
        $("#successMessage").css({ display: "none" });
      }, 3000);
    });
  });
});
