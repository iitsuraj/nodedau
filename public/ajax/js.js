$(window).on('load', function(){
    $("#ajax").click(function(){
        $.ajax({
            method: 'get',
            url: "/ajaxapi",
             success: function(result){
                console.log("success");
                console.log(result);
            },
            error: function(err){
                console.log('Error');
                console.log(err.responseText)
            }
        });
    });
    $(".bookmark-remove").each(function(){
        var bi = $(this).find('.bookmark_id').val();
    $(this).click(function(){
        $.ajax({
            method: 'post',
            data: {
                bookmark_id: bi
            },
            url: '/bookmark-remove',
            success: function(result){
                $('#msg').html(result)
                $("#success-alert").show();
                setTimeout(function() { $("#success-alert").hide(); }, 5000);   
            },
            error: function(err){
                console.log(err.responseText);
            }
        })
    });
});
$(".bookmark-add").each(function(){
    var bi = $(this).find('.doctor_id').val();
    $(this).click(function(){
        $.ajax({
            method: 'post',
            data: {
                doctor_id: bi
            },
            url: '/bookmarks',
            success: function(result){
                $('#msg').html(result)
                $("#success-alert").show();
                setTimeout(function() { $("#success-alert").hide(); }, 5000);   
            },
            error: function(err){
                console.log(err.responseText);
            }
        })
    });
});
});