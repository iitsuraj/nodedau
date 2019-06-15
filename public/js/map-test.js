$(document).ready(function(){
    var doctor = <%- JSON.stringify(doctors) %>;
    var bookmark = <%- JSON.stringify(user.bookmark) %>;
    console.log(doctor)
});