



$(function() {
    $.ajax({
        cache:false
    });
    $('#nav').load('partials/nav.html', function() {

        $.getJSON('data/nav.json', {cache:false}, function(nav_data) {

            var curr_page = getPageData(window.location.pathname, nav_data);
            var nav  = $('ul#bs-nav-list');
            if(curr_page.pageTitle) document.title += ' - ' + curr_page.pageTitle;
            if(curr_page.pageTitle) {
                $('#main').prepend($('<h1>',{text:curr_page.pageTitle,class:'page-title'}));
            }
            $.each(nav_data, function(idx, val) {
                var li = $('<li/>');
                if(curr_page.url == val.url) li.addClass('active');
                var a = $('<a/>').appendTo(li).text(val.title).attr('href',val.url);
                li.appendTo(nav);
            })
            if(curr_page.init) init[curr_page.init]();
        });
    });
    $('#footer').load('partials/footer.html', function() {});
});


function initCarousel() {
    setTimeout(function() { $("#sip-carousel").carousel({interval:5000}) },1000);
}

function loadHours(containerID, data) {
    var target = $(containerID), row, time;
    for(day in data) {
        row = $('<div>',{class:'row'});
        time = data[day].open + ' - ' + data[day].close;
        row.append($('<div>',{class:'col-xs-6',text:day}));
        row.append($('<div>',{class:'col-xs-6',text:time}));
        target.append(row);
    }
}

function textToObject(val, _type, _class) {
    if($.type(val) == 'string') {
        var type = _type ? '<' + _type + '>' : '<div>';
        var options = {text:val};
        if(_class) options.class = _class;
        return $(type, options);
    }
    return val;
}


function createMenu(targetID, data) {
    var target = $(targetID), s, i;
    if(data.header.display) target.append(createMenuItem($('<h2>',{text:data.header.title}), data.header.description, data.header.price.sm, data.header.price.lg, 'menu-header-row'));
    for(sec_id in data.sections) {
        s = data.sections[sec_id];
        target.append(createMenuItem($('<h3>',{text:s.header.title}), s.header.description, s.header.price.sm, s.header.price.lg, 'menu-subheader-row'));
        for(item_id in s.items) {
            i = s.items[item_id];
            target.append(createMenuItem(
                i.title,
                i.description,
                i.price.sm,
                i.price.lg
            ));
        }
    }
}


function createMenuItem(title, description, price1, price2, row_class) {
    var box = $('<div>', {class:'row menu-row'}),
        col1 = $('<div>', {class:'col-sm-6'}),
        col2 = $('<div>', {class:'col-sm-6'});
    if(!price1) var price1 = '';
    if(!price2) var price2 = '';
    if(row_class) box.addClass(row_class);
    if(title) col1.append($('<div>', {class:'menu-title-box',html:textToObject(title, 'strong', 'menu-title')}));
    if(description) col1.append($('<div>', {class:'menu-description-box',html:textToObject(description, 'div', 'menu-description')}));

    col2.append(
        $('<div>', {class:'col-xs-6 menu-price-box',html:textToObject(price1, 'div', 'menu-price')}),
        $('<div>', {class:'col-xs-6 menu-price-box',html:textToObject(price2, 'div', 'menu-price')})
    );

    return box.append([col1, col2]);
}


var init = {
    'carousel':function() {
        setTimeout(function() { $("#sip-carousel").carousel({interval:5000}) },1000);
        $.getJSON('data/hours.json', {cache:false}, function(data) {
            loadHours('#hours', data);
        }).fail(function( jqxhr, textStatus, error ) {
          var err = textStatus + ', ' + error;
          console.log( "Request Failed: " + err);
        });


    },
    'coffee':function() {
        $.getJSON('data/coffee.json', {cache:false}, function(menu_data) {
            createMenu('#sip-menu', menu_data);

            $.getJSON('data/addons.json', {cache:false}, function(addon_data) {
                create.simpleMenu('#sip-menu', addon_data);
            });
        }).fail(function( jqxhr, textStatus, error ) {
          var err = textStatus + ', ' + error;
          console.log( "Request Failed: " + err);
        });
    },
    'breakfast':function() {
        $.getJSON('data/breakfast.json', {cache:false}, function(food_data) {
            create.simpleMenu('#sip-menu', food_data);
        });
    },
    'beer':function() {
        $.getJSON('data/beer.json', {cache:false}, function(beer_data) {
            create.beerMenu('#sip-menu', beer_data);
        });
    },
    'wine':function() {
        $.getJSON('data/wine.json', {cache:false}, function(wine_data) {
            create.wineMenu('#sip-menu', wine_data);
        });
    },
    'food':function() {
        $.getJSON('data/food.json', {cache:false}, function(menu_data) {
            createMenu('#sip-menu', menu_data);
        });
    }
};

var format = {
    'price':function(_price) {
        if(!_price) return $('<span>');
        var price = new Number(_price).toFixed(2);
        var dollarTag = $('<span>',{text:'$',class:'menu-dollarsign'});
        var priceTag = $('<span>',{text:price,class:'menu-price'});

        return $('<span>').append(dollarTag).append(priceTag);
    }
};

var factory = {
    'menuItem':function(target, title, price, description) {
        var tr = $('<tr>'), num_rows = 1;
        tr.append($('<td>').append($('<strong>',{text:title})));

        if(price) {
            //var price_data = $.makeArray(price);
            if($.type(price) == 'string') {
                console.log('test');
                tr.append($('<td>', {class:'col-price'})).append($('<td>', {html:format.price(price),class:'col-price'}));
                num_rows++;
            } else {
                var sm = price.sm ? format.price(price.sm) : '';
                var lg = price.lg ? format.price(price.lg) : '';
                tr.append($('<td>', {html:sm,class:'col-price'})).append($('<td>', {html:lg,class:'col-price'}));
                num_rows += 2;
            }
        }
        target.append(tr);
        if(description) {
            target.append($('<tr>').append($('<td>',{colspan:3,class:'description-row',html:$('<em>',{text:description,class:'menu-description'})})));
        }

        return tr;
    },
    'td':function() {

    }
};

var create = {
    'simpleMenu':function(containerID, menu) {
        var target = $(containerID),
            table = $('<table>', {class:'table menu-table'}),
            tableBody = $('<tbody>'),
            tr;
        target.append($('<h2>', {text:menu.title}));
        menu.items.forEach(function(val) {
            factory.menuItem(tableBody, val.title, val.price, val.description);
        });
        target.append(table.append(tableBody));
    },
    'menu':function(containerID, menu) {
        var descriptionContents,
            full_item,
            h2,
            span,
            strong,
            table,
            tableBody,
            tr,
            td1, td2, td3, target = $(containerID);

        for(section in menu) {
            h2 = $('<h2>').text(menu[section].category);
            target.append(h2);
            table = $('<table>', {class:'table menu-table'});

            if(menu[section].sizes) {
                tableBody = $('<thead>');
                td1 = $('<th>', {class:''});
                td2 = $('<th>', {text:menu[section].sizes.sm,class:'menu-size-header'});
                tr  = $('<tr>').append(td1).append(td2);
                tr.append($('<th>', {text:menu[section].sizes.lg,class:'menu-size-header'}));
                table.append(tableBody.append(tr));
            }
            tableBody = $('<tbody>');
            if(menu[section].description) {
                tableBody.append($('<tr>').append($('<td>',{colspan:3,text:menu[section].description})));
            }

            menu[section].items.forEach(function(val) {
                factory.menuItem(tableBody, val.title, val.price,val.description);
            });
            target.append(table.append(tableBody));
        }
    },
    'beerMenu':function(containerID, menu) {
        var target = $(containerID),
        table = $('<table>', {class:'table menu-table'}),
        tableBody = $('<tbody>'),
        td, tr, displayTitle, displayType;
        target.append($('<h2>', {text:menu.title}));
        for(i in menu.types) {
            tr = $('<tr>');
            displayTitle = menu.types[i].title;
            if(menu.types[i].price) displayTitle += ' - $' +  menu.types[i].price;
            td = $('<td>', {class:'section-description',colspan:3,html:$('<h3>',{text:displayTitle,class:'text-center'})});
            //td = $('<td>', {colspan:2,text:"text"});
    //        tr.append($('<td>', {text:menu.types[i].title})).append(td);
            //tr.append($('<td>', {text:menu.types[i].price}));
            tr.append(td);
            tableBody.append(tr);
            menu.types[i].items.forEach(function(val, idx) {
                tr = $('<tr>');
                var displayTitle = val.title;
                if(val.size) displayTitle += ' (' + val.size + ')';
                tr.append($('<td>', {html:$('<strong>',{text:displayTitle})}));
                tr.append($('<td>', {text:val.origin}));
                tr.append($('<td>', {text:getBeerData(val.abv, val.ibu)}));
                tableBody.append(tr);
                tableBody.append($('<tr>').append($('<td>', {colspan:3,text:val.description,class:"description-row"})));
            });


        }
        target.append(table.append(tableBody));
    },
    'wineMenu':function(containerID, menu) {
        var target = $(containerID),
        table = $('<table>', {class:'table menu-table'}),
        tableBody = $('<tbody>'),
        td, tr, displayType;
        target.append($('<h2>', {text:menu.title}));

        tableBody = $('<thead>');
        tr = $('<tr>');
        $('<th>', {colspan:2}).appendTo(tr);
        $('<th>', {text:'Glass'}).appendTo(tr);
        $('<th>', {text:'Bottle'}).appendTo(tr);
        tr.appendTo(tableBody);
        table.append(tableBody)

        //target.append(tr.appendTo(tableBody));

        tableBody = $('<tbody>');
        menu.items.forEach(function(val) {
            tr = $('<tr>');
            $('<td>', {html:$('<strong>',{text:val.type})}).appendTo(tr);
            $('<td>', {text:[val.title, val.origin].join(' ')}).appendTo(tr);
            $('<td>', {text:getPrice(val.price.glass)}).appendTo(tr);
            $('<td>', {text:getPrice(val.price.bottle)}).appendTo(tr);

            tr.appendTo(tableBody);
            if(val.description) {
                tr = $('<tr>');
                tr.append($('<td>',{colspan:4,text:val.description,class:'description-row'}));
                tr.appendTo(tableBody);
            }

        });
        target.append(table.append(tableBody));
    }
};

function getPageData(path, nav_data) {
    if(path == '/' || path == '/index.html') return nav_data.home;
    for(nav_id in nav_data) {
        //console.log(path + ', ' + nav_data[nav_id].url);
        if(path == nav_data[nav_id].url) return nav_data[nav_id];
    }
    return nav_data.home;
}

function getPrice(val) {
    return val ? '$' + val : '';
}

function getBeerData(abv, ibu) {
    if(abv) return abv + '% ABV';
    if(ibu) return ibu + ' IBU';
    return '';
}























