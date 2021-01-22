$(document).ready(function() {
    //console.log(quiz[0].answers[1].answer);
    //var questionToRender = 0;
    //renderQuestion(questionToRender);
});

function clickOther(id) {
    $("input#" + id + "-text")
        .val("")
        .focus();
}

function randomNumber(low, high) {
    return Math.floor(Math.random() * high) + low;
}

function renderQuestion(questionNo) {
    if (quiz[questionNo]) {
        var showQuestion = isDependancy(quiz[questionNo].dependant);

        if (showQuestion) {
            $("#survey-space").empty();
            $("#survey-space").append(
                '<h2 class="the-question">' + quiz[questionNo].question + "</h2>"
            );
            //$('#survey-space').append('<h2 class="the-question">'+quiz[questionNo].question+'</h2>');
            $("#survey-space").append(
                '<div class="panel-wrapper"><div class="answer-panel"></div></div>'
            );

            var questionList = [];

            for (var i = 0; i < quiz[questionNo].answers.length; i++) {
                randomNo = randomNumber(0, i);
                console.log(randomNo);
                questionList.splice(randomNo, 0, i);
            }

            for (var i = 0; i < questionList.length; i++) {
                addAnswer(questionNo, questionList[i]);
            }

            if (quiz[questionNo].other) {
                addOther(questionNo);
            }
            var nextButton =
                '<div class="right-text"><p class="button next" onclick="nextQuestion(' +
                questionNo +
                ')">Next<span class="error-message">Please select at least one answer</span></p></div>';
            $("#survey-space").append(nextButton);

            showMoreCheck();

            setTimeout(showAnswers, 50);
        } else {
            questionNo++;
            renderQuestion(questionNo);
        }
    } else {
        theEndIsNigh();
        //console.log('the end is nigh');
    }
}

function showMoreCheck() {
    if (
        $(".answer-panel .label").last().position().top +
        $(".answer-panel .label").last().outerHeight() >
        350
    ) {
        $(".answer-panel").addClass("tall");
        $("#survey-space .panel-wrapper").append(
            '<p class="more-below"><span onclick="scrollDown()">Scroll for more</span></p>'
        );
    }
}

function scrollDown() {
    //console.log( $('.answer-panel').scrollTop() );
    var currentPos = $(".answer-panel").scrollTop();
    scrolling(currentPos, currentPos + 350);
}

function scrolling(current, max) {
    if (current < max) {
        current = current + 5;
        $(".answer-panel").scrollTop(current);
        setTimeout(function() {
            scrolling(current, max);
        }, 1);
    }
}

function addOther(questionNo) {
    var otherAnswerName = quiz[questionNo].dbQuestion,
        answerType = quiz[questionNo].type;

    if (answerType === "checkbox") {
        otherAnswerName = otherAnswerName + "-other";
    }

    var theOtherInput =
        '<div class=" label other hidden"><input type="' +
        answerType +
        '" id="' +
        otherAnswerName +
        '-other" name="' +
        otherAnswerName +
        '" value="Other"><label for="' +
        otherAnswerName +
        '-other" onclick="clickOther(\'' +
        otherAnswerName +
        '-other\')"></label><div class="fake-label"><input type="text" id="' +
        otherAnswerName +
        '-other-text" value="Other"></div></div>';
    $("#survey-space .answer-panel").append(theOtherInput);
}

function isDependancy(dependancy) {
    var showQuestion = false;
    if (dependancy) {
        $("#final-answers input").each(function() {
            if ($(this).attr("id") === dependancy) {
                showQuestion = true;
            }
        });
    } else {
        showQuestion = true;
    }
    if (showQuestion) {
        return true;
    } else {
        return false;
    }
}

function addAnswer(questionNo, answerno) {
    var answerID = quiz[questionNo].answers[answerno].id,
        answerType = quiz[questionNo].type,
        answerName = quiz[questionNo].dbQuestion,
        answerValue = quiz[questionNo].answers[answerno].value,
        answerAnswer = quiz[questionNo].answers[answerno].answer;

    if (quiz[questionNo].small) {
        var addClass = "small";
    }

    if (answerType === "checkbox") {
        answerName = answerName + "-" + answerValue;
    }

    var theInput =
        '<div class="label hidden ' +
        addClass +
        '"><input type="' +
        answerType +
        '" id="' +
        answerID +
        '" name="' +
        answerName +
        '" value="' +
        answerValue +
        '"><label for="' +
        answerID +
        '">' +
        answerAnswer +
        "</label></div>";
    $("#survey-space .answer-panel").append(theInput);
}

function submitForm() {
    if (grecaptcha.getResponse() == "") {
        //console.log('failed');
        $(".error-message").addClass("activate");
    } else {
        //console.log('pass');
        $("#process-space").removeClass("show");
        $("#thank-you-space").addClass("show");
    }
}

function theEndIsNigh() {
    //var thankYouMessage = '<h2>One last step</h2><div class="g-recaptcha" data-sitekey="6LcKCQ8UAAAAAMqMkWjGqJc5n9uHqE-EH6hvw_Ka"></div>';
    $("#survey-space").addClass("hidden");
    $("#process-space").addClass("show");
}

function showAnswers() {
    if ($("#survey-space .label.hidden").length > 0) {
        $("#survey-space .label.hidden").first().removeClass("hidden");
        setTimeout(showAnswers, 50);
    }
}

function sendToAnalytics(question, answer) {
    console.log(
        "ga('send', 'event', 'User Survey - Dec 2016',' " +
        question +
        "','" +
        answer +
        "' );"
    );
}

function logAnswers(question) {
    var questionValue = question.attr("value"),
        questionName = question.attr("name"),
        questionID = question.attr("id");

    if (questionValue === "Other") {
        questionValue = "Other: " + $("input#" + questionID + "-text").val();
    }

    var hiddenField =
        '<input type="hidden" name="' +
        questionName +
        '" value="' +
        questionValue +
        '" id="' +
        questionID +
        '" >';
    $("#final-answers").prepend(hiddenField);
    var theQuestion = $("#survey-space h2.the-question").text();
    sendToAnalytics(theQuestion, questionValue);
}

function nextQuestion(questionToRender) {
    var thouShallNotPass = true;
    $("#survey-space input").each(function() {
        if ($(this).is(":checked")) {
            logAnswers($(this));
            thouShallNotPass = false;
        }
    });
    if (!thouShallNotPass) {
        questionToRender++;
        renderQuestion(questionToRender);
    } else {
        $(".button.next span.error-message").addClass("activate");
    }
}

quiz = [

    {
        question: "1. Which IoT product(s) do you own. Select all that apply.",
        dependant: false,
        type: "checkbox",
        other: true,
        answers: [{
                answer: "Personal fitness tracker (i.e. Fitbit)",
                id: "1a"
            },
            {
                answer: "Smart refrigerator",
                id: "1b"

            },
            {
                answer: "Home monitoring system",
                id: "1c"
            },
            {
                answer: "Smart thermostat",
                id: "1d"
            },
            {
                answer: "Amazon Echo or similar",
                id: "1e"
            },
            {
                answer: "Pet tracker",
                id: "1f"
            },
            {
                answer: "Virtual reality headset",
                id: "1g"
            }
        ]
    },
    {
        question: "2. Are you concerned about the security of your IoT devices?",
        dependant: false,
        type: "radio",
        other: false,
        answers: [{
                answer: "Yes",
                id: "2a"
            },
            {
                answer: "No",
                id: "2b"
            }
        ]
    },

    {
        question: "3. Do you use an app to manage your IoT devices?",
        dependant: false,
        type: "radio",
        other: false,
        answers: [{
                answer: "Yes",
                id: "3a"
            },
            {
                answer: "No",
                id: "3b"
            }
        ]
    },

    {
        question: "4. Do you regularly update the password on your home router?",
        dependant: false,
        type: "radio",
        other: false,
        answers: [{
                answer: "Yes",
                id: "4a"
            },
            {
                answer: "No",
                id: "4b"
            }
        ]
    },

    {
        question: "5. Do you update the software on your IoT device?",
        dependant: false,
        type: "radio",
        other: false,
        answers: [{
                answer: "Yes",
                id: "5a"
            },
            {
                answer: "No",
                id: "5b"
            }
        ]
    },

    {
        question: "6. Do you use any of the following security products to protect your IoT devices?",
        dependant: false,
        type: "checkbox",
        other: true,
        answers: [{
                answer: "Dojo",
                id: "6a"
            },
            {
                answer: "Bitdefender Box",
                id: "6b"
            },
            {
                answer: "Cujo",
                id: "6c"
            },
            {
                answer: "RATtrap",
                id: "6d"
            },
            {
                answer: "Norton Core",
                id: "6e"
            },
            {
                answer: "None",
                id: "6f"
            }
        ]
    },

    {
        question: "7. Are you familiar with the Mirai IoT security hack from 2016?",
        dependant: false,
        type: "radio",
        other: false,
        answers: [{
                answer: "Yes",
                id: "7a"
            },
            {
                answer: "No, I never heard of it.",
                id: "7b"
            }
        ]
    },

    {
        question: "8. How many IoT devices are there estimated to be by the year 2021?",
        dependant: false,
        type: "radio",
        other: false,
        answers: [{
                answer: "5 million",
                id: "8a"
            },
            {
                answer: "10 million",
                id: "8b"
            },
            {
                answer: "1 billion",
                id: "8c"
            },
            {
                answer: "20 billion",
                id: "8d"
            },
            {
                answer: "1 trillion",
                id: "8e"
            }
        ]
    },

    {
        question: "9. Is there anything else you would like to say about IoT security?",
        dependant: false,
        type: "radio",
        other: true,
        answers: [{
                answer: "Yes",
                id: "9a"
            },
            {
                answer: "No",
                id: "9b"
            }
        ]
    }

];

var BOX = $(".captchaBox");
var WRAP = $(".captchaWrapper");
var CONTAINER = $(".captchaContainer");
var CHECK = $("#hiddenCaptcha");

$(function() {
    if (CHECK.prop("checked")) {
        BOX.removeClass();
        BOX.addClass("captchaBox circle fadeOut");
    }
    CONTAINER.click(function() {
        if (CONTAINER.hasClass("captchaError")) {
            CONTAINER.removeClass("captchaError");
        }
    });
});

BOX.click(function() {
    setTimeout(scaleDown, 100);
});

function scaleDown() {
    BOX.addClass("scaleDown");
    setTimeout(scaleUp, 600);
}

function scaleUp() {
    BOX.removeClass("scaleDown boxHover").addClass("circle scaleUp");
    WRAP.addClass("rotation");
    setTimeout(fadeToMark, 1200);
}

function fadeToMark() {
    BOX.removeClass("scaleUp rotation").addClass("fadeOut");
    setTimeout(checkItOut, 400);
}

function checkItOut() {
    CHECK.prop("checked", true);
}