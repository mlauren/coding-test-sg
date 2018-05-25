// var _ = require('underscore');
var Carousel = window.Carousel || {};


function Carousel(container, options) {
  this.options = options || {};

  this.defaults = {
    prevArrow: '<button class="carousel-prev" aria-label="Previous" type="button">Previous</button>',
    nextArrow: '<button class="carousel-next" aria-label="Next" type="button">Next</button>'
  }
  Object.assign(this.options, this.defaults)

  this.initials = {
    slideIndex: 0,
    slideLength: 0,
    direction: 1,
    slideCurrentCount: 0,
    currentSlideObj: null,
    animationEnd: null
  }

  Object.assign(this, this.initials);

  this.selector = document.querySelector(this.container);

  this.init();
}

Carousel.prototype.init = function() {
     // show-current-index="2"
  this.slideIndex = this.selector.getAttribute("show-current-index") ? parseInt(this.selector.getAttribute("show-current-index")) : 0;
  this.slideLength = this.selector.querySelectorAll(".carousel-item").length;

  this.updateCurrentSlideObj();
  console.log(this.currentSlide);

  this.animationEnd = this.whichAnimationEvent();

  this.setUpAnimationHandlers();

};

Carousel.prototype.updateCurrentSlideObj = function() {
  // get current slide from DOM
  this.currentSlideObj = this.selector.querySelector(".carousel-item[data-slide-index='"+this.slideIndex+"']");
  this.currentSlideObj.className += ' active';

};

Carousel.prototype.setUpAnimationHandlers = function() {
  var self = this;

  // @TODO insert carousel directional buttons into object options
  // and update reference here.
  var buttonPrev = this.selector.querySelector(".carousel-btn[data-direction='left']");
  buttonPrev.addEventListener("mousedown", function(){ self.slideLeft() });

  var buttonNext = this.selector.querySelector(".carousel-btn[data-direction='right']");
  buttonNext.addEventListener("mousedown", function(){ self.slideRight() });

};

Carousel.prototype.handleEvent = function(event) {
  if (disabled) return;

  switch (event.type) {
    case 'mousedown':
    case 'touchstart': this.start(event); break;
    case 'mousemove':
    case 'touchmove': this.move(event); break;
    case 'mouseup':
    case 'mouseleave':
    case 'touchend': this.end(event); break;
    case 'webkitTransitionEnd':
    case 'msTransitionEnd':
    case 'oTransitionEnd':
    case 'otransitionend':
    case 'transitionend': this.transitionEnd(event); break;
    case 'resize': throttledSetup(); break;
  }

  if (options.stopPropagation) {
    event.stopPropagation();
  }
};


// Main movement/animation fn. Applies next/prev & active classes to correct .carousel-item's.
Carousel.prototype.slide = function(direction) {
  var self = this;
      
  // add preventDoubleTap to prevent double press
  var carousel = this.selector;
  carousel.className += " preventDoubleTap";

  // set diretion-based vars. these classes apply left/right css animations
  var currentClass = direction === -1 ? 'prev' : 'next';
  var targetClass = direction === -1 ? 'next' : 'prev';

  // anim out current
  var currentSlide = this.currentSlideObj;
  // add
  currentSlide.className += ' ' + currentClass;
  currentSlide.className = currentSlide.className.replace(/(^| )active/,"");
  // remove
  currentSlide.addEventListener(this.animationEnd, function() {
    currentSlide.className = currentSlide.className.replace(new RegExp('(^| )'+currentClass,'g'),"");
    currentSlide.removeEventListener(self.animationEnd, {});
  });

  // anim in next
  var targetSlide = this.selector.querySelector(".carousel-item[data-slide-index='"+this.slideIndex+"']");
  // add
  targetSlide.className += ' ' + targetClass;
  targetSlide.className += ' active';
  // remove
  currentSlide.addEventListener(this.animationEnd, function() {
    targetSlide.className = targetSlide.className.replace(new RegExp('(^| )'+targetClass,'g'),"");
    // remove top level class
    carousel.className = carousel.className.replace(new RegExp('(^| )'+'preventDoubleTap','g'),"");
    targetSlide.removeEventListener(self.animationEnd, {});
  });

  // update current slide
  this.updateCurrentSlideObj();

};

// Slide Carousel one item to the left 
Carousel.prototype.slideLeft = function() {
  // if index == 0, set to length, else index--
  if(this.slideIndex == 0){
    this.slideIndex = this.slideLength - 1;
  } else {
    this.slideIndex -= 1;
  }
  this.slide(-1);
};

// Slide Carousel one item to the right 
Carousel.prototype.slideRight = function() {
  // if index == max, set to 0, else index++
  if(this.slideIndex == this.slideLength - 1){
    this.slideIndex = 0;
  } else {
    this.slideIndex += 1;
  }
  this.slide(1);
};

// Swipe Setup
/* From Modernizr */
Carousel.prototype.whichAnimationEvent = function(){
  var t;
  var el = document.createElement('fakeelement');
  var animations = {
    'animation':'animationend',
    'OAnimation':'oAnimationEnd',
    'MozAnimation':'animationend',
    'WebkitAnimation':'webkitAnimationEnd'
  }

  for(t in animations){
      if( el.style[t] !== undefined ){
          return animations[t];
      }
  }
};

function main() {
  carousel = new Carousel(".masthead-carousel", {});
}

document.addEventListener('DOMContentLoaded', main);


