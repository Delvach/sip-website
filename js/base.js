var nav_map = {
    home:{
        url:'/',
        title:'Home',
        pageTitle:'SiP Boulder',
        partial:'carousel',
        init:function() {
            $('.carousel').carousel({interval:30000})
        }
    },
    menu:{
        url:'/breakfast_menu.html',
        title:'Coffee & Breakfast',
        pageTitle:'SiP Boulder',
        partial:'menu',
        init:function() {}
    },
    drinks:{
        url:'/drinks.html',
        title:'Drinks & Appetizers',
        pageTitle:'SiP Boulder - Drinks',
        partial:'drinks',
        init:function() {}
    }

};


function getPageData(path) {
    if(path == '/' || path == '/index.html') return nav_map.home;
    for(nav_id in nav_map) {
        console.log(path + ', ' + nav_map[nav_id].url);
        if(path == nav_map[nav_id].url) return nav_map[nav_id];
    }
    return nav_map.home;
}





$(function() {
    var page = getPageData(window.location.pathname);

    $('#nav').load('partials/nav.html', function() {
        var nav  = $('ul#bs-nav-list');
        document.title = page.title;

        $.each(nav_map, function(idx, val) {
            if(val.url != '/') {
                var li = $('<li/>');
                if(page.url == val.url) li.addClass('active');
                var a = $('<a/>').appendTo(li).text(val.title).attr('href',val.url);
                li.appendTo(nav);

            }
        })


    });



    // Load page-based partial
    $('#main').load('partials/' + page.partial + '.html', page.init ? page.init : function() {});

    $('#footer').load('partials/footer.html', function() {});
});
