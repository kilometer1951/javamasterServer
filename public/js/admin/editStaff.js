$(document).ready(function() {
  $(document).on("click", ".editStaff-btn", function(e) {
    e.preventDefault();
    const id = $(this).attr("id");

    //get staff data
    $.get("/adminApi/edit/staff/" + id).then(result => {
      const html = `
       <form  action="/adminApi/edit/staff/${id}" method="post">
          <div class="row">
            <div class="col-md-4">
              <div class="form-group">
                <input type="text" name="fname" placeholder="First Name" value="${
                  result.fname
                }" class="form-control">
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <input type="text" name="lname" placeholder="Last Name" value="${
                  result.lname
                }" class="form-control">
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
            <input type="email" name="email" placeholder="Email" value="${
              result.email
            }" class="form-control">
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
            <input type="text" name="phonenumber" placeholder="Phone Number" value="${
              result.phonenumber
            }" class="form-control">
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
            <select name="role" class="form-control">
              <option value="Admin" ${
                result.role === "Admin" ? "selected" : ""
              }>Admin</option>
              <option value="Orders" ${
                result.role === "Orders" ? "selected" : ""
              }>Orders</option>
            </select>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
            <input type="submit" value="Update" class="btn btn-success form-control">
            </div>
          </div>
          </div>
       </form>


       `;
      $("#editStaff-div").html(html);
    });
  });
  //pass id to delete btn id
  $(document).on("click", ".delete-btn", function(e) {
    e.preventDefault();
    const id = $(this).attr("id");
    $(".deleteStaff").attr("id", id);

    //get staff data
    //    $.get("/adminApi/edit/staff/" + id).then(result => {});
  });
  $(document).on("click", ".deleteStaff", function(e) {
    e.preventDefault();
    const deleteID = $(this).attr("id");
    //get staff data
    $.post("/adminApi/delete/staff/", { deleteID }).then(result => {
      location.reload();
    });
  });
});
