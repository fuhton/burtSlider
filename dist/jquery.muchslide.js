/*
 *  jQuery BurtSlider - v0.5.0
 *  A jump-start for jQuery plugins development.
 *  http://jqueryburtSlider.com
 *
 *  Made by Nick Smith
 *  Under MIT License
 */
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
        selectedClass: "much_selected",
        selectedCallback: function() {},
        foreverScroll: true,
        pagination: false,
        autoSlide: false,
        autoSlideDuration: 3500,
        animation: null
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
            self.selectorWidth = parseInt( self.$element.css( "width" ), 10 );
            self.sectionWidth = self.selectorWidth / self.settings.numShow;
            self.children = self.$element.children( self.settings.children );

            // modify children
            self.modifyDom();

            //resize function
            self.resizeWindow();

            // Click events for Next and Prev
            self.selectorClick();

            // child clicks
            self.itemClick();

            // Pagination => Requires only 1 numShow at a time.
            if ( self.settings.pagination && self.settings.numShow === 1 ) {
                self.createPagination();
                self.clickPagination();
            }

            // Auto Slide
            if ( self.settings.autoSlide ) {
                self.set = setInterval( function () {
                    self.animateNext();
                }, self.settings.autoSlideDuration);
            }
        },
        modifyDom: function () {
            var self = this;
            self.$element.css("position", "relative");
            parent = self.$element.parent();
            // if no selector ID's  exist set em up
            if ( !self.settings.nextId || !self.settings.prevId) {
                self.settings.nextId = "muchNext";
                self.settings.prevId = "muchPrev";
                parent.append("<div id='" + self.settings.nextId + "' class='" + self.settings.nextClass + "'>></div>").prepend("<div id='" + self.settings.prevId + "' class='" + self.settings.prevClass  + "'><</div>");
            }
            self.counter = 0;
            self.children.each( function() {
                var $self = jQuery(this);
                $self.attr("data-counter", self.counter); // add data-self.counter attribute ++
                $self.css("position", "absolute"); // add position style
                $self.css("left", ( $self.data("counter") * self.sectionWidth ) + "px");
                self.counter++;
            });
        },
        resizeWindow: function () {
            var self = this;
            jQuery(window).resize( function () {
                self.selectorWidth = parseInt( self.$element.css( "width" ), 10 );
                self.sectionWidth = self.selectorWidth / self.settings.numShow;
                self.modifyDom();
            });
        },
        selectorClick: function () {
            var self = this;
            // next click
            jQuery("#" + self.settings.nextId).on("click", function() {
                if(self.$element.children().filter(":animated").length>0) {
                    return false;
                }
                self.animateNext();
            });
            // prev click
            jQuery("#" + self.settings.prevId).on("click", function() {
                if(self.$element.children().filter(":animated").length>0) {
                    return false;
                }
                self.animatePrev();
            });
        },
        animateNext: function () {
            var self = this;
            //reset children variable for updated dom
            self.children = self.$element.children( self.settings.children );
            if ( parseInt(self.children.last().css("left"), 10) >= (self.selectorWidth - 2 ) ) {
                self.animateEachNext( self.sectionWidth );
            } else if ( self.settings.foreverScroll ) {
                self.children.first().remove().insertAfter(self.children.last());
                self.children.first().animate({left: self.selectorWidth});
                self.animateEachNext( self.sectionWidth );
            }
        },
        animateEachNext: function ( sectionWidth ) {
            var self = this;
            self.length = sectionWidth;
            self.children.each( function () {
                var $self = jQuery(this);
                $self.finish().animate({left: "-=" + self.length }, self.settings.animation);
            });
        },
        animatePrev: function () {
            var self = this;
            //reset children variable for updated dom
            self.children = self.$element.children( self.settings.children );
            if ( parseInt(self.children.first().css("left"), 10) <= -1 ) {
                self.animateEachPrev( self.sectionWidth );
            } else if ( self.settings.foreverScroll ) {
                self.children.last().remove().insertBefore(self.children.first());
                self.children.last().animate({left: -self.sectionWidth});
                self.animateEachPrev( self.sectionWidth );
            }
        },
        animateEachPrev: function ( sectionWidth ) {
            var self = this;
            self.length = sectionWidth;
            self.children.each( function () {
                var $self = jQuery(this);
                $self.finish().animate({left: "+=" + self.length }, self.settings.animation);
            });
        },
        itemClick: function () {
            var self = this;
            self.children.on( "click", function() {
                var $self = jQuery(this);
                self.children.each( function () {
                    jQuery(this).removeClass( self.settings.selectedClass);
                });
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
                self.animateEachNext( self.selectedChildLeft);
            }
        },
        createPagination: function () {
            var self = this;
            self.$element.after("<ul class='much_pagination'></ul>");
            self.page = jQuery(".much_pagination");
            for ( i = 0; i < self.counter; i++ ) {
                self.page.append("<li class='much_page' data-counter=" + i  + ">" + i + "</li>");
            }
        },
        clickPagination: function () {
            var self = this;
            self.page.children().on( "click", function () {
                var $self = jQuery(this);
                self.selectedPage = $self.data("counter");
                self.itemMoveTo( self.selectedPage );
            });
        }
    };

    $.fn[ pluginName ] = function ( options ) {
        return this.each(function() {
            //TODO - not allowing multiple different instances on one page
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new MuchSlide( this, options ) );
            }
        });
    };
})( jQuery, window, document );
