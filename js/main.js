var $document = $(document);
var $win = $(window);

var options = {
    menuDrop: {selector: '.menu.main', outer: '.outer-ul', inner: '.outer-ul ul', drop: '.drop-ul'}
};

var menuMobile = new MenuMobile('.menu-mobile');
var menuBtn = new MenuBtn('.menu-mobile-btn');
var menuDrop = new MenuDrop(options.menuDrop);


function MenuMobile(selector) {
    var self = this;
    self.$el = $(selector);
}

MenuMobile.prototype.init = function () {
    var self = this;
    self.mobileWidth = 320;//$(window).width();
    self.$el.css({width: self.mobileWidth, right: -self.mobileWidth});
    $document.on('menu:expand', self.expand.bind(self));
    $document.on('menu:collapse', self.collapse.bind(self));
};
MenuMobile.prototype.expand = function () {
    var self = this;
    console.log(self.$el);
    self.$el.stop().velocity({
        right: 0,
        display: 'block',
        opacity: [1, "easeInCubic", 0]
    }, 300);
};
MenuMobile.prototype.collapse = function () {
    var self = this;
    self.$el.stop().velocity({
        right: -100,
        opacity: [0, "easeOutCubic", 1],
        display: 'none'
    }, 250);

};


function MenuBtn(selector) {
    var self = this;
    self.$el = $(selector);
    self.burgerTop = self.$el.find('.hamburger-icon.top');
    self.burgerMiddle = self.$el.find('.hamburger-icon.middle');
    self.burgerBottom = self.$el.find('.hamburger-icon.bottom');
}

MenuBtn.prototype.init = function () {
    var self = this;
    self.$el.on('click', function () {
        if (self.$el.hasClass('active')) {
            $document.trigger('menu:collapse');

        } else {
            $document.trigger('menu:expand');
        }
    });
    $document.on('menu:expand', self.expand.bind(self));
    $document.on('menu:collapse', self.collapse.bind(self));
};
MenuBtn.prototype.expand = function () {
    var self = this;
    var duration = 200;
    self.burgerTop.velocity({top: 11}, {duration: duration}).velocity({transform: 'rotateZ(-45deg)'}, {duration: duration});
    self.burgerBottom.velocity({top: 11}, {duration: duration}).velocity({transform: 'rotateZ(45deg)'}, {duration: duration});
    self.$el.addClass('active');
    console.log(self);
};
MenuBtn.prototype.collapse = function () {
    var self = this;
    var duration = 200;
    self.burgerTop.velocity({
        top: 11,
        transform: 'rotateZ(0)'
    }, {duration: duration}).velocity({top: 0}, {duration: duration});
    self.burgerMiddle.velocity({opacity: 0}, {duration: duration}).velocity({
        top: 11,
        opacity: 1
    }, {duration: duration});
    self.burgerBottom.velocity({
        top: 11,
        transform: 'rotateZ(0)'
    }, {duration: duration}).velocity({top: 22}, {duration: duration});
    self.$el.removeClass('active');
};

var sum = function (array) {
    return array.reduce(function (x, y) {
        return x + y;
    });
};
var widths = function ($elements) {
    $elements.each(function () {
        var widths = $(this).children('li').map(function () {
            var current = $(this).width();
            return current;
        }).get();
        var totalWidth = sum(widths) + 1;
        $(this).width(totalWidth);
        return totalWidth;
    });
};

function MenuDrop(options) {
    var self = this;
    self.$el = $(options.selector);
    self.outer = options.outer || '.outer-ul';
    self.inner = options.inner || '.inner-ul';
    self.drop = options.drop || '.drop-ul';
    self.outerLevel = self.$el.find(self.outer);
    self.innerLevels = self.$el.find('.outer-ul ul');
    self.expandLevelBtns = self.$el.find('span.expand');
    self.expandLevelText = $('a.expand');
    self.expandable = self.$el.find('li').has('.expand');
}

MenuDrop.prototype.init = function () {
    var self = this;
    if ($win.width() > 950) {
        self.initHoverEvent();
    } else {
        self.initClickEvent();
    }
};
MenuDrop.prototype.initClickEvent = function () {
    var self = this;
    self.expandLevelBtns.on('click', function (e) {
        console.log('level buttons');
        e.stopPropagation();
        var $expandLevelBtn = $(this);
        var $nextLevel = $expandLevelBtn.siblings(self.drop).first();
        $nextLevel.toggleClass('active');
        $expandLevelBtn.toggleClass('active');
        if ($expandLevelBtn.hasClass('active')) {
            $nextLevel.velocity({
                opacity: [1, "easeInCubic", 0],
                top: -10,
                display: "block"
            }, 200);
            // $expandLevelBtn.html('-');
            $document.trigger('menu:expand:level');
        } else {
            $nextLevel.velocity({
                opacity: [0, "easeInCubic", 1],
                top: -25,
                display: "none"
            }, 200);
            // $expandLevelBtn.html('+');
            $document.trigger('menu:collapse:level');
        }
    });
    // self.expandLevelText.on('click', function (e) {
    //     console.log('text buttons');
    //     // mobile menu drop down levels
    //     e.stopPropagation();
    //     var $expandLevelBtn = $(this);
    //     var $nextLevel = $expandLevelBtn.siblings(self.drop).first();
    //
    //     $nextLevel.toggleClass('active');
    //
    //     console.log('expand level');
    //     $expandLevelBtn.toggleClass('active');
    //     if ($expandLevelBtn.hasClass('active')) {
    //         $nextLevel.velocity({
    //             opacity: [1, "easeInCubic", 0],
    //             top: -10,
    //             display: "block"
    //         }, 200);
    //         $expandLevelBtn.siblings('span.expand').html('-');
    //         $document.trigger('menu:expand:level');
    //     } else {
    //         $nextLevel.velocity({
    //             opacity: [0, "easeInCubic", 1],
    //             top: -25,
    //             display: "none"
    //         }, 200);
    //         $expandLevelBtn.siblings('span.expand').html('+');
    //         $document.trigger('menu:collapse:level');
    //     }
    // });
    console.log('click events');
};
MenuDrop.prototype.initHoverEvent = function () {
    var self = this;
    widths(self.innerLevels);
    self.expandable.on('mouseenter', function (e) {
        var $nextLevel = $(this).find(self.drop).first();
        $nextLevel.velocity({
            opacity: [1, "easeInCubic", 0],
            top: 35,
            display: "block"
        }, 250);
        self.expandLevel($nextLevel);
        if ($nextLevel.width() < 2) {
            widths($nextLevel);
        }
    });
    self.expandable.on('mouseleave', function () {
        var $nextLevel = $(this).find(self.drop);
        $nextLevel.velocity({
            opacity: [0, "easeInCubic", 1],
            top: 30,
            display: "none"
        }, 200);
        self.collapseLevel($nextLevel);
    });
    console.log('mouse events');
};
MenuDrop.prototype.expandLevel = function ($level) {
    var self = this;
    $level.addClass('active');

};
MenuDrop.prototype.collapseLevel = function ($level) {
    var self = this;
    $level.removeClass('active');
};
var initNav = function () {
    menuBtn.init();
    menuDrop.init();

    if ($win.width() < 950) {
        menuMobile.init();
    }
    if ($win.width() > 950) {

    }

};

(function ($) {

    $.belowthefold = function (element, settings) {

        var fold = $(window).height() + $(window).scrollTop();

        return fold <= $(element).offset().top - settings.threshold;

    };


    $.abovethetop = function (element, settings) {

        var top = $(window).scrollTop();

        return top >= $(element).offset().top + $(element).height() - settings.threshold;

    };


    $.rightofscreen = function (element, settings) {
        var fold = $(window).width() + $(window).scrollLeft();
        return fold <= $(element).offset().left - settings.threshold;
    };


    $.leftofscreen = function (element, settings) {
        var left = $(window).scrollLeft();
        return left >= $(element).offset().left + $(element).width() - settings.threshold;
    };


    $.inviewport = function (element, settings) {
        return !$.rightofscreen(element, settings) && !$.leftofscreen(element, settings) && !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
    };


    $.extend($.expr[':'], {

        "below-the-fold": function (a, i, m) {
            return $.belowthefold(a, {
                threshold: 0
            });
        },

        "above-the-top": function (a, i, m) {
            return $.abovethetop(a, {
                threshold: 0
            });
        },

        "left-of-screen": function (a, i, m) {
            return $.leftofscreen(a, {
                threshold: 0
            });
        },

        "right-of-screen": function (a, i, m) {
            return $.rightofscreen(a, {
                threshold: 0
            });
        },

        "in-viewport": function (a, i, m) {
            return $.inviewport(a, {
                threshold: 0
            });
        }
    });

})(jQuery);

$document.ready(function () {
    console.log('document ready');
    initNav();

    $('.animated:in-viewport').addClass('in-view');
    $(window).scroll(function () {
        $('.animated:in-viewport').addClass('in-view');
    });

    $('.inquiry a').magnificPopup({
        type: 'inline',
        mainClass: 'mfp-zoom-in',
        tLoading: '',
        removalDelay: 500, //delay removal by X to allow out-animation
        closeBtnInside: true,
        closeOnContentClick: false,
        midClick: true
    });
});


