/*******************************************************************************
 * ***********************************************!
 * 
 * project: liteAccordion - a horizontal accordion plugin for jQuery author:
 * Nicola Hibbert url: http://nicolahibbert.com/liteaccordion-v2/ demo:
 * http://www.nicolahibbert.com/demo/liteAccordion/
 * 
 * Version: 2.2.0 Copyright: (c) 2010-2013 Nicola Hibbert Licence: MIT
 * 
 ******************************************************************************/
(function(b) {
	var a = function(g, l) {
		var i = {
			containerWidth : 920,
			containerHeight : 320,
			headerWidth : 48,
			activateOn : "click",
			firstSlide : 1,
			slideSpeed : 800,
			onTriggerSlide : function(m) {
			},
			onSlideAnimComplete : function() {
			},
			autoPlay : false,
			pauseOnHover : false,
			cycleSpeed : 6000,
			easing : "swing",
			theme : "basic",
			rounded : false,
			enumerateSlides : false,
			linkable : false
		}, h = b.extend({}, i, l), c = g.children("ol").children("li"), j = c
				.children(":first-child"), k = c.length, f = h.containerWidth
				- k * h.headerWidth, e = {
			play : function(m) {
				var n = d.nextSlide(m && m);
				if (d.playing) {
					return
				}
				d.playing = setInterval(function() {
					j.eq(n()).trigger("click.liteAccordion")
				}, h.cycleSpeed)
			},
			stop : function() {
				clearInterval(d.playing);
				d.playing = 0
			},
			next : function() {
				e.stop();
				j.eq(d.currentSlide === k - 1 ? 0 : d.currentSlide + 1)
						.trigger("click.liteAccordion")
			},
			prev : function() {
				e.stop();
				j.eq(d.currentSlide - 1).trigger("click.liteAccordion")
			},
			destroy : function() {
				e.stop();
				b(window).off(".liteAccordion");
				g.attr("style", "").removeClass(
						"liteAccordion basic dark light stitch").removeData(
						"liteAccordion").off(".liteAccordion").find(
						"li > :first-child").off(".liteAccordion").filter(
						".selected").removeClass("selected").end().find("b")
						.remove();
				c.removeClass("slide").children().attr("style", "")
			},
			debug : function() {
				return {
					elem : g,
					defaults : i,
					settings : h,
					methods : e,
					core : d
				}
			}
		}, d = {
			setStyles : function() {
				g.width(h.containerWidth).height(h.containerHeight).addClass(
						"liteAccordion").addClass(h.rounded && "rounded")
						.addClass(h.theme);
				c.addClass("slide").children(":first-child").height(
						h.headerWidth);
				d.setSlidePositions()
			},
			setSlidePositions : function() {
				var m = j.filter(".selected");
				if (!m.length) {
					j.eq(h.firstSlide - 1).addClass("selected")
				}
				j.each(function(n) {
					var q = b(this), p = n * h.headerWidth, o = j.first()
							.next(), r = parseInt(o.css("marginLeft"), 10)
							|| parseInt(o.css("marginRight"), 10) || 0;
					if (m.length) {
						if (n > j.index(m)) {
							p += f
						}
					} else {
						if (n >= h.firstSlide) {
							p += f
						}
					}
					q.css("left", p).width(h.containerHeight).next().width(
							f - r).css({
						left : p,
						paddingLeft : h.headerWidth
					});
					h.enumerateSlides && q.append("<b>" + (n + 1) + "</b>")
				})
			},
			bindEvents : function() {
				if (h.activateOn === "click") {
					j.on("click.liteAccordion", d.triggerSlide)
				} else {
					if (h.activateOn === "mouseover") {
						j.on("click.liteAccordion mouseover.liteAccordion",
								d.triggerSlide)
					}
				}
				if (h.linkable) {
					b(window)
							.on(
									"hashchange.liteAccordion",
									function(n) {
										var m = c
												.filter(function() {
													return b(this).attr(
															"data-slide-name") === window.location.hash
															.split("#")[1]
												});
										if (m.length) {
											d.triggerSlide.call(m
													.children("h2")[0], n)
										}
									})
				}
				if (h.pauseOnHover && h.autoPlay) {
					g.on("mouseover.liteAccordion", function() {
						d.playing && e.stop()
					}).on("mouseout.liteAccordion", function() {
						!d.playing && e.play(d.currentSlide)
					})
				}
			},
			currentSlide : h.firstSlide - 1,
			nextSlide : function(m) {
				var n = m + 1 || d.currentSlide + 1;
				return function() {
					return n++ % k
				}
			},
			playing : 0,
			slideAnimCompleteFlag : false,
			triggerSlide : function(o) {
				var n = b(this), m = {
					elem : n,
					index : j.index(n),
					next : n.next(),
					prev : n.parent().prev().children("h2"),
					parent : n.parent()
				};
				if (h.linkable && m.parent.attr("data-slide-name")) {
					if (m.parent.attr("data-slide-name") !== window.location.hash
							.split("#")[1]) {
						return window.location.hash = "#"
								+ m.parent.attr("data-slide-name")
					}
				}
				d.currentSlide = m.index;
				d.slideAnimCompleteFlag = false;
				h.onTriggerSlide.call(m.next, n);
				if (n.hasClass("selected") && n.position().left < f / 2) {
					d.animSlide.call(m)
				} else {
					d.animSlideGroup(m)
				}
				if (h.autoPlay) {
					e.stop();
					e.play(j.index(j.filter(".selected")))
				}
			},
			animSlide : function(m) {
				var n = this;
				if (typeof this.pos === "undefined") {
					this.pos = f
				}
				j.removeClass("selected").filter(this.elem)
						.addClass("selected");
				if (!!this.index) {
					this.elem.add(this.next).stop(true).animate(
							{
								left : this.pos + this.index * h.headerWidth
							},
							h.slideSpeed,
							h.easing,
							function() {
								if (!d.slideAnimCompleteFlag) {
									h.onSlideAnimComplete.call(m ? m.next
											: n.prev.next());
									d.slideAnimCompleteFlag = true
								}
							});
					j.removeClass("selected").filter(this.prev).addClass(
							"selected")
				}
			},
			animSlideGroup : function(m) {
				var n = [ "left", "right" ];
				b.each(n, function(o, p) {
					var r, q;
					if (p === "left") {
						r = ":lt(" + (m.index + 1) + ")";
						q = 0
					} else {
						r = ":gt(" + m.index + ")";
						q = f
					}
					c.filter(r).children("h2").each(function() {
						var t = b(this), s = {
							elem : t,
							index : j.index(t),
							next : t.next(),
							prev : t.parent().prev().children("h2"),
							pos : q
						};
						d.animSlide.call(s, m)
					})
				});
				j.removeClass("selected").filter(m.elem).addClass("selected")
			},
			ieClass : function(m) {
				if (m < 7) {
					e.destroy()
				}
				if (m >= 10) {
					return
				}
				if (m === 7 || m === 8) {
					c.each(function(n) {
						b(this).addClass("slide-" + n)
					})
				}
				g.addClass("ie ie" + m)
			},
			init : function() {
				var n = navigator.userAgent, m = n.indexOf("MSIE");
				if (m !== -1) {
					n = n.slice(m + 5, m + 7);
					d.ieClass(+n)
				}
				d.setStyles();
				d.bindEvents();
				if (h.cycleSpeed < h.slideSpeed) {
					h.cycleSpeed = h.slideSpeed
				}
				h.autoPlay && e.play()
			}
		};
		d.init();
		return e
	};
	b.fn.liteAccordion = function(e) {
		var d = this, c = d.data("liteAccordion");
		if (typeof e === "object" || !e) {
			return d.each(function() {
				var f;
				if (c) {
					return
				}
				f = new a(d, e);
				d.data("liteAccordion", f)
			})
		} else {
			if (typeof e === "string" && c[e]) {
				if (e === "debug") {
					return c[e].call(d)
				} else {
					c[e].call(d);
					return d
				}
			}
		}
	}
})(jQuery);
