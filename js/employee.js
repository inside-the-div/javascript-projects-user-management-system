
// a single employee json
// var employee = {
//     id : 1,
//     name: "name",
//     email: "email",
//     age: 12,
// }


// start jquery
$(document).ready(function(){


    //we need to show all employees when site load
    var allEmployees = JSON.parse(localStorage.getItem('employees')) || [];
    showEmployees(allEmployees);

    // open add modal
    $("#addBtn").click(function(){
        $("#employeeModal").fadeIn();
        $("#modalHeading").html("Add employee");
        $("#saveBtn").show();
        $("#updateBtn").hide();
        $("#selectedIdDiv").hide();
    })

    // close modal
    $("#closeModalBtn").click(function(){
        $("#employeeModal").fadeOut();
        // so we need to clear the modal
        $("#name").val("");
        $("#email").val("");
        $("#age").val("");
    })

    // now add / save employee

    $("#saveBtn").click(function(){

        var employeeID = generateEmployeeID();
        var name = $("#name").val();
        var email = $("#email").val();
        var age = $("#age").val();

        // but before store we need to validate the user input

        var isValid = isValidEmployee(employeeID,name,email,age);

        if(isValid == true){
            var employee = {
                id: employeeID,
                name: name,
                email: email,
                age:age
            }

            // get all employees from local storage
            var allEmployees = JSON.parse(localStorage.getItem('employees')) || [];
            allEmployees.push(employee);

            // store all employee to local storage
            // but need to make it string
            localStorage.setItem('employees',JSON.stringify(allEmployees));

            // now we need to show employee
            showEmployees(allEmployees);

            $("#closeModalBtn").click();
        }
    })
    // end save

    $("#updateBtn").click(function(){
        var employeeID = Number($("#employeeID").text());
        var newName = $("#name").val();
        var newEmail = $("#email").val();
        var newAge = $("#age").val();

        // but before update we need to validate the user input
        var isValid = isValidEmployee(employeeID,newName,newEmail,newAge);

        if(isValid == true){
            // get all employees from local storage
            var allEmployees = JSON.parse(localStorage.getItem('employees')) || [];
            // find the index
            var index = allEmployees.findIndex(employee => employee.id == employeeID);
            allEmployees[index].name = newName;
            allEmployees[index].email = newEmail;
            allEmployees[index].age = newAge;

            // store all employee to local storage
            // but need to make it string
            localStorage.setItem('employees',JSON.stringify(allEmployees));

            // now we need to show employee
            showEmployees(allEmployees);

            $("#closeModalBtn").click();
        }
    })
    // end update


    // now search employee
    $("#searchEmployee").keyup(function(){
        var givenName = $(this).val().trim().toLowerCase();

        // get all employees from local storage
        var allEmployees = JSON.parse(localStorage.getItem('employees')) || [];

        var matchingEmployees = allEmployees.filter(function(employee){
            return employee.name.toLowerCase().includes(givenName);
        })

        // now we need to show employee
        showEmployees(matchingEmployees);

    })

})
// end jquery



// As edit button create dynamically we need to write out-side of the
// jquery
$(document).on('click','.edit-btn',function(){
    // open edit modal
    $("#employeeModal").fadeIn();
    $("#modalHeading").html("Edit Employee");
    $("#saveBtn").hide();
    $("#updateBtn").show();
    $("#selectedIdDiv").show();

    // get the data from local storage by id

    var employeeID = Number($(this).attr('data-employeeID'));

     // get all employees from local storage
     var allEmployees = JSON.parse(localStorage.getItem('employees')) || [];
     var editEmployee = allEmployees.find(function(employee){
        return employee.id === employeeID;
     })

    //console.log(editEmployee);

    // set employee value to form
    $("#employeeID").text(editEmployee.id);
    $("#name").val(editEmployee.name);
    $("#email").val(editEmployee.email);
    $("#age").val(editEmployee.age);

    // now we need to update

})
// end edit


// As delete button create dynamically we need to write out-side of the
// jquery
$(document).on('click','.delete-btn',function(){

    // but we need to confirm
    if(confirm("Are you sure want to delete?")){
        var employeeID = Number($(this).attr('data-employeeID'));

        // get all employees from local storage
        var allEmployees = JSON.parse(localStorage.getItem('employees')) || [];

        allEmployees = allEmployees.filter(function(employee){
            return employee.id !== employeeID;
        })

        // now we need to store update allEmployees variable to local storage
        // store all employee to local storage
        // but need to make it string
        localStorage.setItem('employees',JSON.stringify(allEmployees));

        // now we need to show employee
        showEmployees(allEmployees);
    }

})
// end delete


function isValidEmployee(employeeID,name,email,age){

    // before going to validate we need to remove all error message 
    _cmnRemoveAllErrorMessage();


    // get all employees from local storage
    var allEmployees = JSON.parse(localStorage.getItem('employees')) || [];

    if(employeeID == ""){
        alert("something wrong!");
        return false;
    }

    if(name == ""){
        _cmnShowErrorMessageBottomOfTheInputFiled("name","Name empty.");
        return false;
    }else if(name.length < 3){
        _cmnShowErrorMessageBottomOfTheInputFiled("name","Name not valid.");
        return false;
    }

    if(email == ""){
        _cmnShowErrorMessageBottomOfTheInputFiled("email","email empty.");
        return false;
    }else if(email.length < 3){
        _cmnShowErrorMessageBottomOfTheInputFiled("email","email not valid.");
        return false;
    }else if(allEmployees.some(employee => employee.email === email && employee.id != employeeID)){
        // we need to check if this email alreay exists or not
        // && employee.id != employeeID this is for we will allow for this id when update

        _cmnShowErrorMessageBottomOfTheInputFiled("email","email alreay exists.");
        return false;
    }else if(!_cmnisValidEmail(email)){
        // we need to check is email in valid format or not

        _cmnShowErrorMessageBottomOfTheInputFiled("email","email is not valid.");
        return false;
    }

    if(age <= 0 || age >=100){
        _cmnShowErrorMessageBottomOfTheInputFiled("age","this is not valid age.");
        return false;
    }

    return true;

}


function showEmployees(allEmployees){
    if(allEmployees.length > 0){
        // we will show

        var EmployeeTableRows = '';
        allEmployees.forEach(function(employee){
            EmployeeTableRows += `
                <tr>
                    <td>${employee.id}</td>
                    <td>${employee.name}</td> 
                    <td>${employee.email}</td> 
                    <td>${employee.age}</td> 
                    <td> 
                        <button data-employeeID = "${employee.id}" class="btn delete-btn">Delete</button> 
                        <button data-employeeID = "${employee.id}" class="btn edit-btn">Edit</button> 
                    </td> 
                </tr>`;
        })

        $("#employeeTableBody").html(EmployeeTableRows);
        $("#noEmployeeFound").hide();

    }else{
        // show not found message
        $("#noEmployeeFound").show();
        $("#employeeTableBody").html("");
    }
}


function generateEmployeeID(){
    // get all employee from local storage
    // and generate id from lenth
    // if it is null then assign en empty array
    // also make it JSON
    var allEmployees = JSON.parse(localStorage.getItem('employees')) || [];

    return allEmployees.length + 1;

}
