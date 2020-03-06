'use strict';

(function () {
  var FIRST_PAGE = 0;
  var SECOND_PAGE = 1;
  var THIRD_PAGE = 2;
  var TIMEOUT = 250;
  var PAGE_MOVE_STEP = 600;
  var PAGE_MOVE_SECOND_STEP = 1535;
  var PAGE_MOVE_THIRD_STEP = 2135;
  var HALF_LINE_WIDTH = 618;
  var DEFAULT_PAGE_FACTOR = 2;
  var DEFAULT_SLIDER_FACTOR = 10;
  var PIN_FIRST_STEP = 0;
  var PIN_SECOND_STEP = 617;
  var PIN_THIRD_STEP = 619;
  var PIN_FOURTH_STEP = 1237;

  var toggleLabels = document.querySelectorAll('.page-header__label');
  var wrapper = document.querySelector('.wrapper');
  var footer = document.querySelector('.page-footer');
  var main = document.querySelector('main');
  var thirdPage = main.querySelector('.third-page');
  var thirdPageWrapper = thirdPage.querySelector('.third-page__wrapper');
  var slideDownWrapper = footer.querySelector('.page-footer__slide-down-wrapper');
  var toggleThirdPage = footer.querySelector('.page-footer__toggle');
  var toggleLine = footer.querySelector('.toggle__line');
  var toggleActiveLine = footer.querySelector('.toggle__active-line');
  var togglePin = document.querySelector('.toggle__pin');

  var resetSettings = function () {
    slideDownWrapper.classList.remove('hidden');
    toggleThirdPage.classList.add('hidden');
    main.style.overflowX = 'hidden';
    wrapper.style.overflowX = 'hidden';
  };

  var toggleSliders = function (indexOfPage) {
    resetSettings();
    toggleLabels.forEach(function (item) {
      item.classList.remove('page-header__label--active');
    });
    toggleLabels[indexOfPage].classList.add('page-header__label--active');
    if (indexOfPage > FIRST_PAGE) {
      slideDownWrapper.classList.add('hidden');
    }
    if (indexOfPage === THIRD_PAGE) {
      toggleThirdPage.classList.remove('hidden');
      main.style.overflowX = 'visible';
      wrapper.style.overflowX = 'visible';
    }
  };

  var slider = {
    el: {
      slider: wrapper,
      holder: main
    },
    slideHeight: wrapper.offsetHeight,
    touchStartY: undefined,
    touchMoveY: undefined,
    moveY: undefined,
    index: FIRST_PAGE,
    longTouch: undefined,
    init: function () {
      this.bindUIEvents();
    },
    bindUIEvents: function () {
      this.el.holder.addEventListener('touchstart', function (event) {
        slider.start(event);
      });
      this.el.holder.addEventListener('touchmove', function (event) {
        slider.move(event);
      });
      this.el.holder.addEventListener('touchend', function (event) {
        slider.end(event);
      });
    },
    start: function (event) {
      this.longTouch = false;
      setTimeout(function () {
        slider.longTouch = true;
      }, TIMEOUT);
      this.touchStartY = event.touches[0].pageY;
      if (this.el.holder.classList.contains('animate')) {
        this.el.holder.classList.remove('animate');
      }
    },
    move: function (event) {
      this.touchMoveY = event.touches[0].pageY;
      this.moveY = this.index * this.slideHeight + (this.touchStartY - this.touchMoveY);
      if (this.moveY < PAGE_MOVE_STEP) {
        this.el.holder.style.transform = 'translate3d(0,-' + this.moveY + 'px,0)';
      } else if (this.moveY > PAGE_MOVE_SECOND_STEP && this.moveY < PAGE_MOVE_THIRD_STEP) {
        this.el.holder.style.transform = 'translate3d(0,-' + this.moveY + 'px,0)';
      }
    },
    end: function () {
      var absMove = Math.abs(this.index * this.slideHeight - this.moveY);
      if (absMove > this.slideHeight / DEFAULT_PAGE_FACTOR || this.longTouch === false) {
        if (this.moveY > this.index * this.slideHeight && this.index < THIRD_PAGE) {
          this.index++;
        } else if (this.moveY < this.index * this.slideHeight && this.index > FIRST_PAGE) {
          this.index--;
        }
      }
      toggleSliders(this.index);
      this.el.holder.classList.add('animate');
      this.el.holder.style.transform = 'translate3d(0,-' + this.index * this.slideHeight + 'px,0)';
    }
  };

  slider.init();

  var thirdPageSlider = {
    el: {
      slider: thirdPage,
      holder: thirdPageWrapper,
      pin: togglePin,
      line: toggleLine,
      lineActive: toggleActiveLine
    },
    slideWidth: thirdPageWrapper.offsetWidth,
    touchStartX: undefined,
    touchMoveX: undefined,
    moveX: undefined,
    pinMoveX: undefined,
    index: THIRD_PAGE,
    longTouch: undefined,
    init: function () {
      this.el.holder.classList.add('animate');
      this.el.holder.style.transform = 'translate3d(-' + this.index * this.slideWidth + 'px,0,0)';
      this.el.line.style.width = this.index * HALF_LINE_WIDTH + 'px';
      this.bindUIEvents();
    },
    bindUIEvents: function () {
      this.el.pin.addEventListener('touchstart', function (event) {
        thirdPageSlider.start(event);
      });
      this.el.pin.addEventListener('touchmove', function (event) {
        thirdPageSlider.move(event);
      });
      this.el.pin.addEventListener('touchend', function (event) {
        thirdPageSlider.end(event);
      });
    },
    start: function (event) {
      this.longTouch = false;
      setTimeout(function () {
        thirdPageSlider.longTouch = true;
      }, TIMEOUT);
      this.touchStartX = event.touches[0].pageX;
      if (this.el.holder.classList.contains('animate')) {
        this.el.holder.classList.remove('animate');
      }
    },
    move: function (event) {
      this.touchMoveX = event.touches[0].pageX;
      this.moveX = this.index * this.slideWidth + -(this.touchStartX - this.touchMoveX);
      this.pinMoveX = this.index * HALF_LINE_WIDTH + -(this.touchStartX - this.touchMoveX);
      this.el.holder.style.transform = 'translate3d(-' + this.moveX + 'px,0,0)';

      if (this.index === FIRST_PAGE) {
        if (this.pinMoveX > PIN_FIRST_STEP && this.pinMoveX < PIN_THIRD_STEP) {
          this.el.line.style.width = this.pinMoveX + 'px';
        }
      } else if (this.index === SECOND_PAGE) {
        if (this.pinMoveX > PIN_SECOND_STEP && this.pinMoveX < PIN_FOURTH_STEP) {
          this.el.line.style.width = this.pinMoveX + 'px';
        } else if (this.pinMoveX > PIN_FIRST_STEP && this.pinMoveX < PIN_THIRD_STEP) {
          this.el.line.style.width = this.pinMoveX + 'px';
        }
      } else if (this.index === THIRD_PAGE) {
        if (this.pinMoveX > PIN_SECOND_STEP && this.pinMoveX < PIN_FOURTH_STEP) {
          this.el.line.style.width = this.pinMoveX + 'px';
        }
      }

    },
    end: function () {
      var absMove = Math.abs(this.index * this.slideWidth - this.moveX);
      if (absMove > this.slideWidth / DEFAULT_SLIDER_FACTOR || this.longTouch === false) {
        if (this.moveX > this.index * this.slideWidth && this.index < THIRD_PAGE) {
          this.index++;
        } else if (this.moveX < this.index * this.slideWidth && this.index > FIRST_PAGE) {
          this.index--;
        }
      }
      this.el.holder.classList.add('animate');
      this.el.holder.style.transform = 'translate3d(-' + this.index * this.slideWidth + 'px,0,0)';
      this.el.line.style.width = this.index * HALF_LINE_WIDTH + 'px';
    }
  };

  thirdPageSlider.init();


})();
