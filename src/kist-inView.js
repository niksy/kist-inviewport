;(function ( $, window, document, undefined ) {

	var plugin = {
		name: 'inView',
		ns: {
			css: 'kist-InView',
			event: '.kist.inView'
		},
		error: function ( message ) {
			throw new Error(plugin.name + ': ' + message);
		}
	};
	plugin.publicMethods = ['destroy'];

	var dom = {
		common: {
			window: $(window)
		},
		setup: function () {
			this.dom    = this.dom || {};
			this.dom.el = $(this.element);
		}
	};

	var events = {
		setup: function ( cb ) {
			dom.common.window
				.on(
					'scroll' + this.instance.ens + ' ' +
					'resize' + this.instance.ens,
					bounce.call(this, this.options.debounce, windowChange, cb)
				);
		},
		destroy: function () {
			dom.common.window.off(this.instance.ens);
		}
	};

	var instance = {
		id: 0,
		setup: function () {
			this.instance     = this.instance || {};
			this.instance.id  = instance.id++;
			this.instance.ens = plugin.ns.event + '.' + this.instance.id;
		},
		destroy: function () {
			this.dom.el.each(function ( index, element ) {
				delete $.data(element)[plugin.name];
			});
		}
	};

	var FIRST_CALL_TIMEOUT = (document.all && !document.addEventListener) ? 250 : 0;
	var windowCoords = {
		top: 0,
		bottom: 0
	};

	function setOptions ( options, cb ) {
		var temp = {};
		if ( typeof(options) === 'number' ) {
			$.extend(temp, {
				threshold: options
			});
		}
		if ( typeof(cb) === 'function' ) {
			$.extend(temp, {
				success: cb
			});
		}
		if ( typeof(options) === 'object' ) {
			$.extend(temp, options);
		}
		return temp;
	}

	/**
	 * Calculate viewport
	 *
	 * @return {Object}
	 */
	function calculateViewport () {
		windowCoords.top    = dom.common.window.scrollTop();
		windowCoords.bottom = windowCoords.top + dom.common.window.height();

		return windowCoords;
	}

	/**
	 * Action when window is scrolled or resized
	 *
	 * @param  {Function} cb
	 */
	function windowChange ( cb ) {
		var result = this.getElements(this.dom.el, this.options.threshold);
		if ( result.length ) {
			cb(result);
		}
	}

	/**
	 * Bouncing mechanism
	 *
	 * @param  {Integer}   timeout
	 * @param  {Function} fn
	 * @param  {Function} cb
	 *
	 * @return {Function}
	 */
	function bounce ( timeout, fn, cb ) {
		if ( this.options.debounce && $.debounce ) {
			return $.debounce( timeout, $.proxy(fn, this, cb) );
		}
		return $.proxy(fn, this, cb);
	}

	/**
	 * Combined once and success callbacks
	 *
	 * @param  {jQuery} result
	 *
	 * @return {}
	 */
	function cbAll ( result ) {
		if ( !this._once ) {
			this.options.once.call(this.dom.el, result);
			this._once = true;
		}
		this.options.success.call(this.dom.el, result);
	}

	function InView ( element, options ) {

		this.element = element;
		this.options = $.extend({}, this.defaults, options);

		instance.setup.call(this);
		dom.setup.call(this);
		events.setup.call(this, $.proxy(cbAll, this));

		// Call window change method on the next event loop
		setTimeout($.proxy(windowChange, this, $.proxy(cbAll, this)), FIRST_CALL_TIMEOUT);

	}

	$.extend(InView.prototype, {

		/**
		 * Check if element is (partially) visible in viewport
		 *
		 * @param  {jQuery}  el
		 * @param  {Integer}  threshold
		 *
		 * @return {Boolean}
		 */
		isVisible: function ( el, threshold ) {

			var elTop    = el.offset().top;
			var elBottom = elTop + el.height();

			return elBottom >= windowCoords.top - threshold && elTop <= windowCoords.bottom + threshold;

		},

		/**
		 * Return list of elements visible in viewport
		 *
		 * @param  {jQuery}  el
		 * @param  {Integer}  threshold
		 *
		 * @return {jQuery}
		 */
		getElements: function ( el, threshold ) {

			calculateViewport();

			return el.filter($.proxy(function ( index, element ) {

				return this.isVisible( $(element), threshold );

			}, this));

		},

		destroy: function () {
			instance.destroy.call(this);
			events.destroy.call(this);
		},

		/**
		 * Default options
		 *
		 * @type {Object}
		 */
		defaults: {
			threshold: 0,
			debounce: 300,
			success: function () {},
			once: function () {}
		}

	});

	$.kist = $.kist || {};

	$.kist[plugin.name] = {
		defaults: InView.prototype.defaults
	};

	$.fn[plugin.name] = function ( options, cb ) {

		if ( typeof(options) === 'string' && $.inArray(options, plugin.publicMethods) !== -1 ) {
			return this.each(function () {
				var pluginInstance = $.data(this, plugin.name);
				if ( pluginInstance ) {
					pluginInstance[options]();
				}
			});
		}
		options = setOptions.apply(null, arguments);

		if ( !options.success && !options.once ) {
			return InView.prototype.getElements(this, options.threshold || InView.prototype.defaults.threshold);
		} else {

			/**
			 * If there are multiple elements, first filter those which don’t
			 * have any instance of plugin instantiated. Then create only one
			 * instance for current collection which will enable us to have
			 * only one scroll/resize event.
			 */
			return this
				.filter(function ( index, element ) {
					return !$.data(element, plugin.name);
				})
				.data(plugin.name, new InView(this, options));
		}

	};

})( jQuery, window, document );