$(document).ready(function($) {
    $(window).on("scroll", function() {
        //ADD .TIGHT
        if (
            $(window).scrollTop() + $(window).height() >
            $(".wrapper").outerHeight()
        ) {
            $("body").addClass("tight");
            $(".arrow").hide();
        } else {
            $("body").removeClass("tight");
            $(".arrow").show();
        }
    });

    //BACK TO PRESENTATION MODE
    $("html").on("click", "body.tight .wrapper", function() {
        $("html, body").animate({
                scrollTop: $(".wrapper").outerHeight() - $(window).height()
            },
            500
        );
    });
});

$(".arrow").click(function() {
    $("html").animate({ scrollTop: $("html").prop("scrollHeight") }, 1200);
});


const flippable = document.querySelector('.right-container');
const nextBtn = document.querySelector('#next');
const backBtn = document.querySelector('#back1');
const toggles = [nextBtn, backBtn];

toggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
        flippable.classList.toggle('flip');
    })

})


// Headline Effects

var spanText = function spanText(text) {
    var string = text.innerText;
    var spaned = "";
    for (var i = 0; i < string.length; i++) {
        if (string.substring(i, i + 1) === " ")
            spaned += string.substring(i, i + 1);
        else spaned += "<span>" + string.substring(i, i + 1) + "</span>";
    }
    text.innerHTML = spaned;
};

var headline = document.querySelector("h1");

spanText(headline);