var Aldrich = {

  client: { height: 0, width: 0, scrollPosition: $(window).scrollTop() },

	debug: {
    enabled: false,
    log: function(message) {
      if (Aldrich.debug.enabled)  console.log('[DEBUG] ' + message);
    }
  },

   initialize: function() {
   	Aldrich.debug.log('Initializing the application...');
    Aldrich.bind();
    Aldrich.disableMapScroll();
  },

  bind: function() {
  	Aldrich.debug.log('Binding Main...');

    Aldrich.client.width = $(window).width();
    Aldrich.client.height = $(window).height();

    var throttledResize = _.throttle(Aldrich.resizeHandler, 50);
    $(window).resize(throttledResize);
    $(window).load(Aldrich.resizeHandler);
    var throttledScroll = _.throttle(Aldrich.scrollHandler, 50);
    $(window).scroll(Aldrich.scrollHandler);

    if (location.hash.length) {
      $(document).imagesLoaded( function() {
        setTimeout(function(){
          var $targetLoad = $(location.hash),
              headerOffset = $(".main-nav").outerHeight(),
              target = $targetLoad.offset().top,
              targetOffset = target-headerOffset;

          if ($('body.exhibition').length) {
            $('#exhibition-wrapper').animate({
              scrollTop: targetOffset
            }, 1000);
            $('html,body').animate({
              scrollTop: -headerOffset
            }, 1000);
          } else {
            $('html,body').animate({
              scrollTop: targetOffset
            }, 1000);
          }
          return false;
        }, 250);
      });
    }

    $(".nav-content-container").on("click", "a", function(e) {
      if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
        e.preventDefault();
        var target = $(this.hash),
            headerOffset = $(".main-nav").outerHeight();
        var target = target.length ? target : $('[name=' + this.hash.slice(1) +']');

        if (target.length) {
          if ($('body.exhibition').length) {
            $('#exhibition-wrapper').animate({
              scrollTop: target.offset().top-headerOffset
            }, 1000);
            $('html,body').animate({
              scrollTop: -headerOffset
            }, 1000);
          } else {
            $('html,body').animate({
              scrollTop: target.offset().top-headerOffset
            }, 1000);
          }
          window.location.hash = this.hash;
          return false;
        }
      }
    });

  	$('[data-behavior="toggle-mobile-nav"]').on("click", function() {
  		Aldrich.toggleMobileNav();
    });

    $('[data-behavior="toggle-nav-height"]').hoverIntent({
      over: function() {
        $('.header-table').addClass('active-header');
        setTimeout(function(){
          
          Aldrich.openMainNav();
          
        }, 125);
      },
      out: function() {
        $('.header-table').removeClass('active-header');
        Aldrich.closeMainNav();
        
      }
    });

    $('.menu li').hoverIntent({
      over: function() {
        Aldrich.swapMainNaveContent(this);
      },
      out: function() {}
    });

    $('[data-behavior="toggle-nav-height"]').on('touchstart', function(e){
      Aldrich.openMainNav();
    });

    $("#outer").on('touchstart', function() {
      Aldrich.closeMainNav();
    });

    $('.main-nav .menu li').on('touchstart', function(e){
      if(!$(this).hasClass('content-loaded')) {
        e.preventDefault();
        $('.main-nav .menu li').removeClass('content-loaded');
        $(this).addClass('content-loaded');
        Aldrich.swapMainNaveContent(this);
      }
    });

    $('.support-aldrich-image').hoverIntent({
      over: function() {
        $('.support-aldrich-image').removeClass('inactive');
        $('.support-aldrich-image').addClass('active');
      },
      out: function() {
        $('.support-aldrich-image').removeClass('active');
        $('.support-aldrich-image').addClass('inactive');
      }
    });

    $('[data-behavior="display-pop-up-floor"]').on("click", function(event) {
      var $floorBlue = $('.content-pop-up.bg-blue');
      var $floorgreenBlue = $('.content-pop-up.bg-green-blue');
      var $floorYellow = $('.content-pop-up.bg-yellow');
      var $floorYellowGreen = $('.content-pop-up.bg-yellow-green');
      var $floorlightBlue = $('.content-pop-up.bg-light-blue');
      var $facilitiesBG = $('.desktop-view .facilities-wrapper');
      $facilitiesBG.removeAttr('style');
      if($(this).parent('li').hasClass('bg-yellow')) {
        $floorYellow.addClass('visible');
        $facilitiesBG.css('background-color','#FFE100');
        $floorYellow.siblings().removeClass('visible');
      }
      if($(this).parent('li').hasClass('bg-blue')) {
        $floorBlue.addClass('visible');
        $facilitiesBG.css('background-color','#0096FF');
        $floorBlue.siblings().removeClass('visible');
      }
      if($(this).parent('li').hasClass('bg-green-blue')) {
        $floorgreenBlue.addClass('visible');
        $facilitiesBG.css('background-color','#00E1C8');
        $floorgreenBlue.siblings().removeClass('visible');
      }
      if($(this).parent('li').hasClass('bg-light-blue')) {
        $floorlightBlue.addClass('visible');
        $facilitiesBG.css('background-color','#00C8FF');
        $floorlightBlue.siblings().removeClass('visible');
      }
      if($(this).parent('li').hasClass('bg-yellow-green')) {
        $floorYellowGreen.addClass('visible');
        $facilitiesBG.css('background-color','#AFE622');
        $floorYellowGreen.siblings().removeClass('visible');
      }
    });

//     if($('.home').length) {
//       $(document).on('click', function(event) {
//         var toggledList = $(".toggled-content");
//         var directionsOverlay = $(".content-pop-up.test");
//         if (!toggledList.is(event.target) && toggledList.has(event.target).length === 0) {
//           if (!directionsOverlay.is(event.target) && directionsOverlay.has(event.target).length == 0){
//            $('.hours-directions .content-pop-up').removeClass('visible');
//          }
//         }
//       });
//     }

    $('[data-behavior="display-pop-up"]').on("click", function(event) {
      var $yellow = $('.hours-directions .content-pop-up.bg-yellow');
      var $yellowGreen = $('.hours-directions .content-pop-up.bg-yellow-green');
      var $green = $('.hours-directions .content-pop-up.bg-green');
      var $blue = $('.hours-directions .content-pop-up.bg-blue');
      var $greenBlue = $('.hours-directions .content-pop-up.bg-green-blue');

      if($(this).hasClass('bg-yellow')) {
        if($('.home').length) {
          $yellow.toggleClass('visible');
        }
        if($('.visit').length) {
          $yellow.addClass('visible');
        }
        $yellow.siblings().removeClass('visible');
      }
      if($(this).hasClass('bg-green')) {
        if($('.home').length) {
          $green.toggleClass('visible');
        }
        if($('.visit').length) {
          $green.addClass('visible');
        }
        $green.siblings().removeClass('visible');
      }
      if($(this).hasClass('bg-yellow-green')) {
        if($('.home').length) {
          $yellowGreen.toggleClass('visible');
        }
        if($('.visit').length) {
          $yellowGreen.addClass('visible');
        }
        $yellowGreen.siblings().removeClass('visible');
      }
      if($(this).parent('li').hasClass('bg-blue')) {
        if($('.visit').length) {
          $blue.addClass('visible');
          $facilitiesBG.css('background-color','#0096FF')
        }
        $blue.siblings().removeClass('visible');
      }
    });

    $('[data-behavior="back-to-top"]').on("click", function() {
      Aldrich.backToTop();
    });

    $('.mobile-nav-header a').on('click touchend', function(e) {
      var el = $(this);
      var link = el.attr('href');
      window.location = link;
    });
  },

  openMainNav: function() {
    var $largeLogo = $('.arrow').find('.large-logo');
    $largeLogo.css('position', 'absolute');
    if($(window).width()<1170) {
      $largeLogo.animate({
        bottom: '0'
      }, 750);
      Aldrich.showTabletLogoInHeader();
    } else {
      $largeLogo.animate({
        bottom: '26'
      }, 750);
      Aldrich.showLogoInHeader();
    }
  },

  closeMainNav: function() {
    Aldrich.hideLogoInHeader();
    $('.arrow').find('.large-logo').removeAttr("style");
    $('.nav-content-container').empty();
    $('.menu li').removeClass('active');
  },

  swapMainNaveContent: function(el) {
    $('.menu li').removeClass('active');
    $(el).addClass('active');
    Aldrich.changeNavLogoColor(el);
    if($('.menu li').hasClass('active')) {
      var thisContent = $(el).children('.nav-content').html();
      $('.nav-content-container').empty();
      $(thisContent).appendTo('.nav-content-container');
    }
  },

/*  resizeHandler: function() {
    Aldrich.client.width = $(window).width();
    Aldrich.client.height = $(window).height();

    var outerPadding = $('#outer').css('padding-top').replace(/[^-\d\.]/g, '');
    var heroHeight = Aldrich.client.height - outerPadding;

    $('.hero').css('height', heroHeight * 0.65);
  },
*/
  toggleMobileNav: function() {
  	$('.mobile-nav-header .open').slideToggle(function() {
      $('.mobile-nav-header .open').css('height', window.screen.height);
    });
    $('body').toggleClass('mobile-nav-active');
  },

  showTabletLogoInHeader: function() {
    $('.arrow-container').each(function() {
      var navContainer = $(this);
      var arrowLogo = $('.arrow');
      var subContentHeight = $('.col-10-20.menu').outerHeight();

      navContainer.animate({
        height: subContentHeight-60,
        minHeight: 160
      }, 325, function() {
        arrowLogo.addClass("open");
      });
      if( $('.nav-content-container').is(':empty') ) {
        navContainer.animate({
          height: 160
        }, 325, function() {
          arrowLogo.addClass("open");
        });
      }
    });
  },

  showLogoInHeader: function() {
    $('.arrow-container').each(function() {
      var navContainer = $(this);
      var arrowLogo = $('.arrow');
      var openNavHeight = navContainer.find('.large-logo').height();

      navContainer.animate({
        height: openNavHeight
      }, 325, function() {
        arrowLogo.addClass("open");
      });
    });
  },

  hideLogoInHeader: function() {
    $('.arrow-container').each(function() {
      var navContainer = $(this);
      var arrowLogo = $('.arrow');
       arrowLogo.removeClass("open");
        $('.arrow-container ul li').hide();
      navContainer.animate({
        height:'0',
        minHeight:'0'
      }, 125, function() {
        arrowLogo.removeClass("open");
        $('.arrow-container ul li').hide();
        //$('.svg-logo').removeAttr("id");
      });
    });
  },

  changeNavLogoColor: function() {
    $('.menu li.active').each(function() {
      if($(this).hasClass('blue')) {
        $('.arrow-container .blue').show();
        $('.arrow-container .green').hide();
        $('.arrow-container .yellow').hide();
        $('.arrow-container .green-blue').hide();
      }
      if($(this).hasClass('green')) {
        $('.arrow-container .green').show();
        $('.arrow-container .blue').hide();        
        $('.arrow-container .yellow').hide();
        $('.arrow-container .green-blue').hide();
      }
      if($(this).hasClass('yellow')) {
        $('.arrow-container .yellow').show();
        $('.arrow-container .green').hide();
        $('.arrow-container .blue').hide();       
        $('.arrow-container .green-blue').hide();
      }
      if($(this).hasClass('green-blue')) {
        $('.arrow-container .green-blue').show();
        $('.arrow-container .yellow').hide();
        $('.arrow-container .green').hide();
        $('.arrow-container .blue').hide();      
       
      }
      if($(this).hasClass('yellow-green')) {
        $('.arrow-container .yellow-green').show();
      }
      
      if($(this).hasClass('light-blue')) {
        $('.arrow-container .light-blue').show();
      }
    });
  },

//   backToTop: function() {
//     $('html,body').animate({
//       scrollTop: 0
//     }, 700);
//   },

  scrollHandler: function() {
    var $header = $(".main-nav");

    Aldrich.client.scrollPosition = $(window).scrollTop();

    if (Aldrich.client.scrollPosition > 27) {
      $('.site-header').addClass('fixed-nav');
      $('body').addClass('fixed-nav');
    } else {
      $('body').removeClass('fixed-nav');
      $('.site-header').removeClass('fixed-nav');
    }

    if($('.main-nav .arrow').hasClass('open')) {
      if(!$('html.no-touch').length) {
       // Aldrich.closeMainNav();
      }
    }
  },

  getScrollDirection: function() {
    var previousScrollPosition = Aldrich.client.scrollPosition;
    Aldrich.client.scrollPosition = $(window).scrollTop();
    if (Aldrich.client.scrollPosition > previousScrollPosition) {
      return 'down';
    } else {
     return 'up';
    }
  },

  disableMapScroll: function() {
    if ($('#live-map').length) {
      $('#live-map iframe').addClass('scrolloff');
      $('#live-map').on('click', function () {
          $('#live-map iframe').removeClass('scrolloff');
      });

      $("#live-map").mouseleave(function () {
          $('#live-map iframe').addClass('scrolloff');
      });
    }
  }
}
