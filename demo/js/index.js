/* global CjsBaseClass,CJS_DEBUG_MODE_0,CJS_DEBUG_MODE_1,CJS_DEBUG_MODE_2 */
var umsapp = umsapp || {};
umsapp.Tindex = function($, objname, options)
{
	'use strict';
	var self = this;

	this.create = function()
	{
		self.events.onCreate();
	};

	this.onReady = function()
	{
		// CODE ON APLICATION IS READY
		$('#tmpl_dom_data').mustache();

		$('#tmpl_jquery').mustache
		(
			{
				'url'              : 'data/ages.json',
				'keep'             : false,
				'beforeRenderJson' : function(p_json)
				{
					p_json.data[0].name = 'Xespeta';
					return p_json;
				},
				'beforeRenderItem' : function(p_object)
				{
					if (p_object.age === 34)
					{
						p_object.age = p_object.age * 100;
					}
					return p_object;
				}
			}
		);

		// Simple
		$('#tmpl_original').mustache
		(
			{
				'url'   : 'data/ages.json',
				'method': 'POST',
				'target': 'rnd_original'
			}
		);

		// Extra
		$('#tmpl_extra').mustache
		(
			{
				'url'   : 'data/ages.json',
				'method': 'POST',
				'target': 'rnd_extra',
				'extra' : {
					'slug': 'Extra data text'
				}
			}
		);

		// Custom Tags
		$('#tmpl_custom_tags').mustache
		(
			{
				'name'   : 'custom-tags',
				'url'    : 'data/ages.json',
				'method' : 'POST',
				'tags'   : ['[[', ']]'],
				'target' : 'rnd_custom_tags'
			}
		);

		// JSON SOURCE
		var json_source = {
			"data":
			[
				{
					"name": "Marcelo XP",
					"age": 42
				},
				{
					"name": "DJ Gomes",
					"age": 34
				}
			]
		};

		$('#tmpl_json_source').mustache
		(
			{
				'source': json_source,
				'target': 'rnd_json_source'
			}
		);

		//
		var html = 
		[
			'<h4><span class="label label-success">',
			'Callback: Done print table',
			'</span></h4>'
		];
		var callback = function()
		{
			var $node = $('#table_with_callback').parent();
			$node.append(html.join(''));
		};

		$('#tmpl_with_callback').mustache
		(
			{
				'url'   : 'data/ages.json',
				'target': 'rnd_with_callback'
			},
			function()
			{
				setTimeout(callback, 1000);
			}
		);

		$('#tmpl_phones').mustache
		(
			{
				'url'   : 'data/phones.json',
				'target': 'rnd_phones',
				'append': true
			}
		);

		self.events.onReady();
	};

	this.start = function()
	{
		self.events.onStarted();
	};

	this.processTriggers = function()
	{

	};

	this.onElementsEvents = function()
	{
		$(document).on
		(
			'click',
			'#btn-render',
			function(e)
			{
				e.preventDefault();
				self.page = (empty(self.page)) ? 2 : (self.page + 1);
				$('#tmpl_phones').mustache
				(
					{
						'url'   : 'data/phones.json',
						'data'  : { 'page' : self.page },
						'target': 'rnd_phones',
						'append': true
					}
				);
			}
		);

		$(document).on
		(
			'click',
			'#btn-render-cache-1',
			function(e)
			{
				e.preventDefault();
				$('#tmpl_phones_cache').mustache
				(
					{
						'url'   : 'data/phones-cache-1.json',
						'data'  : { 'page' : self.page },
						'cache' : true,
						'target': 'rnd_phones_cache',
						'append': true
					}
				);
			}
		);

		$(document).on
		(
			'click',
			'#btn-render-cache-2',
			function(e)
			{
				e.preventDefault();
				$('#tmpl_phones_cache').mustache
				(
					{
						'url'   : 'data/phones-cache-2.json',
						'data'  : { 'page' : self.page },
						'cache' : true,
						'target': 'rnd_phones_cache',
						'append': true
					}
				);
			}
		);

		// REPLACE
		$(document).on
		(
			'click',
			'#btn-replace-1',
			function(e)
			{
				e.preventDefault();
				$('#tmpl_phones_replace').mustache
				(
					{
						'url'    : 'data/phones-cache-1.json',
						'data'   : { 'page' : self.page },
						'replace': true,
						'target' : 'rnd_phones_replace'
					}
				);
			}
		);
		
		$(document).on
		(
			'click',
			'#btn-replace-2',
			function(e)
			{
				e.preventDefault();
				$('#tmpl_phones_replace').mustache
				(
					{
						'url'    : 'data/phones-cache-2.json',
						'data'   : { 'page' : self.page },
						'replace': true,
						'target' : 'rnd_phones_replace'
					}
				);
			}
		);
	};

	this.execute = function()
	{
		// AUTO STARTED CODE ON CLASS READY AND STARTED
	};

	CjsBaseClass.call(this, $, objname, options);
};

umsapp.index = new umsapp.Tindex
(
	window.cjsbaseclass_jquery,
	'index',
	{
		'debug'       : CJS_DEBUG_MODE_1,
		'highlighted' : 'auto'
	}
);