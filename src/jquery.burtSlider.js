// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = "burtSlider",
    defaults = {
        numShow: 3,
        children: "li",
        nextId: null,
        prevId: null,
        nextClass: "burt_selector",
        prevClass: "burt_selector",
        selectedClass: "burt_selected",
        foreverScroll: true
    };

    // The actual plugin constructor
    function BurtSlider ( element, options ) {
        var self = this;
        self.element = element;
        self.$element = $(self.element);
        self.settings = $.extend( {}, defaults, options );
        self._defaults = defaults;
        self._name = pluginName;
        self.init();
    }

    BurtSlider.prototype = {
        init: function () {
            var self = this;
            self.selectorWidth = parseInt( self.$element.css( "width" ), 10 );
            self.sectionWidth = self.selectorWidth / self.settings.numShow;
            self.children = self.$element.children( self.settings.children );
            //resize function
            jQuery(window).resize( function () {
                self.selectorWidth = parseInt( self.$element.css( "width" ), 10 );
                self.sectionWidth = self.selectorWidth / self.settings.numShow;
                self.modifyDom();
            });
            // modify children
            self.modifyDom();
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
        modifyDom: function () {
            var self = this;
            self.$element.css("position", "relative");
            parent = self.$element.parent();
            // if no selector ID's  exist set em up
            if ( !self.settings.nextId || !self.settings.prevId) {
                self.settings.nextId = "burtNext";
                self.settings.prevId = "burtPrev";
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
        animateNext: function () {
            var self = this;
            //reset children variable for updated dom
            self.children = self.$element.children( self.settings.children );
            if ( parseInt(self.children.last().css("left"), 10) >= (self.selectorWidth - 2 ) ) {
                self.animateEachNext();
            } else if ( self.settings.foreverScroll ) {
                self.children.first().remove().insertAfter(self.children.last());
                self.children.first().animate({left: self.selectorWidth});
                self.animateEachNext();
            }
        },
        animateEachNext: function () {
            var self = this;
            self.children.each( function () {
                var $self = jQuery(this);
                $self.finish().animate({left: "-=" + self.sectionWidth });
            });
        },
        animatePrev: function () {
            var self = this;
            //reset children variable for updated dom
            self.children = self.$element.children( self.settings.children );
            if ( parseInt(self.children.first().css("left"), 10) <= -1 ) {
                self.animateEachPrev();
            } else if ( self.settings.foreverScroll ) {
                self.children.last().remove().insertBefore(self.children.first());
                self.children.last().animate({left: -self.sectionWidth});
                self.animateEachPrev();
            }
        },
        animateEachPrev: function () {
            var self = this;
            self.children.each( function () {
                var $self = jQuery(this);
                $self.finish().animate({left: "+=" + self.sectionWidth });
            });
        }
    };

    $.fn.burtSlider = function ( options ) {
        return this.each(function() {
            //TODO - not allowing multiple different instances on one page
            if ( !$.data( self, "plugin_" + pluginName ) ) {
                $.data( self, "plugin_" + pluginName, new BurtSlider( this, options ) );
            }
        });
    };
})( jQuery, window, document );
