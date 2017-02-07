'use strict';
/* global Candy, jQuery, Strophe, Mustache, $iq */

var CandyShop = (function (self) { return self; }(CandyShop || {}));

/**
 * Class: Shows an input for searching users and starting private conversations
 */

CandyShop.SearchBox = (function (self, Candy, Strophe, $) {
	var _options = {
		// domain that hosts the search users service
		mucDomain: null,

		// list of fields used by searching. Null value will be replaced by search text value. Non null value will be passed directly
		searchFields: {
			first: null,
			last: null,
			nick: null,
			email: null
		}
	};

	self.about = {
		name: 'Candy Plugin Search Box',
    	version: '1.0'
	};

	var _connection;

	self.init = function (options) {
		$.extend(_options, options);
		
		if (typeof _options.mucDomain !== 'string') {
			console.error('SearchBox plugin: mucDomain option must be set');
		}

		self.applyTranslations();

		self.createSearchBoxButton();

		_connection = Candy.Core.getConnection();
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

		$('.searchList').on('click', 'a', function (e) {
			//var roomJid = this.href.split('#')[1];
			//Candy.Core.Action.Jabber.Room.Join(roomJid);
			Candy.View.Pane.Chat.Modal.hide();
			e.preventDefault();
		});

		$('.searchList .collocutor-search-button').on('click', function(e){
			var text = $('.searchList .collocutor-search-input').val();

			self.search(text);
		});
	};

	self.search = function(text, fields) {
		var iq = $iq(
			{
				type: 'set',
				id: 'search2',
				to: _options.mucDomain
			}).c('query', {xmlns: 'jabber:iq:search'})
			.c('x', {xmlns: 'jabber:x:data', type:'submit'});
		
			$.each(_options.searchFields, function(index, value) {
				iq
				.c('field', {var: index})
				.c('value', value === null ? text : value)
				.up()
				.up();
			});
		
		_connection.sendIQ(iq, self.updateSearchResult);
	};

	self.updateSearchResult = function(iq) {
		console.log(iq);
		var searchResultList = $('item', iq).map(function() {
			var result = {};
			var $item = $(this);
			var resultFields = $.extend({jid: null}, _options.searchFields);

			$.each(resultFields, function(index, value) {
				var $field = $item.find('field[var="' + index + '"]');
				var $value = $field.find('value');

				if ($value) {
					result[index] = $value.text();
				}
			});

			return result;
		}).filter(function(index, value) {
			var isMe = value.jid == Candy.Core.getUser().getJid();

			return !($.isEmptyObject(value) || isMe); 
		});

		self.displaySearchResult(searchResultList);
	};

	self.displaySearchResult = function(list) {
		console.log(list);
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
								<h4>{{title}}</h4>\
								<div class="row">\
										<input type="text" class="form-control collocutor-search-input">\
										<button type="button" class="btn btn-default collocutor-search-button"><span class="glyphicon glyphicon-search"></span></button>\
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