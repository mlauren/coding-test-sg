"use strict";

var Slideout = require('slideout');
var Flickity = require('flickity');
var comments = require('./comments.js');

  
var slideout = new Slideout({
  'panel': document.getElementById('panel'),
  'menu': document.getElementById('menu'),
  'padding': 256,
  'tolerance': 70,
  'touch': false
});

// DOM EVENTS

// Toggle button
document.querySelector('.toggle-button').addEventListener('click', function() {
  slideout.toggle();
})

var elem = document.querySelector('.main-carousel');
var flkty = new Flickity( elem, {
  // options
  cellAlign: 'left',
  contain: true,
  draggable: true,
  pageDots: false,
  wrapAround: true,
  bgLazyLoad: true
});

function CommentsSystem() {
  this.initials = {
    commentIndex: 1,
    commentsLength: 0,
    direction: 1,
    slideCurrentCount: 0,
    currentSlideObj: null,
    animationEnd: null
  }

  Object.assign(this, this.initials);

  this.comments = comments.sort((a,b) => a.timestamp > b.timestamp);
  this.commentsLength = this.comments.length;
  this.container = document.querySelector("#comment-content");
  this.init();
}

CommentsSystem.prototype.init = function() {
  var self = this;

  this.getDomItems();
  

  this.updateDomItems(self.comments[0]);
  this.attachEventListeners();
}

CommentsSystem.prototype.attachEventListeners = function() {
  var self = this;
  // @TODO insert carousel directional buttons into object options
  // and update reference here.
  var buttonPrev = this.container.querySelector("[data-direction='left']");
  buttonPrev.addEventListener("mousedown", function(e){ e.stopPropagation(); self.slideLeft(); });

  var buttonNext = this.container.querySelector("[data-direction='right']");
  buttonNext.addEventListener("mousedown", function(e){ e.stopPropagation(); self.slideRight(); });
};

CommentsSystem.prototype.slide = function() {
  this.updateDomItems(this.comments[this.commentIndex]);
}

CommentsSystem.prototype.slideLeft = function() {
  // if index == 0, set to length, else index--
  if(this.commentIndex == 0){
    this.commentIndex = this.commentsLength - 1;
  } else {
    this.commentIndex -= 1;
  }
  this.slide(-1);
};

CommentsSystem.prototype.slideRight = function() {
  // if index == max, set to 0, else index++
  if(this.commentIndex == this.commentsLength - 1){
    this.commentIndex = 0;
  } else {
    this.commentIndex += 1;
  }
  this.slide(1);
};

CommentsSystem.prototype.updateDomItems = function(comment) {
  var date = new Date(comment.timestamp);
  this.commentContainer.innerText = comment.comment;
  this.authorContainer.innerText = comment.name;
  this.dateContainer.innerText = date.toDateString();
  this.nameContainer.innerText = comment.name;
}

CommentsSystem.prototype.getDomItems = function() {
  this.commentContainer = this.container.querySelector('[data-content="comment"]');
  this.authorContainer = this.container.querySelector('[data-content="author"]');
  this.nameContainer = this.container.querySelector('[data-content="name"]');

  this.dateContainer = this.container.querySelector('[data-content="date"]');
}

function main() {
  var commentsGo = new CommentsSystem();
}
document.addEventListener('DOMContentLoaded', main);