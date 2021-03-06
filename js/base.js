var curr_page = '';
$(function() {
    $.ajax({
        cache:false
    });
    $('#nav').load('partials/nav.html', function() {

        $.getJSON('data/nav.json', {cache:false}, function(nav_data) {
//            console.log(nav_data);
            var curr_page = getPageData(window.location.pathname, nav_data);
            var nav  = $('ul#bs-nav-list');

            $.each(nav_data, function(idx, val) {
                var li = $('<li/>');
                var a  = $('<a/>')
                if(curr_page.url == val.url) {
                    li.addClass('active');

                    if(curr_page.url != '/') $('.navbar-brand').attr('href', '/');
                } else {
                    a.attr('href',val.url);
                }
                a.appendTo(li).text(val.title);
                li.appendTo(nav);
            })

            if(curr_page.init) {
                init[curr_page.init]();
                current_page = curr_page.init;
            }
        });
    });
    $('#footer').load('partials/footer.html', function() {});
});


function ajaxFailHandler(jqxhr, textStatus, error) {
  var err = textStatus + ', ' + error;
  console.log( "Request Failed: " + err);
}

var init = {
    'carousel':function() {
        setTimeout(function() { $("#sip-carousel").carousel({interval:8000}) },1000);

        ko.applyBindings(new FrontPageViewModel());
    },
    'coffee':function() {
        $('#main').load('partials/menu.html', function() {
            ko.applyBindings(new ProductMenuView('coffee'));
        });
    },
    'breakfast':function() {
        $('#main').load('partials/menu.html', function() {
            ko.applyBindings(new ProductMenuView('breakfast'));
        });
    },
    'beer':function() {
        $('#main').load('partials/menu.html', function() {
            ko.applyBindings(new ProductMenuView('beer'));
        });
    },
    'wine':function() {
        $('#main').load('partials/menu.html', function() {
            ko.applyBindings(new ProductMenuView('wine'));
        });
    },
    'food':function() {
        $('#main').load('partials/menu.html', function() {
            ko.applyBindings(new ProductMenuView('food'));
        });
    }
};


function initCarousel() {
    setTimeout(function() { $("#sip-carousel").carousel({interval:5000}) },1000);
}

//function loadHours(containerID, data) {
//    var target = $(containerID), row, time;
//    for(day in data) {
//        row = $('<div>',{class:'row'});
//        time = data[day].open + ' - ' + data[day].close;
//        row.append($('<div>',{class:'col-xs-6',text:day}));
//        row.append($('<div>',{class:'col-xs-6',text:time}));
//        target.append(row);
//    }
//}

function textToObject(val, _type, _class) {
    if($.type(val) == 'string') {
        var type = _type ? '<' + _type + '>' : '<div>';
        var options = {text:val};
        if(_class) options.class = _class;
        return $(type, options);
    } else {
        console.log('working');
    }
    return val;
}

function formatDollar(val, dollarOnly) {
    if(dollarOnly) return '$' + parseInt(val);
    if(val) return '$' + new Number(val).toFixed(2);
    return '';
}

function createMenu(targetID, data) {
    var target = $(targetID), s, i, descriptionFormatter, titleFormatter, priceFormatter, row_class, row;
    if(data.header.display) target.append(createMenuItem($('<h3>', {text:data.header.title}),
        data.header.description ? data.header.description : '',
        getPriceArray(data.header.price),
        'menu-header-row'));
    if(data.header.descriptionFormat) {
        descriptionFormatter = format[data.header.descriptionFormat];
    } else {
        descriptionFormatter = function(item) {
            return item.description;
        };
    }

    if(data.header.titleFormat) {
        titleFormatter = format[data.header.titleFormat];
    } else {
        titleFormatter = function(item) {
            return item.title;
        };
    }
    if(data.header.priceFormat) {
        priceFormatter = format[data.header.priceFormat];
    } else {
        priceFormatter = function(item) {
            var price = getPriceArray(item.price);
            return {
                sm:formatDollar(price.sm),
                lg:formatDollar(price.lg)
            };
        }
    }

    if(data.subheader && data.subheader.display) {
        row = $('<div>',{class:'menu-row'})
        target.append(row.append($("<div>", {text:data.subheader.description, class:'col-sm-offset-1 col-sm-10'})));
        console.log('test');
    }
    for(sec_id in data.sections) {
        row_class = 'menu-subheader-row';
        s = data.sections[sec_id];
        if(s.header && s.header.display) target.append(createMenuItem($('<h2>',{text:s.header.title}),
            s.header.description ? s.header.description : '',
//            getPriceArray(s.header.price),
            '',
            row_class));
        for(item_id in s.items) {
            i = s.items[item_id];
            if(i.disabled) continue;
            target.append(createMenuItem(
                titleFormatter(i),
                descriptionFormatter(i),
                priceFormatter(i, s),
                (current_page == 'wine') ? 'menu-row-wine' : ''
            ));
        }
    }
}

/*
 * Menu price data can be stored as price:value or price:sm.value,lg.value
 */
function getPriceArray(price) {
    if(!price) return {'sm':'','lg':''};
    if($.type(price) == 'string') return {'sm':'','lg':price};
    return price;
}


function createMenuItem(title, description, price, row_class) {
    var box = $('<div>', {class:'row menu-row'}),
        col1 = $('<div>', {class:'col-sm-6 col-sm-offset-1'}),
        col2 = $('<div>', {class:'col-sm-5 menu-price-outer'});

    if(row_class) box.addClass(row_class);
    if(title) col1.append($('<div>', {class:'menu-title-box',html:textToObject(title, 'strong', 'menu-title')}));
    if(description) col1.append($('<div>', {class:'menu-description-box',html:textToObject(description, 'div', 'menu-description')}));

    col2.append(
        $('<div>', {class:'col-xs-6 menu-price-box',html:textToObject(price.sm, 'span', 'menu-price')}),
        $('<div>', {class:'col-xs-6 menu-price-box',html:textToObject(price.lg, 'span', 'menu-price')})
    );

    return box.append([col1, col2]);
}



var format = {
    'coffeePrice':function(item, section) {
        var price = getPriceArray(item.price);
        var sm = formatDollar(price.sm);
        if(sm && section.header.price.sm) sm += ' / ' + (item.size ? item.size.sm : section.header.price.sm);
        var lg = formatDollar(price.lg);
        if(lg && section.header.price.lg) lg += ' / ' + (item.size ? item.size.lg : section.header.price.lg);
        return {
            sm:sm,
            lg:lg
        };
    },
    'beerPrice':function(item, section) {
        var price = getPriceArray(item.price);
        return {
            sm:price.sm ? formatDollar(price.sm) : '',
            lg:price.lg ? formatDollar(price.lg) + ' / ' + section.header.price.lg : ''
        };
    },
    'beerDescription':function(item) {
        var box = $('<div>', {class:'menu-beer-description',text:item.description});
        var sub = $('<div>');
        if(item.abv) sub.append([$('<span>', {text:'ABV: '}),$('<span>', {text:item.abv + '%'})]);
        if(item.ibu) sub.append([$('<span>', {text:'IBU: '}),$('<span>', {text:item.ibu + '%'})]);
        box.append(sub);
        return box;
    },
    'beerTitle':function(item) {
        var box = $('<span>');
        var title = item.title;
        if(item.size) title += ' - ' + item.size;
        box.append($('<strong>', {text:title}));
        //var title = item.title;
        if(item.origin) box.append($('<span>', {text:item.origin, class:'menu-origin'}));
        return box;
    },
    'foodDescription':function(item) {
        var box = $('<div>', {class:'menu-description'});
        box.append($('<span>',{text: item.description}));
        if(item.pairing && false) {
            var pairing = $('<em>',{
                text: 'Suggested pairing: ' + item.pairing.name + ' - $' + item.pairing.price + '/glass'
            })
            box.append($('<div>', {html:pairing}));
        }
        return box;

    },
    'winePrice':function(item) {
        var price = getPriceArray(item.price);
        return {
            sm:price.sm ? formatDollar(price.sm, true) + ' / glass' : '',
            lg:price.lg ? formatDollar(price.lg, true) + ' / bottle' : ''
        };
    },
    'wineTitle':function(item) {
        var box = $('<span>');

        var title = (item.type ? item.type + ' - ' : '') + item.title;
        var extra = item.origin;
        //if(item.year) extra += ', ' + item.year;
        box.append($('<strong>', {text:title}));
        //var title = item.title;
        if(item.origin) box.append($('<span>', {text:extra, class:'menu-origin'}));
        return box;
    },
    'price':function(_price) {
        if(!_price) return $('<span>');
        var price = new Number(_price).toFixed(2);
        var dollarTag = $('<span>',{text:'$',class:'menu-dollarsign'});
        var priceTag = $('<span>',{text:price,class:'menu-price'});

        return $('<span>').append(dollarTag).append(priceTag);
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



/*
 *  Model definition - business hour
 */
function sipHour(_day, _open, _close) {
  var self = this;
  self.day    = ko.observable(_day);
  self.open   = ko.observable(_open);
  self.close  = ko.observable(_close);

  self.getHours = ko.computed(function() {
    return self.open() + ' - ' + self.close();
  });
}

function menuHeader(data) {
    var self = this;
    self.title       = ko.observable(data.title);
    self.description = ko.observable(data.description);
    self.display     = ko.observable(data.display);
    self.size        = ko.observable({
        'sm':data.price.sm,
        'lg':data.price.lg
    });
    console.log(self.title());
}


function menuSection(_header, _items) {
    var self = this;
    self.header = ko.observable(new menuHeader(_header));
    self.items  = ko.observableArray([]);
    self.getSectionTitle = ko.computed(function() {
        return self.header().title();
    });
    self.getSectionDescription = function() {
        return self.header().description();
    }
    for(i in _items) {
        self.items.push(new menuItem(_items[i]));
    }
}



function menuItem(item_data) {
    var self = this;
    self.title = ko.observable(item_data.title);
    self.description = ko.observable(item_data.description);

    self.smallPrice = ko.observable(0);
    self.largePrice = ko.observable(0);
    self.price      = ko.observable(0);
    self.hasSizes   = ko.observable(true);

    if($.type(item_data.price) != 'object') {
        self.price(item_data.price);

        self.hasSizes(false);
    } else {
        self.smallPrice(item_data.price.sm);
        self.largePrice(item_data.price.lg);

    }

    self.showSinglePrice = ko.computed(function() {
       return self.hasSizes();
    });

    self.getSmallPrice = ko.computed(function() {
        return self.smallPrice() ? '$' + self.smallPrice() : '';
    });

    self.getLargePrice = ko.computed(function() {
        return self.largePrice() ? '$' + self.largePrice() : '';
    });

    self.getPrice = ko.computed(function() {
        return self.price() ? '$' + self.price() : '';
    });

}


function ProductMenuView(pageID) {
    var self = this;
    self.id           = ko.observable(pageID);
    self.pageTitle    = ko.observable();
    self.menuHeader   = ko.observable();
    self.menuSections = ko.observableArray([]);
    self.getSectionTitle = function() {
        return self.menuHeader.title;
    }

    $.getJSON('data/' + pageID + '.json', {cache:false}, function(menu_data) {
        self.pageTitle(menu_data.pageTitle);
        document.title += ' - ' + self.pageTitle();
        self.menuHeader(new menuHeader(menu_data.header));
        for(i in menu_data.sections) {
            console.log(menu_data.sections[i]);
            self.menuSections.push(new menuSection(menu_data.sections[i].header, menu_data.sections[i].items));
        }
    }).fail(ajaxFailHandler);

}



/*
 *  Front Page View
 */
function FrontPageViewModel() {
    var self = this;
    self.hours = ko.observableArray([]);
    $.getJSON('data/hours.json', {cache:false}, function(hours_data) {
        for(i in hours_data) {
            self.hours.push(new sipHour(i, hours_data[i].open, hours_data[i].close));
        }
    }).fail(ajaxFailHandler);
}

















