// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = "muchslide",
    defaults = {
        numShow: 3,
        children: "li",
        nextId: null,
        prevId: null,
        nextClass: "much_selector",
        prevClass: "much_selector",
        currentDisplayed: "much_select",
        selectedClass: "much_selected",
        selectedCallback: function() {},
        foreverScroll: true,
        paged: false,
        pagedClass: "much_paged",
        pagedSelectedCallback: function() {},
        pagedSelectedClass: "much_current_page",
        pagedChildClass: "much_paged",
        autoSlide: false,
        autoSlideSpeed: 3500,
        autoSlidePause: true,
        autoSlidePauseClass: null,
        autoSlidePauseCallback: function() {},
        animation: null, 
	direction: "left"
    };

    // The actual plugin constructor
    function MuchSlide ( element, options ) {
        var self = this;
        self.element = element;
        self.$element = $(self.element);
        self.settings = $.extend( {}, defaults, options );
        self._defaults = defaults;
        self._name = pluginName;
        self.init();
    }

    MuchSlide.prototype = {
        init: function () {
            var self = this;
            self.selectorWidth = self.$element.width();
            self.currentPage = 0;
            self.sectionWidth = self.selectorWidth / self.settings.numShow;
            self.__children();

            self.modifyDom();

            self.resizeWindow();

            self.selectorClick();

            self.itemClick();
	    console.log(self.settings.direction);
            if ( self.settings.paged && self.settings.numShow === 1 ) {
                self.createPaged();
                self.clickPaged();
                self.markPaged();
            }
            if ( self.settings.autoSlide ) {
                self.createTimer();
                if ( self.settings.autoSlidePause ) {
                    jQuery( "#" + self.settings.nextId +
                            ", #" + self.settings.prevId +
                            ", #" + self.$element.attr("id") +
                            ", ." + self.settings.pagedClass +
                            ", ." + self.settings.autoSlidePauseClass
                          ).hover( function () {
                              clearInterval( self.set );
                              self.settings.autoSlidePauseCallback();
                          }, function ()  {
                              self.createTimer();
                          });
                }
            }
        },
        __children: function () {
            var self = this;
            self.children = self.$element.children( self.settings.children );
        },
        modifyDom: function () {
            var self = this;
            self.$element.css("position", "relative");
            parent = self.$element.parent();
            if ( !self.settings.nextId || !self.settings.prevId) {
                self.settings.nextId = "muchNext";
                self.settings.prevId = "muchPrev";
                parent.append("<div id='" + self.settings.nextId + "' class='" + self.settings.nextClass + "'>></div>").prepend("<div id='" + self.settings.prevId + "' class='" + self.settings.prevClass  + "'><</div>");
            }
            self.counter = 0;
            self.children.each( function() {
                var $self = jQuery(this);
		if (self.settings.direction === "top") {
		    $self.attr("data-counter", self.counter).css({ "position": "absolute", "top": ( $self.data("counter") * self.sectionWidth ) + "px" });
		} else { 
		    $self.attr("data-counter", self.counter).css({ "position": "absolute", "left": ( $self.data("counter") * self.sectionWidth ) + "px" });
		}
		console.log($self);
		if (self.settings.direction === "top") {
		    self.direction=$self.position().top;
		} else {
		    self.direction=$self.position().left;
		}
                if ( self.direction < self.selectorWidth && self.direction > -1  ) {
                    $self.addClass( self.settings.currentDisplayed );
                    self.currentPage = $self.data("counter");
                    if ( self.settings.paged && self.settings.numShow === 1 ) {
                        self.markPaged();
                    }
                }
                self.counter++;
            });
            jQuery("#" + self.settings.nextId + ", #" + self.settings.prevId).mousedown(function(){return false;});
        },
        resizeWindow: function () {
            var self = this;
            jQuery(window).resize( function () {
                self.selectorWidth = parseInt( self.$element.css( "width" ), 10 );
                self.sectionWidth = self.selectorWidth / self.settings.numShow;
                self.modifyDom();
            });
        },
        createTimer: function () {
            var self = this;
            self.set = setInterval( function () {
                self.animateNext();
            }, self.settings.autoSlideSpeed);
        },
        selectorClick: function () {
            var self = this;
            jQuery("#" + self.settings.nextId).on("click", function() {
                if(self.$element.children().filter(":animated").length>0) {
                    return false;
                }
                self.animateNext();
            });
            jQuery("#" + self.settings.prevId).on("click", function( ) {
                if(self.$element.children().filter(":animated").length>0) {
                    return false;
                }
                self.animatePrev();
            });
        },
        animateNext: function () {
            var self = this;
            self.__children();
            if ( parseInt(self.children.last().css(self.settings.direction), 10) >= (self.selectorWidth - 2 ) ) {
                self.moveEach( self.sectionWidth );
            } else if ( self.settings.foreverScroll ) {
                self.children.first().remove().insertAfter(self.children.last());
		if (self.settings.direction === "top") {
		    self.children.first().animate({top: self.selectorWidth});
		} else {
		    self.children.first().animate({left: self.selectorWidth});
		}
                self.moveEach( self.sectionWidth );
            }
        },
        animatePrev: function () {
            var self = this;
            self.__children();
            if ( parseInt(self.children.first().css(self.settings.direction), 10) <= -1 ) {
                self.moveEach( self.sectionWidth, "+" );
            } else if ( self.settings.foreverScroll ) {
                self.children.last().remove().insertBefore(self.children.first());
               	if (self.settings.direction === "top") {
		    self.children.last().animate({top: -self.selectorWidth});
		} else {
		    self.children.last().animate({left: -self.selectorWidth});
		}    
                self.moveEach( self.sectionWidth, "+" );
            }
        },
        moveEach: function ( sectionWidth, direction ) {
            var self = this;
            self.direction = direction || "-";
            self.length = sectionWidth;
            self.children.each( function () {
                var $self = jQuery(this);
               	if (self.settings.direction === "top") {
		    $self.finish().animate({top: self.direction + "=" + self.length }, self.settings.animation, function() {
			    left = $self.position().top;
			    $self.removeClass( self.settings.currentDisplayed );
			    if ( left < self.selectorWidth && left > -1  ) {
				$self.addClass( self.settings.currentDisplayed );
				self.currentPage = $self.data("counter");
				if ( self.settings.paged && self.settings.numShow === 1 ) {
				    self.markPaged();
				}
			    }
			});
		} else {
		    $self.finish().animate({left: self.direction + "=" + self.length }, self.settings.animation, function() {
			    left = $self.position().left;
			    $self.removeClass( self.settings.currentDisplayed );
			    if ( left < self.selectorWidth && left > -1  ) {
				$self.addClass( self.settings.currentDisplayed );
				self.currentPage = $self.data("counter");
				if ( self.settings.paged && self.settings.numShow === 1 ) {
				    self.markPaged();
				}
			    }
			});
		}
            });
        },
        itemClick: function () {
            var self = this;
            self.__children();
            self.children.on( "click", function() {
                var $self = jQuery(this);
                self.children.removeClass( self.settings.selectedClass);
                $self.addClass( self.settings.selectedClass );
                self.settings.selectedCallback();
            });
        },
        itemMoveTo: function ( selectedPage ) {
            var self = this;
            self.selectedPage = selectedPage;
            self.selectedChild = self.$element.find("[data-counter=" + self.selectedPage + "]");
            self.selectedChildLeft =  parseInt( self.selectedChild.css("left"), 10 );
            self.selectedLeft = self.selectedChildLeft / self.sectionWidth;
            if ( self.selectedChildLeft < 0 || self.selectedChildLeft > 0 ) {
                self.moveEach( self.selectedChildLeft );
            }
        },
        createPaged: function () {
            var self = this;
            self.$element.after("<ul class='" + self.settings.pagedClass+ "'></ul>");
            self.page = jQuery( "." + self.settings.pagedClass );
            for ( i = 0; i < self.counter; i++ ) {
                self.page.append("<li class='" + self.settings.pagedChildClass + "' data-counter=" + i  + ">" + i + "</li>");
            }
        },
        markPaged: function () {
            var self = this;
            self.page = jQuery( "." + self.settings.pagedClass );
            self.page.children().each( function () {
                var $self = jQuery(this);
                if ( $self.data("counter") === self.currentPage ) {
                    self.page.children().removeClass( self.settings.pagedSelectedClass );
                    $self.addClass( self.settings.pagedSelectedClass );
                    self.settings.pagedSelectedCallback();
                }
            });
        },
        clickPaged: function () {
            var self = this;
            self.page.children().on( "click", function () {
                if(self.$element.children().filter(":animated").length>0) {
                    return false;
                }
                $self = jQuery(this);
                self.selectedPage = $self.data("counter");
                self.itemMoveTo( self.selectedPage );
            });
        }
    };

    $.fn[ pluginName ] = function ( options ) {
        return this.each(function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new MuchSlide( this, options ) );
            }
        });
    };
})( jQuery, window, document );
