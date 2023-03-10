$(document).ready(function(){

   if(localStorage.getItem("user_data") != null){
        ShowUserData();    
   }
    
    $(document).on("click","#openUserAddModal",OpenUserAddModal);
    $(document).on("click","#closeModal",CloseUserModal);
    
   //add user
    $(document).on("click","#btnSaveUserMS",function(){
        var name = $("#name").val();
        var age = $("#age").val();
        var email = $("#email").val();
    
        if(IsValidUserInput("add"))
        {
            var userId;
            var userJson;
            if(localStorage.getItem("user_data") == null || JSON.parse(localStorage.getItem("user_data")).users.length == 0)
            {
                var users = [];
                userId = 1;

                users.push(         
                    {"id":userId,
                    "name":name,
                    "email":email,
                    "age":age}
                );
                userJson ={
                    "users" : users
                }
            }
            else
            {
                userJson = JSON.parse(localStorage.getItem("user_data"));
                var lastIndexOfArray = userJson.users.length-1;
                userId = Number(userJson.users[lastIndexOfArray].id) + 1;
                userJson.users.push({"id":userId,
                "name":name,
                "email":email,
                "age":age});
            }
    
            localStorage.setItem("user_data", JSON.stringify(userJson));
            
            ShowUserData();
            ClearUserMSModal();
        }
    });
    
    //delete user
    $(document).on("click",".btn-user-delete",function(){
        if (confirm("Are you sure! want to delete?") == true) 
        {
            var userId = $(this).attr('data-userId');
            var indexNumber;
            var userJson = JSON.parse(localStorage.getItem("user_data"));
            for(var i = 0 ;i < userJson.users.length; i++)
            {
                if(userJson.users[i].id == userId)
                {
                    indexNumber = i;
                    break;
                }
            }
            userJson.users.splice(indexNumber, 1);
            localStorage.setItem("user_data", JSON.stringify(userJson));
            ShowUserData();
        } 
    });

    //edit user
    $(document).on("click",".btn-user-edit",function(){
       
        $("#modalHeading").html("Edit User");
        $("#userMSmodal").fadeIn();
        var userId = $(this).attr('data-userId');
        var indexNumber;
        var userJson = JSON.parse(localStorage.getItem("user_data"));
        for(var i = 0 ;i < userJson.users.length; i++)
        {
            if(userJson.users[i].id == userId)
            {
                indexNumber = i;
                break;
            }
        }
        $("#name").val(userJson.users[indexNumber].name);
        $("#email").val(userJson.users[indexNumber].email);
        $("#age").val(userJson.users[indexNumber].age);
        $("#userId").html(userJson.users[indexNumber].id);

        $("#btnSaveUserMS").hide();  
        $("#btnupdateUserMS").show();
        $("#selectedID").show(); 

    });
    

    //update user
    $(document).on("click","#btnupdateUserMS",function(){
        
        if(IsValidUserInput("update"))
        {
            if (confirm("Are your sure! want to update?") == true) 
            {
                var userId = Number($("#userId").text());
                var indexNumber;
                var userJson = JSON.parse(localStorage.getItem("user_data"));
                for(var i = 0 ;i < userJson.users.length; i++)
                {
                    console.log(userId);
                    if(Number(userJson.users[i].id) == userId)
                    {
                        indexNumber = i;
                        break;
                    }
                }
                
                userJson.users[indexNumber].name = $("#name").val();
                userJson.users[indexNumber].email = $("#email").val();
                userJson.users[indexNumber].age = $("#age").val();

                localStorage.setItem("user_data", JSON.stringify(userJson));
                
                ShowUserData();
                CloseUserModal();
            } 
            else 
            {
                CloseUserModal();
            }
        }
    });

    $("#searchUserByName").keyup(function(){
        var searchText = $("#searchUserByName").val();
        searchText = searchText.replace(/\s{2,}/g, ' ').trim();
        searchText = searchText.toLowerCase();
    
        if(searchText == "")
        {
            ShowUserData();
        }
        else
        {
            var userJson = JSON.parse(localStorage.getItem("user_data"));
            var totalUser = userJson.users.length;
            var userTableRow = "";
            if(userJson != null)
            {            
                for(var i = 0; i < totalUser; i++)
                {
                    var userName = userJson.users[i].name;
                    userName = userName.toLowerCase();
                    if(userName.indexOf(searchText) > -1)
                    {                     
                        userTableRow += 
                        `<tr>
                            <td>${userJson.users[i].id}</td>
                            <td>${userJson.users[i].name}</td> 
                            <td>${userJson.users[i].email}</td> 
                            <td>${userJson.users[i].age}</td> 
                            <td> 
                                <button data-userId = "${userJson.users[i].id}" class="btn btn-user-delete">Delete</button> 
                                <button data-userId = "${userJson.users[i].id}" class="btn-user-edit btn">Edit</button> 
                            </td> 
                        </tr>`;                       
                    }
                }
            }
            $("#userTableBody").html(userTableRow);
        }
    });
});
// end jquery


function ShowUserData(){
    var userJson = JSON.parse(localStorage.getItem("user_data"));
    var totalUser = userJson.users.length;
    var userTableRow = "";
    if(localStorage.getItem("user_data") != null)
    {            
        for(var i = 0; i < totalUser; i++)
        {
            userTableRow += 
            `<tr>
                <td>${userJson.users[i].id}</td>
                <td>${userJson.users[i].name}</td> 
                <td>${userJson.users[i].email}</td> 
                <td>${userJson.users[i].age}</td> 
                <td> 
                    <button data-userId = "${userJson.users[i].id}" class="btn btn-user-delete">Delete</button> 
                    <button data-userId = "${userJson.users[i].id}" class="btn-user-edit btn">Edit</button> 
                </td> 
            </tr>`;
        }
        
        $("#userTableBody").html(userTableRow);
    }
    else
    {
        $("#localStorageEmptyMessage").show();
    }       
}

function IsValidUserInput(action){

    _cmnRemoveAllErrorMessage();
    var name = $("#name").val();
    var age = $("#age").val();
    var givenEmail = $("#email").val();
    var totalEmail = 0;
    var existingUsersArray = [];

    if(JSON.parse(localStorage.getItem("user_data")) != null){
        existingUsersArray = JSON.parse(localStorage.getItem("user_data")).users;
    }

    if(action == "add")
    {
        if(localStorage.getItem("user_data") == null || existingUsersArray.length == 0)
        {
            totalEmail = 0;
        }
        else
        {
            for(var i = 0; i <existingUsersArray.length; i++)
            {
                var userEmail = existingUsersArray[i].email;
                if(userEmail == givenEmail ){
                    totalEmail = 1;
                    break;
                }
            }
        }
    }
    else
    {
        var updateId = Number($("#userId").text());
        if(localStorage.getItem("user_data") == null || existingUsersArray.length == 0)
        {
            totalEmail = 0;
        }
        else
        {
            for(var i = 0; i <existingUsersArray.length; i++)
            {
                var userEmail = existingUsersArray[i].email;
                var userId = Number(existingUsersArray[i].id);
                if(userEmail == givenEmail && userId != updateId){
                    totalEmail = 1;
                    break;
                }
            }
        }
    }

    if(name == "")
    {
        _cmnShowErrorMessageBottomOfTheInputFiled("name","Feild can not be empty.");
        return false;
    }

    if(givenEmail == "")
    {
        _cmnShowErrorMessageBottomOfTheInputFiled("email","Feild can not be empty.");
        return false;
    }
    else if(!_cmnisValidEmail(givenEmail) || !_cmnisLengthValid(givenEmail, 5, 50))
    {
        _cmnShowErrorMessageBottomOfTheInputFiled("email","Enter valid email.");
        return false;   
    }
    else if(action == "update" && totalEmail > 0)
    {
        _cmnShowErrorMessageBottomOfTheInputFiled("email","This email already used. Enter valid email.");
        return false; 
    }
    else if(action == "add" && totalEmail > 0)
    {
        _cmnShowErrorMessageBottomOfTheInputFiled("email","This email already used. Enter valid email.");
        return false; 
    }
    
    if(age == "")
    {
        _cmnShowErrorMessageBottomOfTheInputFiled("age","Feild can not be empty.");
        return false;
    }
    else if(isNaN(Number(age)) || Number(age) < 18)
    {
        _cmnShowErrorMessageBottomOfTheInputFiled("age","Enter valid age.");
        return false;
    }

    return true;
}

function OpenUserAddModal(){
    $("#modalHeading").html("Add User");
    $("#userMSmodal").fadeIn();
    $("#btnSaveUserMS").show();  
    $("#btnupdateUserMS").hide();
}

function CloseUserModal()
{
    $("#userMSmodal").fadeOut();     
    $("#selectedID").fadeOut();
    ClearUserMSModal();
}

function ClearUserMSModal(){
    $("#name").val("");
    $("#age").val("");
    $("#email").val("");
    $("#userId").html("");
    _cmnRemoveAllErrorMessage();
}