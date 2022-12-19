/*
 * jQuery UI Slider Access
 * By: Trent Richardson [http://trentrichardson.com]
 * Version 0.3
 * Last Modified: 10/20/2012
 *
 * Copyright 2011 Trent Richardson
 * Dual licensed under the MIT and GPL licenses.
 * http://trentrichardson.com/Impromptu/GPL-LICENSE.txt
 * http://trentrichardson.com/Impromptu/MIT-LICENSE.txt
 *
 */
(function ($) {

	$.fn.extend({
		sliderAccess: function (options) {

			options = options || {};
			options.touchonly = options.touchonly !== undefined ? options.touchonly : true; // by default only show it if touch device

			if (options.touchonly === true && !('ontouchend' in document)) {
				return $(this);
			}

			return $(this).each(function (i, obj) {

				const $t = $(this);

				const o = $.extend({}, {
					where: 'after',
					step: $t.slider('option', 'step'),
					upIcon: 'ui-icon-plus',
					downIcon: 'ui-icon-minus',
					text: false,
					upText: '+',
					downText: '-',
					buttonset: true,
					buttonsetTag: 'span',
					isRTL: false
				}, options);

				const $buttons = $(
					'<' + o.buttonsetTag + ' class="ui-slider-access">' +
					'<button data-icon="' + o.downIcon + '" data-step="' + (o.isRTL ? o.step : o.step * -1) + '">' + o.downText + '</button>' +
					'<button data-icon="' + o.upIcon + '" data-step="' + (o.isRTL ? o.step * -1 : o.step) + '">' + o.upText + '</button>' +
					'</' + o.buttonsetTag + '>'
				);

				$buttons.children('button').each(function (j, jobj) {

					const $jt = $(this);

					$jt.button({

						text: o.text,
						icons: { primary: $jt.data('icon') }

					}).click(function (e) {

						const step = $jt.data('step');
						const curr = $t.slider('value');
						const newval = curr + step * 1;
						const minval = $t.slider('option', 'min');
						const maxval = $t.slider('option', 'max');
						const slidee = $t.slider('option', 'slide') || function () { };
						const stope = $t.slider('option', 'stop') || function () { };

						e.preventDefault();

						if (newval < minval || newval > maxval) {
							return;
						}

						$t.slider('value', newval);

						slidee.call($t, null, { value: newval });
						stope.call($t, null, { value: newval });

					});

				});

				// before or after
				$t[o.where]($buttons);

				if (o.buttonset) {
					$buttons.removeClass('ui-corner-right').removeClass('ui-corner-left').buttonset();
					$buttons.eq(0).addClass('ui-corner-left');
					$buttons.eq(1).addClass('ui-corner-right');
				}

				// adjust the width so we don't break the original layout
				const bOuterWidth = $buttons.css({
					marginLeft: ((o.where === 'after' && !o.isRTL) || (o.where === 'before' && o.isRTL) ? 10 : 0),
					marginRight: ((o.where === 'before' && !o.isRTL) || (o.where === 'after' && o.isRTL) ? 10 : 0)
				}).outerWidth(true) + 5;

				const tOuterWidth = $t.outerWidth(true);

				$t.css('display', 'inline-block').width(tOuterWidth - bOuterWidth);

			});

		}
	});

})(jQuery);