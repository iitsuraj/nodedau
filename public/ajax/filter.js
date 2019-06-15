$(document).ready(function() {
    var reciveddata;
    $.ajax({
        method: 'POST',
        url: '/ajax/api/filter',
        dataType: 'json',
        success: function(json) {
          reciveddata=json
        },
  
        error: function(error) {
          console.log(err);
        }
      });
    $("select[name='orderby']").change(function() {
            if ($(this).val() === "Women")
            {
                $('#filter-data').empty();
                var filteredValue = reciveddata.filter(function (item) {
                    return item.profile.gender == "woman";
              });
              for (let i = 0; i < filteredValue.length; i++) {
                  var html = "";
                html += '<div class="strip_list wow fadeIn"><a href="#0" class="wish_bt"></a><figure><a href="/doctor/'+filteredValue[i]._id+'"><img src="http://via.placeholder.com/565x565.jpg" alt=""></a></figure><small>'+filteredValue[i].category.name+'</small><h3>'+filteredValue[i].profile.name+'</h3><p>Id placerat tacimates definitionem sea, prima quidam vim no. Duo nobis persecuti cuodo....</p><span class="rating"><i class="icon_star voted"></i><i class="icon_star voted"></i><i class="icon_star voted"></i><i class="icon_star"></i><i class="icon_star"></i> <small>(145)</small></span><a href="badges.html" data-toggle="tooltip" data-placement="top" data-original-title="Badge Level" class="badge_list_1"><img src="/img/badges/badge_1.svg" width="15" height="15" alt=""></a><ul><li><a href="#0"  class="btn_listing">View on Map</a></li><li><a href="https://www.google.com/maps/dir//Assistance+%E2%80%93+H%C3%B4pitaux+De+Paris,+3+Avenue+Victoria,+75004+Paris,+Francia/@48.8606548,2.3348734,14z/data=!4m15!1m6!3m5!1s0x0:0xa6a9af76b1e2d899!2sAssistance+%E2%80%93+H%C3%B4pitaux+De+Paris!8m2!3d48.8568376!4d2.3504305!4m7!1m0!1m5!1m1!1s0x47e67031f8c20147:0xa6a9af76b1e2d899!2m2!1d2.3504327!2d48.8568361" target="_blank">Directions</a></li><li><a href="/doctor/'+filteredValue[i]._id+'">Book now</a></li></ul></div>'
                $('#filter-data').append(html);
            }
            }
            if ($(this).val() === "Men")
            {
                $('#filter-data').empty();
                var filteredValue = reciveddata.filter(function (item) {
                    return item.profile.gender == "male";
              });
            //   console.log(filteredValue)
              for (let i = 0; i < filteredValue.length; i++) {
                  var html = "";
                html += '<div class="strip_list wow fadeIn"><a href="#0" class="wish_bt"></a><figure><a href="/doctor/'+filteredValue[i]._id+'"><img src="http://via.placeholder.com/565x565.jpg" alt=""></a></figure><small>'+filteredValue[i].category.name+'</small><h3>'+filteredValue[i].profile.name+'</h3><p>Id placerat tacimates definitionem sea, prima quidam vim no. Duo nobis persecuti cuodo....</p><span class="rating"><i class="icon_star voted"></i><i class="icon_star voted"></i><i class="icon_star voted"></i><i class="icon_star"></i><i class="icon_star"></i> <small>(145)</small></span><a href="badges.html" data-toggle="tooltip" data-placement="top" data-original-title="Badge Level" class="badge_list_1"><img src="/img/badges/badge_1.svg" width="15" height="15" alt=""></a><ul><li><a href="#0"  class="btn_listing">View on Map</a></li><li><a href="https://www.google.com/maps/dir//Assistance+%E2%80%93+H%C3%B4pitaux+De+Paris,+3+Avenue+Victoria,+75004+Paris,+Francia/@48.8606548,2.3348734,14z/data=!4m15!1m6!3m5!1s0x0:0xa6a9af76b1e2d899!2sAssistance+%E2%80%93+H%C3%B4pitaux+De+Paris!8m2!3d48.8568376!4d2.3504305!4m7!1m0!1m5!1m1!1s0x47e67031f8c20147:0xa6a9af76b1e2d899!2m2!1d2.3504327!2d48.8568361" target="_blank">Directions</a></li><li><a href="/doctor/'+filteredValue[i]._id+'">Book now</a></li></ul></div>'
                $('#filter-data').append(html);
            }
            }
            if ($(this).val() === "date")
            {
                $('#filter-data').empty();
                var filteredValue = reciveddata.reverse();
                for (let i = 0; i < filteredValue.length; i++) {
                  var html = "";
                  html += '<div class="strip_list wow fadeIn"><a href="#0" class="wish_bt"></a><figure><a href="/doctor/'+filteredValue[i]._id+'"><img src="http://via.placeholder.com/565x565.jpg" alt=""></a></figure><small>'+filteredValue[i].category.name+'</small><h3>'+filteredValue[i].profile.name+'</h3><p>Id placerat tacimates definitionem sea, prima quidam vim no. Duo nobis persecuti cuodo....</p><span class="rating"><i class="icon_star voted"></i><i class="icon_star voted"></i><i class="icon_star voted"></i><i class="icon_star"></i><i class="icon_star"></i> <small>(145)</small></span><a href="badges.html" data-toggle="tooltip" data-placement="top" data-original-title="Badge Level" class="badge_list_1"><img src="/img/badges/badge_1.svg" width="15" height="15" alt=""></a><ul><li><a href="#0"  class="btn_listing">View on Map</a></li><li><a href="https://www.google.com/maps/dir//Assistance+%E2%80%93+H%C3%B4pitaux+De+Paris,+3+Avenue+Victoria,+75004+Paris,+Francia/@48.8606548,2.3348734,14z/data=!4m15!1m6!3m5!1s0x0:0xa6a9af76b1e2d899!2sAssistance+%E2%80%93+H%C3%B4pitaux+De+Paris!8m2!3d48.8568376!4d2.3504305!4m7!1m0!1m5!1m1!1s0x47e67031f8c20147:0xa6a9af76b1e2d899!2m2!1d2.3504327!2d48.8568361" target="_blank">Directions</a></li><li><a href="/doctor/'+filteredValue[i]._id+'">Book now</a></li></ul></div>'
                  $('#filter-data').append(html);
              }
            }
    });
  });