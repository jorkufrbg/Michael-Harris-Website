$(document).ready(function () {
    $("#loader-main-bg").hide();
});

//HAMBURGER AND MOBILE MENU ANIMATION
var body = document.querySelector("body");

//ANIMATIONS ON SCROLL
var $animation_elements = $('.animated');
var $window = $(window);

function check_if_in_view() {
    var window_height = $window.height();
    var window_top_position = $window.scrollTop();
    var window_bottom_position = (window_top_position + window_height);

    $.each($animation_elements, function () {
        var $element = $(this);
        var element_height = $element.outerHeight();
        var element_top_position = $element.offset().top;
        var element_bottom_position = (element_top_position + element_height);

        if ((element_bottom_position >= window_top_position) &&
            (element_top_position <= window_bottom_position)) {

            if ($element.hasClass("motoretta-lf")) {
                $element.addClass('animation-lf');
            } else if ($element.hasClass("motoretta-rt")) {
                $element.addClass('animation-rt');
            } else if ($element.hasClass("bg-left")) {
                $element.addClass('bg-animation-left');
            } else {
                $element.addClass('bg-animation-right');
            }

        }
        /*else {
                     $element.removeClass('animation-lf');
                     $element.removeClass('animation-rt');
                 }*/
    });
}

$window.on('scroll resize', check_if_in_view);
$window.trigger('scroll');



