$(document).ready(function() {
  $(document).on("click", ".options-modalBtn", function(e) {
    renderOption();
  });
  $(document).on("click", "#saveOptionAndNext", function(e) {
    //save and pass id of result for option content use
    const optionName = $("#optionName").val();
    $.post("/adminApi/new/option/", {
      optionName
    }).then(results => {
      //pass id and move to next step
      $(".saveOptionContent").attr("id", results._id);
      $(".saveOptionContent").text("Add Content");
      $("#optionText").text("Add Content For: " + results.optionName);
      $(".optionName-div").css({ display: "none" });
      $(".optionContent-div").css({ display: "block" });
      $("#optionName").val("");
    });
  });
  $(document).on("click", ".saveOptionContent", function(e) {
    //get id from btn and use to update option document
    const id = $(this).attr("id");
    const optionContent = $("#optionContent").val();
    $.post("/adminApi/add/optionContent/" + id, {
      optionContent
    }).then(results => {
      //add content to table
      $("#optionContent").val("");
      renderOption();
    });
  });
  $(document).on("click", ".newOptionsBtn", function(e) {
    //get id from btn and use to update option document
    $("#optionText").text("New Option");
    $(".newOptionsBtn").css({ display: "none" });
    $(".newOptionsDiv").css({ display: "block" });
    $(".optionName-div").css({ display: "block" });
    $("#optionName").val("");
    $("#optionContent").val("");
  });
  $(document).on("click", ".done", function(e) {
    //get id from btn and use to update option document
    $(".saveOptionContent").attr("id", "");
    $("#optionText").text("Option");
    $(".optionName-div").css({ display: "none" });
    $(".optionContent-div").css({ display: "none" });
    $(".newOptionsBtn").css({ display: "block" });
    $("#optionName").val("");
    $("#optionContent").val("");
  });
  $(document).on("click", ".cancel", function(e) {
    //get id from btn and use to update option document
    $(".saveOptionContent").attr("id", "");
    $("#optionText").text("Option");
    $(".optionName-div").css({ display: "none" });
    $(".optionContent-div").css({ display: "none" });
    $("#optionName").val("");
    $("#optionContent").val("");
    $(".newOptionsBtn").css({ display: "block" });
  });

  $(document).on("click", ".addMoreContent", function(e) {
    //pass id to btn and display div and chnage text
    const id = $(this).attr("id");
    const optionNameText = $("#optionNameText" + id).text();
    $(".saveOptionContent").attr("id", id);
    $(".saveOptionContent").text("Add Content");
    $("#optionText").text("Add Content For: " + optionNameText);
    $(".optionName-div").css({ display: "none" });
    $(".optionContent-div").css({ display: "block" });
    $(".newOptionsDiv").css({ display: "block" });
    $("#optionName").val("");
    $("#optionContent").val("");
    $(".newOptionsBtn").css({ display: "none" });
  });

  $(document).on("click", ".updateOption", function(e) {
    e.preventDefault();
    const optionID = $(".optionID").attr("id");
    const optionContentID = $(this).attr("id");
    const optionContentField = $("#optionContentField" + optionContentID).val();
    $.post("/adminApi/edit/option/" + optionID + "/" + optionContentID, {
      optionContentField
    }).then(results => {
      $("#successMessage").css({ display: "block" });
      setTimeout(function() {
        $("#successMessage").css({ display: "none" });
      }, 3000);
    });
  });

  $(document).on("click", ".updateOptionName", function(e) {
    e.preventDefault();
    const optionID = $(".optionID").attr("id");
    const editOptionNameInput = $("#editOptionNameInput").val();
    $.post("/adminApi/edit/optionName/" + optionID, {
      editOptionNameInput
    }).then(results => {
      $("#successMessage").css({ display: "block" });
      setTimeout(function() {
        $("#successMessage").css({ display: "none" });
      }, 3000);
    });
  });

  $(document).on("click", ".editOption-btn", function(e) {
    const id = $(this).attr("id");

    const optionNameText = $("#optionNameText" + id).text();
    $(".optionID").attr("id", id);
    $(".updateOptionName").attr("id", id);
    $("#editOptionNameInput").val(optionNameText);
    $(".optionTableSection").css({ display: "none" });
    $(".editoptionSection").css({ display: "block" });
    $(".newOptionsBtn").css({ display: "none" });
    //display option content form
    $.get("/adminApi/edit/option/" + id).then(results => {
      //load data then display editOptionDiv
      //clear div
      $(".editOptionData").html("");
      results.optionContent.forEach(function(result) {
        const html = `
                       <div class="col-md-12">
                         <div class="form-group">
                         <label>Option Content</label>
                           <input type="text" class="form-control" value="${
                             result.name
                           }" id="optionContentField${result._id}">
                         </div>
                         <div class="form-group">
                           <button type="button" class="btn btn-primary updateOption" id="${
                             result._id
                           }">Update</button>
                         </div>`;
        $(".editOptionData").append(html);
      });
    });
  });
  $(document).on("click", "#closeModal", function(e) {
    e.preventDefault();
    $(".optionTableSection").css({ display: "block" });
    $(".editoptionSection").css({ display: "none" });
    $(".newOptionsBtn").css({ display: "block" });
  });
});

function renderOption() {
  $("#optionsTable").html("");
  $.get("/adminApi/option").then(results => {
    results.forEach(function(result, indx) {
      const html = `
       <tr class="optionRow${result._id}">
         <td id="optionNameText${result._id}">${result.optionName}</td>
        <td>
        ${displayOptionContent(result)}
        </td>
         <td>
           <button class="btn btn-warning editOption-btn" id="${
             result._id
           }">Edit </button>
           <button class="btn btn-success addMoreContent" id="${
             result._id
           }">Add Content</button>
         </td>

      </tr>
      `;
      $("#optionsTable").append(html);
    });
  });
}

function cancelEditOption() {
  //re-render data
  renderOption();

  $(".optionTableSection").css({ display: "block" });
  $(".editoptionSection").css({ display: "none" });
  $(".newOptionsBtn").css({ display: "block" });
}

function displayOptionContent(result) {
  return result.optionContent.map(function(option, idx, array) {
    return option.name;
  });
}
