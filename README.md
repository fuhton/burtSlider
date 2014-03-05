muchslide.js
========

muchslide is a jQuery slider plugin. Created out of the frustration we all face, for a far more customizable front-end jQuery slider.

See a demo: [fuhton.github.io/muchslide/](http://fuhton.github.io/muchslide/)

- [Download](https://github.com/fuhton/muchslide#download)
- [Usage](https://github.com/fuhton/muchslide#usage)


Introduction: Much Info
==================================

jQuery sliders abound and alot are very simple and lightweight. For all intensive purposes, I build muchslide to be even more lightweight and more extendable beyond what I was able to do with the sliders I knew. I created the base plugin as a solution for a unique eCommerce solution and the plugin slowly evolved as the project matured. Now the plugin is feature-rich and ready for even use.

Download
--------

- development ~ [jquery.muchslide.js](https://raw.github.com/fuhton/muchslide/master/src/jquery.muchslide.js)
- production ~ [jquery.muchslide.min.js](https://raw.github.com/fuhton/muchslide/master/dist/jquery.muchslide.min.js)




Usage
=====

Muchslider is a jQuery plugin, so you're gonna need jQuery loaded first.

The bare minimum:

```javascript
$('.much-parent').muchslide();
```

All the options:

```javascript
$('.much-parent').muchslide({
    
    // Integer : # of elements to be displayed at once
    numShow: 3,
    // String : Element type of children
    children: "li",
    
    // String : ID of Next clicker element
    // Note :: Both nextId and prevId must be defined for the defaults to be overridden
    nextId: null,
    // String : ID of Prev clicker element
    prevId: null,
    // String : Class of Prev clicker element
    nextClass: "much_selector",
    // String : Class of Prev clicker element
    prevClass: "much_selector",
    
    // String : Class for the currently displayed element
    currentDisplayed: "much_select",
    // String : Callback class for the selected child element
    selectedClass: "much_selected",
    // Function : Callback function upon the selected child element
    selectedCallback: function() {},
    // Boolean : Forever cycle keeps going and going and ...
    
    foreverScroll: true,
    // Boolean : Display editable pagination
    
    paged: false,
    // String : Class of current pagination ul 
    pagedClass: "much_pagination",
    // String : Class of current pagination 
    pagedSelectedClass: "much_current_page",
    // Function : Callback for current pagination 
    pagedSelectedCallback: function() {},
    // String : Class for children of pagination 
    pagedChildClass: "much_paged",
    
    // Boolean : Slider automatically advances
    autoSlide: false,
    // Int : # of milliseconds between each auto transition
    autoSlideSpeed: 3500,
    // Boolean : Auto sliding is paused on slider elements
    autoSlidePause: true,
    // String : Class for children of pagination 
    autoSlidePauseClass: null,
    // Function : Callback function for slider hover on elements 
    autoSlidePauseCallback: function() {},
    
    // String / JSON : pass any accepable anmiation argument in to increase the scroll, position, or duration
    animation: null,
    // Boolean : Slider advances vertically instead of horizontally
    verticalSlide: false
    };
});
```

Issues and Contribution
=======================

Please submit a ticket through github if there are any issues and feel free to offer a pull-request.

