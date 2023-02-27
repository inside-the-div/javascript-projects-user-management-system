$(document).ready(function(){
   if(localStorage.getItem("user_data") != null)
   {
    ShowUserData();    
   }
    
    $(document).on("click","#openUserAddModal",OpenUserAddModal);
    $(document).on("click","#closeModal",CloseUserModal);

    function OpenUserAddModal(){
        $("#modalHeading").html("Add User");
        $("#modalContainer").fadeIn();
        $("#save").show();  
        $("#update").hide();
    }

    function CloseUserModal()
    {
        $("#modalContainer").fadeOut();     
        $("#selectedID").fadeOut();
        ClearModal();
    }

    $(document).on("click","#save",SaveUserData)
    
    function IsValidUserInput(){
        var name = $("#name").val();
        var age = $("#age").val();
        var email = $("#email").val();
    
        _cmnRemoveAllErrorMessage();
    
        if(name == "")
        {
            _cmnShowErrorMessageBottomOfTheInputFiled("name","Feild can not be empty.");
            return false;
        }
        
        if(email == "")
        {
            _cmnShowErrorMessageBottomOfTheInputFiled("email","Feild can not be empty.");
            return false;
        }
        else if(!_cmnisValidEmail(email) || !_cmnisLengthValid(email, 5, 50))
        {
            _cmnShowErrorMessageBottomOfTheInputFiled("email","Enter valid email.");
            return false;   
        }

        if(age == "")
        {
            _cmnShowErrorMessageBottomOfTheInputFiled("age","Feild can not be empty.");
            return false;
        }
        else if(isNaN(Number(age)))
        {
            _cmnShowErrorMessageBottomOfTheInputFiled("age","Enter valid age.");
            return false;
        }
    
        return true;
    }
    
    function ClearModal(){
        $("#name").val("");
        $("#age").val("");
        $("#email").val("");
        $("#userId").html("");
        _cmnRemoveAllErrorMessage();
    }
    
    function SaveUserData(){
       
        var name = $("#name").val();
        var age = $("#age").val();
        var email = $("#email").val();
    
        if(IsValidUserInput())
        {
            var userId = 1;
            var userJson;
            if(localStorage.getItem("user_data") == null || JSON.parse(localStorage.getItem("user_data")).users.length == 0)
            {
                var users = [];
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
            
            // $("#localStorageEmptyMessage").hide();
            ShowUserData();
            ClearModal();
        }
        else{
            return false;
        }
        
    }
    
    function ShowUserData(){
        var user_data = JSON.parse(localStorage.getItem("user_data"));
        var totalUser = user_data.users.length;
        var usertablerow = "";
        if(localStorage.getItem("user_data") != null)
        {            
            for(var i = 0; i < totalUser; i++)
            {
                usertablerow += 
                `<tr>
                    <td>${user_data.users[i].id}</td>
                    <td>${user_data.users[i].name}</td> 
                    <td>${user_data.users[i].email}</td> 
                    <td>${user_data.users[i].age}</td> 
                    <td> 
                        <button data-userId = "${user_data.users[i].id}" class="btn btn-user-delete">Delete</button> 
                        <button data-userId = "${user_data.users[i].id}" class="btn-user-update btn">Edit</button> 
                    </td> 
                </tr>`;
            }
            
            $("#userTableBody").html(usertablerow);
            if($("#userTableBody").text() == "")
            {
                $("#localStorageEmptyMessage").show(); 
            }
            else{
                $("#localStorageEmptyMessage").hide(); 
            }
        }        
    }

    $(document).on("click",".btn-user-delete",DeleteUser);
    
    
    function DeleteUser(){
        if (confirm("Are you sure! want to delete?") == true) 
        {
            var userId = ($(this).attr('data-userId'));
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
    }

    $(document).on("click",".btn-user-update",UpdateUserModal);
    
    function UpdateUserModal() {
        
        $("#modalHeading").html("Update User");
        $("#modalContainer").fadeIn();
        var userId = ($(this).attr('data-userId'));
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

        $("#save").hide();  
        $("#update").show();
        $("#selectedID").show();      
    }

    $(document).on("click","#update",UpdateUser); 
    
    function UpdateUser(){
        
        if(IsValidUserInput())
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
    }

});