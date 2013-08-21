var nav_map = {
    home:{
        url:'/',
        title:'SiP Boulder'
    },
    menu:{
        url:'/menu.html',
        title:'SiP Boulder'
    }
};


function getPageData(path) {
    if(path == '/' || path == '/index.html') return nav_map.home;
    for(nav_id in nav_map) {
        if(path == nav_map[nav_id].url) return nav_map[nav_id];
    }
    return nav_map.home;
}


$('#bs-nav').load('partials/nav.html', function(){
    var anchor, current_page = getPageData(window.location);
    $('#bs-nav-list > li').each(function() {
        anchor = $(this).find('a');
        if(anchor.attr('href') == current_page.url) {
            $(this).addClass('temp');
        }

    });
});