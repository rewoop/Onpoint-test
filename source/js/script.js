'use strict';

(function () {
  var PAGES_LENGTH = 3;

  var toggleLabels = document.querySelectorAll('.page-header__label');
  var toggleInputs = document.querySelectorAll('.page-header__input');
  var wrapper = document.querySelector('.wrapper');
  var main = document.querySelector('main');
  var pages = main.querySelector('.page-main__slide');
  var firstPage = main.querySelector('.first-page');
  var secondPage = main.querySelector('.second-page');
  var thirdPage = main.querySelector('.third-page');
  var footer = document.querySelector('.page-footer');

  var toggleSliders = function (indexOfPage) {
    toggleLabels.forEach(function (item) {
      item.classList.remove('page-header__label--active');
    });
    toggleLabels[indexOfPage].classList.add('page-header__label--active');
  };

  // ВЫНЕСИ МАГИЮ В КОНСТАНТЫ

    var slider = {
      el: {
        slider: wrapper,
        holder: main,
        pages: pages
      },
      slideHeight: wrapper.offsetHeight,
      touchStartY: undefined,
      touchMoveY: undefined,
      moveY: undefined,
      index: 0,
      longTouch: undefined,
      init: function() {
        this.bindUIEvents();
      },
      bindUIEvents: function() {
        this.el.holder.addEventListener("touchstart", function(event) {
          slider.start(event);
        });
        this.el.holder.addEventListener("touchmove", function(event) {
          slider.move(event);
        });
        this.el.holder.addEventListener("touchend", function(event) {
          slider.end(event);
        });
      },
      start: function(event) {
        this.longTouch = false;
        setTimeout(function() {
          slider.longTouch = true;
        }, 250);
        this.touchStartY =  event.touches[0].pageY;
        if (this.el.holder.classList.contains('animate')) {
          this.el.holder.classList.remove('animate');
        }
      },
      move: function(event) {
        this.touchMoveY =  event.touches[0].pageY;
        this.moveY = this.index*this.slideHeight + (this.touchStartY - this.touchMoveY);
        if (this.moveY < 600) {
          this.el.holder.style.transform = 'translate3d(0,-' + this.moveY + 'px,0)';
        } else if (this.moveY > 1535 && this.moveY < 2135) {
          this.el.holder.style.transform = 'translate3d(0,-' + this.moveY + 'px,0)';
        }
      },
      end: function(event) {
        var absMove = Math.abs(this.index*this.slideHeight - this.moveY);
        if (absMove > this.slideHeight/2 || this.longTouch === false) {
          if (this.moveY > this.index*this.slideHeight && this.index < 2) {
            this.index++;
          } else if (this.moveY < this.index*this.slideHeight && this.index > 0) {
            this.index--;
          }
        }
        toggleSliders(this.index);
        this.el.holder.classList.add('animate');
        this.el.holder.style.transform = 'translate3d(0,-' + this.index*this.slideHeight + 'px,0)';
      }
    };

  slider.init();

})();
