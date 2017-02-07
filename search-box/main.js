'use strict';
/* global Candy, jQuery, Strophe, Mustache, $iq */

var CandyShop = (function (self) { return self; }(CandyShop || {}));

/**
 * Class: Shows an input for searching users and starting private conversations
 */

CandyShop.SearchBox = (function (self, Candy, Strophe, $) {
	var _options = {

	};

	var _timer = 0;

	self.init = function (options) {
		$.extend(_options, options);
		self.applyTranslations();

		self.createSearchBoxButton();
	};

	self.createSearchBoxButton = function () {
		var html = '<li id="search-box-control" data-tooltip="' + $.i18n._('candyshopSearchBox') + '" aria-label="Search"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></li>';
		$('#chat-toolbar .usercount').after(html);
		$('#search-box-control').on('click', function () {
			CandyShop.SearchBox.show(this);
		});
	};

	self.show = function (elem) {
		var html = Mustache.to_html(CandyShop.SearchBox.Template.search, {
			title: $.i18n._('candyshopSearchBox'),
			searchResultList: _options.searchResult
		});
		Candy.View.Pane.Chat.Modal.show(html, true);

		$('.searchList').bind('click', 'a', function (e) {
			var roomJid = this.href.split('#')[1];
			//Candy.Core.Action.Jabber.Room.Join(roomJid);
			Candy.View.Pane.Chat.Modal.hide();
			e.preventDefault();
		});

		$('.searchList .collocutor-search-input').bind('keyup', function(e){
			if (_timer > 0) {
				clearTimeout(_timer);
			}

			_timer = setTimeout(self.search, 1000);
		});
	};

	self.search = function(text) {
		
	};

	self.applyTranslations = function () {
		var translations = {
			'en': 'Search сontacts',
			'ru': 'Поиск контактов',
			'de': 'Kontaktsuche',
			'fr': 'Сontacts de recherche',
			'nl': 'Search contacten',
			'es': 'Contactos de búsqueda'
		};
		$.each(translations, function (k, v) {
			if (Candy.View.Translation[k]) {
				Candy.View.Translation[k].candyshopSearchBox = v;
			}

		});
	};

	return self;
}(CandyShop.SearchBox || {}, Candy, Strophe, jQuery));

CandyShop.SearchBox.Template = (function (self) {
	var searchTemplate = '<div class="container-fluid">\
						<div class="searchList">\
							<h2>{{title}}</h2>\
							<div class="row">\
								<input type="text" class="form-control collocutor-search-input">\
							</div>\
							<div class="row">\
								<ul class="collocutor-search-result">\
									{{#searchResultList}}\
									<li><a href="#{{jid}}">{{name}}</a></li>\
									{{/searchResultList}}\
								</ul>\
							</div>\
						 </div>\
						 </div>';

	self.search = searchTemplate;

	return self;
})(CandyShop.RoomPanel.Template || {});