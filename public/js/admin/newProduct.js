$(document).ready(function() {
  $(document).on("change", "#mainCategory", function() {
    const val = $(this).val();
    //fetch subCat
    $.get("/adminApi/fetchSubCat/" + val).then(results => {
      //apend to subCat to select dropdown
      $("#subCategory").html("<option>Select a sub-category</option>");
      results.subCategory.forEach(function(result, indx) {
        const html = `
            <option value="${result.name}">${result.name}</option>
      `;
        $("#subCategory").append(html);
      });
    });
  });

  $(document).on("click", ".saveProductAndNext", function(e) {
    e.preventDefault();
    //get all values
    const productName = $("#productName").val();
    const price = $("#price").val();
    const calories = $("#calories").val();
    const discount = $("#discount").val();
    const inStock = $("#inStock").val();
    const mainCategory = $("#mainCategory").val();
    const subCategory = $("#subCategory").val();
    const description = $("#description").val();
    const arr = [];
    const optionsCheckBox = document.getElementsByClassName("optionsCheckBox");
    for (var i = 0; i < optionsCheckBox.length; i++) {
      if (optionsCheckBox[i].checked) {
        arr.push(optionsCheckBox[i].value);
      }
    }
    //send values to db
    $.post("/adminApi/new/product/", {
      productName,
      price,
      calories,
      discount,
      description,
      inStock,
      mainCategory,
      subCategory,
      arr
    }).then(result => {
      //send id to productId input field
      $("#productID").val(result._id);
      $("#newProductForm").css({ display: "none" });
      $("#uploadPhotoForm").css({ display: "block" });
    });
  });
});
