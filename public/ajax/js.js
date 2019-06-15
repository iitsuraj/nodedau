$(window).on('load', function () {

    $(".bookmark-remove").each(function () {
        var bi = $(this).find('.bookmark_id').val();
        $(this).click(function () {
            $.ajax({
                method: 'post',
                data: {
                    bookmark_id: bi
                },
                url: '/panel/bookmark-remove',
                success: function (result) {
                    $('#msg').html(result)
                    $("#success-alert").show();
                    setTimeout(function () { $("#success-alert").hide(); }, 5000);
                },
                error: function (err) {
                    console.log(err.responseText);
                }
            })
        });
    });
    $(".bookmark-add").each(function () {
        var bi = $(this).find('.doctor_id').val();
        $(this).click(function () {
            $.ajax({
                method: 'post',
                data: {
                    doctor_id: bi
                },
                url: '/panel/bookmarks',
                success: function (result) {
                    $('#msg').html(result)
                    $("#success-alert").show();
                    setTimeout(function () { $("#success-alert").hide(); }, 5000);
                },
                error: function (err) {
                    console.log(err.responseText);
                }
            });
        });
    });
    $('#search').keyup(function () {

        var search_term = $(this).val();

        $.ajax({
            method: 'POST',
            url: '/search',
            data: {
                search_term
            },
            success: function (json) {

                console.log(json)

                $('#search-results').empty();
                for (let i = 0; i < json.length; i++) {
                    var html = "";
                    html += '<li class="result-entry" data-suggestion="Target 1" data-position="1" data-type="type" data-analytics-type="merchant"><a href="/doctors/' + json[i]._id + '" class="result-link"><div class="media"><div class="media-left"><img src="http://mellon.co.tz/wp-content/uploads/2016/05/noimage.gif" class="media-object"></div><div class="media-body"><h4 class="media-heading">' + json[i].name + '</h4><p>0 offers available</p></div></div></a></li>'
                    $('#search-results').append(html);
                }
            },

            error: function (error) {
                console.log(err);
            }
        });
    });
});