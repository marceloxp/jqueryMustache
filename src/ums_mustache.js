var umsappJqueryPluginUmsMustache = (function(){
	'use strict';
	var self;

	return {
		init : function()
		{
			self = this;
			self.urls = [];
		},

		render: function(options, _callback)
		{
			try
			{
				if (options.append === true) { options.keep = true; }
				if ( (options.keep === false) && (empty(options.target)) )
				{
					options.target = options.template;
				}

				var _data   = (!empty(options.data)  ) ? options.data   : {};
				var _method = (!empty(options.method)) ? options.method : 'GET';

				umslib.mustache_utils.trigger('on-mustache-before', options.url);
				var loadJson = function(p_callback)
				{
					$.ajax({
						url      : options.url,
						type     : _method,
						dataType : 'json',
						data     : _data
					})
					.done(function(json)
					{
						if (options.cache)
						{
							var md5_url = jqueryumsmustache_md5(options.url);
							self.urls[md5_url] = json;
						}
						p_callback(json);
						umslib.mustache_utils.trigger('on-mustache-after', options.url, json);
					})
					.fail(function(err) {
						console.log('Falha na solicitação.', err);
					})
					.always(function() {
						umslib.mustache_utils.trigger('on-mustache-after', options.url);
					});
				};

				var processResult = function(p_json, p_callback)
				{
					var use_json = p_json;
					use_json.extra = options.extra;
					if (options.beforeRenderJson !== undefined)
					{
						use_json = options.beforeRenderJson(use_json);
					}

					if (options.beforeRenderItem !== undefined)
					{
						for(var key in use_json.data)
						{
							use_json.data[key] = options.beforeRenderItem(use_json.data[key]);
						}
					}

					var template = $(options.template).html();
					Mustache.parse(template, options.tags);
					var rendered = Mustache.render(template, use_json);
					if ( (options.append !== true) && (options.replace !== true) )
					{
						$(options.target).replaceWith(rendered);
					}
					else
					{
						if (options.replace === true)
						{
							$(options.target).html('');
						}
						$(options.target).append(rendered);
					}
					
					if ( (options.keep === false) && (options.replace === false) )
					{
						$(options.template).remove();
					}

					if (p_callback !== undefined)
					{
						p_callback();
					}
				};

				if (options.direct === true)
				{
					processResult(options.source, _callback);
				}
				else
				{
					var from_cache = false;
					var md5_url = jqueryumsmustache_md5(options.url);

					if (options.cache)
					{
						from_cache = (self.urls[md5_url] !== undefined);
					}

					if (!from_cache)
					{
						loadJson
						(
							function(json)
							{
								processResult(json, _callback);
							}
						);
					}
					else
					{
						processResult(self.urls[md5_url], _callback);
					}
				}
			}
			catch(err)
			{
				console.log(err);
			}
		}
	};

})();

$(document).ready(function() {
	umsappJqueryPluginUmsMustache.init();
});

$.fn.mustache = function(p_options, p_callback)
{
	'use strict';
	var options = p_options || {};
	options.template = '#' + $(this).attr('id');

	if ( $(this).attr('data-source') !== undefined )
	{
		options.url = $(this).attr('data-source');
	}

	if ( $(this).attr('data-target') !== undefined )
	{
		options.target = $(this).attr('data-target');
	}

	if (options.keep === undefined)
	{
		options.keep = false;
	}

	if (options.target !== undefined)
	{
		options.target = '#' + options.target;
		if ( $(options.target).length === 0 )
		{
			throw new Error('Target not found!');
		}
	}

	options.direct  = ( (options.url   === undefined) && (options.source !== undefined) );
	options.extra   = (options.extra   === undefined) ? {} : options.extra;
	options.cache   = (options.cache   === undefined) ? false : options.cache;
	options.replace = (options.replace === undefined) ? false : options.replace;
	options.tags    = (options.tags    === undefined) ? ['{{','}}'] : options.tags;

	umsappJqueryPluginUmsMustache.render(options, p_callback);
};


if (typeof CjsBaseClass === 'function')
{
	/* global CjsBaseClass,CJS_DEBUG_MODE_0,CJS_DEBUG_MODE_1,CJS_DEBUG_MODE_2 */
	var umslib = umslib || {};
	umslib.Tmustache_utils = function($, objname, options)
	{
		'use strict';
		var self = this;

		this.create = function()
		{
			self.events.onCreate();
		};

		this.onReady = function()
		{
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

		};

		this.execute = function()
		{
			// AUTO STARTED CODE ON CLASS READY AND STARTED
		};

		CjsBaseClass.call(this, $, objname, options);
	};

	umslib.mustache_utils = new umslib.Tmustache_utils
	(
		window.cjsbaseclass_jquery,
		'mustache_utils',
		{
			'debug'       : CJS_DEBUG_MODE_1,
			'highlighted' : 'auto'
		}
	);
}
else
{
	umslib = {};
	umslib.mustache_utils = 
	{
		'trigger': function()
		{
			$(document).trigger(arguments);
		}
	};
}

// umslib.mustache_utils.trigger('example');