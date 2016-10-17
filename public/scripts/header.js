$(function(){
    var loc = window.location.pathname
    if (loc == '/about'){
        $('#app_link').removeClass('active');
        $('#about_link').addClass('active');
    } else if (loc == '/'){
        $('#about_link').removeClass('active');
        $('#app_link').addClass('active');           
    }
});