var nav_map = {
    home:{
        url:'/',
        title:'SiP Boulder',
        partial:'carousel'
    },
    menu:{
        url:'/menu.html',
        title:'SiP Boulder',
        partial:'menu'
    }
};


function getPageData(path) {
    if(path == '/' || path == '/index.html') return nav_map.home;
    for(nav_id in nav_map) {
        if(path == nav_map[nav_id].url) return nav_map[nav_id];
    }
    return nav_map.home;
}





$(function() {
    var anchor, page = getPageData(window.location);
    document.title = page.title;


    $('#nav').load('partials/nav.html', function(){
        $('#bs-nav-list > li').each(function() {
            anchor = $(this).find('a');
            if(anchor.attr('href') == page.url) {
                $(this).addClass('active');
            }

        });
    });


    $('#main').load('partials/' + page.partial + '.html', function() {});

    $('#footer').load('partials/footer.html', function() {});
});
