

function getPageData(path, nav_data) {
    if(path == '/' || path == '/index.html') return nav_data.home;
    for(nav_id in nav_data) {
        //console.log(path + ', ' + nav_data[nav_id].url);
        if(path == nav_data[nav_id].url) return nav_data[nav_id];
    }
    return nav_data.home;
}



$(function() {
    $.ajax({
        cache:false
    });
    $('#nav').load('partials/nav.html', function() {

        $.getJSON('data/nav.json', function(nav_data) {

            var curr_page = getPageData(window.location.pathname, nav_data);
            var nav  = $('ul#bs-nav-list');
            document.title = curr_page.pageTitle;

            $.each(nav_data, function(idx, val) {
//                if(val.url != '/') {
                    var li = $('<li/>');
                    if(curr_page.url == val.url) li.addClass('active');
                    var a = $('<a/>').appendTo(li).text(val.title).attr('href',val.url);
                    li.appendTo(nav);

//                }
            })
            if(curr_page.init) eval(curr_page.init);

//            $('#main').load(
//                'partials/' + curr_page.partial + '.html',
//                curr_page.init ? eval(curr_page.init) : function() {}
//            );


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

function initMorningMenu() {
    $.getJSON('data/coffee.json', {cache:false}, function(menu_data) {
        console.log(menu_data);
        createMenu('#sip-menu', menu_data, true);
    })
        .fail(function( jqxhr, textStatus, error ) {
          var err = textStatus + ', ' + error;
          console.log( "Request Failed: " + err);
        });
    $.getJSON('data/breakfast.json', {cache:false}, function(food_data) {
        createSimpleMenu('#sip-breakfast', food_data);
    });
    $.getJSON('data/addons.json', {cache:false}, function(addon_data) {
        createSimpleMenu('#sip-addons', addon_data);
    }).fail(function( jqxhr, textStatus, error ) {
          var err = textStatus + ', ' + error;
          console.log( "Request Failed: " + err);
        });


}


function initEveningMenu() {
    $.getJSON('data/beer.json', {cache:false}, function(beer_data) {
        createBeerMenu('#sip-menu', beer_data);
        console.log(beer_data);
    }).fail(function( jqxhr, textStatus, error ) {
          var err = textStatus + ', ' + error;
          console.log( "Request Failed: " + err);
        });
}


function createBeerMenu(containerID, menu) {
    var target = $(containerID),
        table = $('<table>', {class:'table menu-table'}),
        tableBody = $('<tbody>'),
        td, tr, displayType;
    target.append($('<h2>', {text:menu.title}));
    for(i in menu.types) {
        tr = $('<tr>');
        displayTitle = menu.types[i].title;
        if(menu.types[i].price) displayTitle += ' - $' +  menu.types[i].price;
        td = $('<td>', {colspan:3,html:$('<h3>',{text:displayTitle,class:'text-center'})});
        //td = $('<td>', {colspan:2,text:"text"});
//        tr.append($('<td>', {text:menu.types[i].title})).append(td);
        //tr.append($('<td>', {text:menu.types[i].price}));
        tr.append(td);
        tableBody.append(tr);
        menu.types[i].items.forEach(function(val, idx) {
            tr = $('<tr>');
            tr.append($('<td>', {text:val.title}));
            tr.append($('<td>', {text:val.origin}));
            tr.append($('<td>', {text:val.abv}));
            tableBody.append(tr);
            tableBody.append($('<tr>').append($('<td>', {colspan:3,text:val.description})));
        });


    }
    target.append(table.append(tableBody));
}


function createSimpleMenu(containerID, menu) {
    var target = $(containerID),
        table = $('<table>', {class:'table menu-table'}),
        tableBody = $('<tbody>'),
        tr;
    target.append($('<h2>', {text:menu.title}));
    for(i in menu.items) {
        tr = $('<tr>');
        tr.append($('<td>', {text:menu.items[i].title}));
        tr.append($('<td>', {text:menu.items[i].price}));
        tableBody.append(tr);
    }
    target.append(table.append(tableBody));
}

function createMenu(containerID, menu, is_complex) {
    var descriptionContents,
        full_item,
        h1,
        h2,
        span,
        strong,
        table,
        tableBody,
        tr,
        td1, td2, td3, target = $(containerID);


    for(section in menu) {
        h1 = $('<h1>').text(menu[section].category);
        //h2 = $('<h2>').text(menu[section].sizes);
        //span = $('<span>', {text:menu[section].sizes,class:'pull-right'});
        target.append(h1);
        table = $('<table>', {class:'table menu-table'});
        //target.append(h1.append($('<span>').text(' ('+ menu[section].sizes + ')')));

        if(is_complex) {
            tableBody = $('<thead>');
            td1 = $('<th>', {class:'food_col_1'});
            td2 = $('<th>', {text:menu[section].sizes.sm,class:'food_col_2'});
            tr  = $('<tr>').append(td1).append(td2);
            //tableBody.append($('<tr>').append(td1).append(td2).append(td3))
            if(is_complex) {
                tr.append($('<th>', {text:menu[section].sizes.lg,class:'food_col_3'}));
            }
            table.append(tableBody.append(tr));
        }
        for(i in menu[section].items) {
            strong = $('<strong>', {text:menu[section].items[i].title});
            descriptionContents = menu[section].items[i].description ?
                {text:menu[section].items[i].description} :
                {html:'&nbsp;'}
            full_item = $('<div>')
                .append($('<strong>', {text:menu[section].items[i].title}))
                .append($('<div>', descriptionContents));
            td1 = $('<td>', {class:'food_col_1'}).append(full_item);
            td2 = $('<td>', {class:'food_col_2', text:menu[section].items[i].price.sm});
            td3 = $('<td>', {class:'food_col_3', text:menu[section].items[i].price.lg});
            table.append(tableBody.append($('<tr>').append(td1).append(td2).append(td3)));
            //target.append($('<div>').text(menu[section].items[i].title));
        }
        target.append(table);
        //console.log(menu[section].category);
    }
}






















