'use strict';
/* global Candy, jQuery, Strophe, Mustache, $iq */

var CandyShop = (function(self) {return self;}(CandyShop || {}));

/**
 * Class: Shows an input for searching users and starting private conversations
 */

CandyShop.SearchBox = (function(self, Candy, Strophe, $) {
    self.init = function(options) {
        $.extend(_options, options);
        self.applyTranslations();

        self.showSearchBox();
    };

    self.createSearchBoxButton = function() {
        var html = '<li id="search-box-control" data-tooltip="' + $.i18n._('candyshopSearchBox') + '" aria-label="Search"></label>><span class="glyphicon glyphicon-search" aria-hidden="true"></span></li>';
		$('.chat-toolbar .usercount').before(html);
		$('#search-box-control').on('click', function() {
			CandyShop.SearchBox.show(this);
		});
    };

    self.show = function(elem) {
        console.log("User clicks search button");
    };

    self.applyTranslations = function() {
		var translations = {
		  'en' : 'Search сontacts',
		  'ru' : 'Поиск контактов',
		  'de' : 'Kontaktsuche',
		  'fr' : 'Сontacts de recherche',
		  'nl' : 'Search contacten',
		  'es' : 'Contactos de búsqueda'
		};
		$.each(translations, function(k, v) {
			if(Candy.View.Translation[k]) {
				Candy.View.Translation[k].candyshopSearchBox = v;
			}

		});
	};

    return self;
});