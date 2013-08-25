

function getPageData(path, nav_data) {
    if(path == '/' || path == '/index.html') return nav_data.home;
    for(nav_id in nav_data) {
        console.log(path + ', ' + nav_data[nav_id].url);
        if(path == nav_data[nav_id].url) return nav_data[nav_id];
    }
    return nav_data.home;
}



$(function() {

    $('#nav').load('partials/nav.html', function() {

        $.getJSON('data/nav.json', function(nav_data) {

            var curr_page = getPageData(window.location.pathname, nav_data);
            var nav  = $('ul#bs-nav-list');
            document.title = curr_page.title;

            $.each(nav_data, function(idx, val) {
                if(val.url != '/') {
                    var li = $('<li/>');
                    if(curr_page.url == val.url) li.addClass('active');
                    var a = $('<a/>').appendTo(li).text(val.title).attr('href',val.url);
                    li.appendTo(nav);

                }
            })

            $('#main').load(
                'partials/' + curr_page.partial + '.html',
                curr_page.init ? eval(curr_page.init) : function() {}
            );


        })
        .fail(function( jqxhr, textStatus, error ) {
          var err = textStatus + ', ' + error;
          console.log( "Request Failed: " + err);
        });

    });



    // Load page-based partial
    //$('#main').load('partials/' + page.partial + '.html', page.init ? page.init : function() {});

    $('#footer').load('partials/footer.html', function() {});
});


function initCarousel() {
    setTimeout(
        function() { $("#sip-carousel").carousel({interval:5000}) },
        1000);
}