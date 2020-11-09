(function(){
    "use strict";
    console.log("app loaded");

    const username = document.querySelector("#username");
    const form = document.querySelector("#registration");

    form.addEventListener("submit", function(event){
        event.preventDefault();
        let user = username.value;
        if(user !== ""){
            window.location = `app.html?user=${user}`;         
       // console.log(user);
        }else{
            alert("please provide a username");
        } 
    });

}());