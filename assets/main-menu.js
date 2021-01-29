(function($) {

  var $window = $(window);
  var $doc = $(document);
  var $body = $(document.body);
  var $siteHeader = $('.site-header');
  var $header = $('.main-nav');
  var $headerTable = $('.header-table');
  var $navContentContainer = $('.nav-content-container');

  window.Aldrich = {
    client: { height: 0, width: 0, scrollPosition: $window.scrollTop() },

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

      Aldrich.client.width = $window.width();
      Aldrich.client.height = $window.height();

      if (location.hash.length) {
        $doc.imagesLoaded( function() {
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

      $navContentContainer.on("click", "a", function(e) {
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
          $headerTable.addClass('active-header');
          setTimeout(function() {
            Aldrich.openMainNav()
          }, 50);
        },
        out: function() {
          $headerTable.removeClass('active-header');
          Aldrich.closeMainNav();
        }
      });

      $('.menu li').hoverIntent({
        over: function() {
          Aldrich.swapMainNaveContent(this);
        },
        out: function() {
          //
        }
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
      if($window.width()<1170) {
        $largeLogo.animate({
          bottom: '0'
        }, 750);
        Aldrich.showTabletLogoInHeader();
      } else {
        $largeLogo.animate({
          bottom: '26'
        }, 750);
        // Aldrich.showLogoInHeader();
      }

      $headerTable.addClass('main-nav-open');
    },

    closeMainNav: function() {
      // Aldrich.hideLogoInHeader();
      $('.arrow').find('.large-logo').removeAttr("style");
      // $navContentContainer.empty();
      $('.menu li').removeClass('active');
      $headerTable.removeClass('main-nav-open');
    },

    swapMainNaveContent: function(el) {
      $('.menu li').removeClass('active');
      $(el).addClass('active');
      // Aldrich.changeNavLogoColor(el);
      if($('.menu li').hasClass('active')) {
        var thisContent = $(el).children('.nav-content').html();
        $navContentContainer.empty();
        $(thisContent).appendTo($navContentContainer);
      }
    },

    toggleMobileNav: function() {
      $('.mobile-nav-header .open').slideToggle(function() {
        $('.mobile-nav-header .open').css('height', window.screen.height);
      });
      $body.toggleClass('mobile-nav-active');
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
        if( $navContentContainer.is(':empty') ) {
          navContainer.animate({
            height: 160
          }, 325, function() {
            arrowLogo.addClass("open");
          });
        }
      });
    },

    // scrollHandler: function() {
    //   Aldrich.client.scrollPosition = $window.scrollTop();

    //   if (Aldrich.client.scrollPosition > 42) {
    //     $siteHeader.addClass('fixed-nav');
    //     $body.addClass('fixed-nav');
    //   } else {
    //     $body.removeClass('fixed-nav');
    //     $siteHeader.removeClass('fixed-nav');
    //   }
    // },

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
})(jQuery);
