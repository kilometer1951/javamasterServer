$(document).ready(function() {
  $(document).on("click", ".mainCategory-modalBtn", function(e) {
    e.preventDefault();
    $("#mainCategoryTable").html("");
    $("#mainCategoryTitle").text("Main-Category");
    $.get("/adminApi/mainCategory").then(results => {
      results.forEach(function(result, indx) {
        const html = `
       <tr class="mainCategoryRow${result._id}">
         <td><span id="mainCategoryText${result._id}">${
          result.mainCategory
        }</span></td>
         <td class="mainCategoryTableData${result._id}">
         <button class="btn btn-warning editMainCategory-btn" id="${
           result._id
         }">Edit</button>
          <button class="btn btn-danger deleteMainCategory" id="${
            result._id
          }">Delete</button>
       </td>

      </tr>
      `;
        $("#mainCategoryTable").append(html);
      });
    });
  });
  $(document).on("click", ".newMainCategoryBtn", function(e) {
    e.preventDefault();
    $(this).fadeOut(function() {
      $("#mainCategoryTitle").text("New");
      $(".newMainCategory").fadeIn();
    });
  });
  $(document).on("click", "#cancelNewMainCategory", function(e) {
    e.preventDefault();
    $("#newMainCategoryInput").val("");
    $(".newMainCategory").fadeOut(function() {
      $("#mainCategoryTitle").text("Main-Category");
      $(".editMainCategory").addClass("addMainCategory");
      $(".editMainCategory").removeClass("editMainCategory");
      $(".addMainCategory").attr("id", "");
      $(".addMainCategory").text("Add");
      $(".newMainCategoryBtn").fadeIn();
    });
  });
  $(document).on("click", ".addMainCategory", function(e) {
    e.preventDefault();
    const newMainCategoryInput = $("#newMainCategoryInput").val();
    $.post("/adminApi/new/mainCategory/", { newMainCategoryInput }).then(result => {
      //render data to table
      const html = `

    <tr>
    <td><span id="mainCategoryText${result._id}">${result.mainCategory}</span></td>
     <td>
      <button class="btn btn-warning editmainCategory-btn" id="${
        result._id
      }">Edit</button>
      <button class="btn btn-danger deleteMainCategory">Delete</button>
     </td>

    </tr>
    `;

      $("#mainCategoryTable").prepend(html);
      $("#newMainCategoryInput").val("");
    });
  });
  $(document).on("click", ".editMainCategory-btn", function(e) {
    e.preventDefault();
    const id = $(this).attr("id");
    const mainCategoryText = $("#mainCategoryText" + id).text();
    $("#newMainCategoryInput").val(mainCategoryText);
    $(".newMainCategory").fadeIn(function() {
      $("#mainCategoryTitle").text("Main-Category");
      $(".newMainCategoryBtn").fadeOut();
    });
    //add edit discount class and id to add button
    $(".addMainCategory").addClass("editMainCategory");
    $(".editMainCategory").attr("id", id);
    $(".editMainCategory").text("Edit");
    $(".addMainCategory").removeClass("addMainCategory");
    //console.log($(".addDiscount"));
  });
  $(document).on("click", ".editMainCategory", function(e) {
    e.preventDefault();
    const id = $(this).attr("id");
    const newMainCategoryInput = $("#newMainCategoryInput").val();
    //update discount
    $.post("/adminApi/edit/mainCategory/" + id, { newMainCategoryInput }).then(
      result => {
        //render data to page
        console.log(result);

        $("#mainCategoryText" + id).text(newMainCategoryInput);
        $("#newMainCategoryInput").val("");
        $("#successMessage").css({ display: "block" });
        setTimeout(function() {
          $("#successMessage").css({ display: "none" });
        }, 3000);
        $("#cancelNewMainCategory").trigger("click");
      }
    );
  });
  $(document).on("click", "#closeModal", function() {
    $("#cancelNewMainCategory").trigger("click");
  });
  $(document).on("click", ".deleteMainCategory", function() {
    const id = $(this).attr("id");
    $("#cancelNewMainCategory").trigger("click");
    const newHtml = `
    <button class="btn btn-warning noDoNotDelete" id="${id}">Cancel</button>
    <button class="btn btn-danger yesDelete" id="${id}">Yes Delete</button>
     `;
    $(".mainCategoryTableData" + id).html(newHtml);
  });
  $(document).on("click", ".noDoNotDelete", function() {
    const id = $(this).attr("id");
    const newHtml = `
    <button class="btn btn-warning editMainCategory-btn" id="${id}">Edit</button>
     <button class="btn btn-danger deleteMainCategory" id="${id}">Delete</button>
     `;
    $(".mainCategoryTableData" + id).html(newHtml);
  });
  $(document).on("click", ".yesDelete", function() {
    const id = $(this).attr("id");
    $(".mainCategoryRow" + id).fadeOut();
    $("#successMessage").css({ display: "block" });
    $.post("/adminApi/delete/mainCategory/", { id }).then(result => {
      setTimeout(function() {
        $("#successMessage").css({ display: "none" });
      }, 3000);
    });
  });
  $(document).on("click", ".subCategory-modalBtn", function(e) {
    e.preventDefault();
    $("#subCategoryTable").html("");
    $("#subCategoryTitle").text("Sub-Category");
    $.get("/adminApi/subCategory").then(results => {
      renderSubCategory(results)
      //append main-category to dropdown
      $("#selectMainCategory").html("<option>Select a main-category</option>");
      results.mainCategory.forEach(function(result) {
        const html = `
          <option>${result.mainCategory}</option>
        `;
          $("#selectMainCategory").append(html);
      });
    });
  });
});

$(document).on("click", ".newSubCategoryBtn", function(e) {
  e.preventDefault();
  $(this).fadeOut(function() {
    $("#subCategoryTitle").text("New");
    $(".newSubCategory").fadeIn();
  });
});

$(document).on("click", "#cancelNewSubCategory", function(e) {
  e.preventDefault();
  $("#newSubCategoryInput").val("");
  $(".newSubCategory").fadeOut(function() {
    $("#subCategoryTitle").text("Sub-Category");
    $(".editSubCategory").addClass("addSubCategory");
    $(".editSubCategory").removeClass("editSubCategory");
    $(".addSubCategory").attr("id", "");
    $(".addSubCategory").text("Add");
    $(".newSubCategoryBtn").fadeIn();

    $(".subCategorySection").css({display:"block"});
    $(".newSubCategoryBtn").css({display:"block"});
    $(".i").css({display:"block"});
    $(".editSubCategorySection").css({display:"none"});
  });
});

$(document).on("click", ".addSubCategory", function(e) {
  e.preventDefault();
  const newSubCategoryInput = $("#newSubCategoryInput").val();
  const selectMainCategory = $("#selectMainCategory").val();
  $.post("/adminApi/new/subCategory/", { newSubCategoryInput,selectMainCategory }).then(results => {
          $("#successMessage").css({ display: "block" });
          renderSubCategory(results)
          setTimeout(function() {
            $("#successMessage").css({ display: "none" });
          }, 3000);
          $("#newSubCategoryInput").val("");
  });

});

$(document).on("click", "#closeModal", function() {
  $("#cancelNewSubCategory").trigger("click");
});

$(document).on("click", ".editSubCategory-btn", function(e) {
  e.preventDefault()

  //ajax request to get data
  const id = $(this).attr("id");
  $.get("/adminApi/edit/subCategory/"+id).then(results => {
      //load data then display editSubCategoryDiv
        //clear div
        $(".editSubCategoryData").html("")
        results.subCategory.forEach(function(result) {
           const html = `
                     <div class="col-md-12">
                       <div class="form-group">
                         <input type="text" class="form-control" value="${result.name}" id="subCategoryField${result._id}">
                       </div>
                       <div class="form-group">
                         <button type="button" class="btn btn-primary updateSubCategory" id="${result._id}">Update</button>
                       </div>`;
            $(".editSubCategoryData").append(html)
        });
        $(".editSubCategoryText").text(results.mainCategory);
        $(".editSubCategoryText").attr("id",results._id);
        $(".subCategorySection").css({display:"none"});
        $(".newSubCategory").css({display:"none"});
        $(".i").css({display:"none"});
        $(".editSubCategorySection").css({display:"block"});
  });
})

$(document).on("click", ".updateSubCategory", function(e) {
  e.preventDefault();
  const subCategoryID = $(this).attr("id");
  const categoryID = $(".editSubCategoryText").attr("id");
  const subCategoryField = $("#subCategoryField"+subCategoryID).val()
  console.log(categoryID)
  console.log(subCategoryID)
  $.post("/adminApi/edit/subCategory/"+categoryID+"/"+subCategoryID, { subCategoryField }).then(results => {
    $("#successMessage").css({ display: "block" });
    setTimeout(function() {
      $("#successMessage").css({ display: "none" });
    }, 3000);
  });
})


function renderSubCategory(results) {
  $("#subCategoryTable").html("");
  results.subCategory.forEach(function(result, indx) {

    const html = `
   <tr class="subCategoryRow${result._id}">
     <td><span id="subCategoryText${result._id}">${
      result.mainCategory
    }</span></td>
    <td>
    ${display(result)}
    </td>
     <td class="subCategoryTableData${result._id}">
     <button class="btn btn-warning editSubCategory-btn" id="${
       result._id
     }">Edit </button>
   </td>

  </tr>
  `;

    $("#subCategoryTable").append(html);

  });


}

function cancelEditSubCategory() {
  //re-render data
  $.get("/adminApi/subCategory").then(results => {
    renderSubCategory(results)
    $(".subCategorySection").css({display:"block"});
    $(".newSubCategoryBtn").css({display:"block"});
    $(".i").css({display:"block"});
    $(".editSubCategorySection").css({display:"none"});
    });

}


function display(result) {
  return result.subCategory.map(function(subCat, idx, array) {
    return  subCat.name
  });
}
