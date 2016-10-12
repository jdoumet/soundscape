var server_base_url = '/';
var surveyVar = {	title: 'survey',
    name: 'survey',
    pages: [
        {
            name: 'survey',
            title: 'survey',
            elements: [
                {
                    name: "question",
                    type: 'radio',
                    label: "How does this sound make you feel?",
                    options: [
                        {
                            value: 'a) Sad',
                            key: 'a'
                        },
                        {
                            value: 'b) Nervous',
                            key: 'b'
                        },
                        {
                            value: 'c) No Answer',
                            key: 'c'
                        },
                        {
                            value: 'd) Relaxed',
                            key: 'd'
                        },
                        {
                            value: 'e) Happy',
                            key: 'e'
                        }
                    ]
                }
            ],
            options: [
                {
                    type: 'nextPage',
                    caption: 'Submit'
                }
            ]
        },
        {
            name: "thanks",
            elements: [
                {
                    type: 'handlebars',
                    source: 'thanks for your help.</p>'
                }
            ]
        }
    ]};

var surveyVar1 = {	title: 'survey',
    name: 'survey',
    pages: [
        {
            name: 'survey',
            title: 'survey',
            elements: [
                {
                    name: "question",
                    type: 'radio',
                    label: "How do these sounds make you feel?",
                    options: [
                        {
                            value: 'a) Sad',
                            key: 'a'
                        },
                        {
                            value: 'b) Nervous',
                            key: 'b'
                        },
                        {
                            value: 'c) No Answer',
                            key: 'c'
                        },
                        {
                            value: 'd) Relaxed',
                            key: 'd'
                        },
                        {
                            value: 'e) Happy',
                            key: 'e'
                        }
                    ]
                }
            ],
            options: [
                {
                    type: 'nextPage',
                    caption: 'Submit'
                }
            ]
        },
        {
            name: "thanks",
            elements: [
                {
                    type: 'handlebars',
                    source: 'thanks for your help.</p>'
                }
            ]
        }
    ]};

var narratorPlayer = document.getElementById("narrator-soundPlayer"), birdPlayer = document.getElementById("bird-soundPlayer"), effectPlayer = document.getElementById("effect-soundPlayer");
var narratorPlayList=["Narrator Sound 3.mp3", "Narrator Sound 4.mp3", "Narration Sound 5.mp3", "Letter 1 narration.mp3"], curPlaying = 0;
var rightAnswerList = [], tryingTime = 0, firstUserInputing =0, birdIndex = 0, letterConfirm1=0, surveyTimer;

var currentUser = {'answer0': [],'answer1': [],'answer2': [],'answer3': [],'answer4': [],'answer5': [],'answer6': [],'answer7': [],'answer8': []}, currentUserId = '', surveyNumber = 0;


// $(document).ready(function() {
    init();
// });

function init(){

    $('#value-input-container').hide();


    $('#preliminary-survey .form-div2').hide();
    $('#preliminary-survey .form-div4').hide();
    $('#preliminary-survey .form-div6').hide();



}

$('#preliminary-survey .form-div1 input').click(function () {
    if($("#preliminary-survey .form-div1 input:radio[name='question1']:checked").val() == 1)
        $('#preliminary-survey .form-div2').show();
    else
        $('#preliminary-survey .form-div2').hide();
});

$('#preliminary-survey .form-div3 input').click(function () {
    if($("#preliminary-survey .form-div3 input:radio[name='question3']:checked").val() == 1)
        $('#preliminary-survey .form-div4').show();
    else
        $('#preliminary-survey .form-div4').hide();
});


$('#preliminary-survey .form-div5 input').click(function () {
    if($("#preliminary-survey .form-div5 input:radio[name='question5']:checked").val() == 1)
        $('#preliminary-survey .form-div6').show();
    else
        $('#preliminary-survey .form-div6').hide();
});



$('#preliminary-survey input.submitSurvey').on('click', function (e) {

    e.preventDefault();

    $('.validation-error').hide();

    var formArray = $('#preliminary-survey-form').serializeArray(), postData = {};
    $.each(formArray, function(i, v){
        postData[v.name] = v.value;
    });

    console.log(JSON.stringify(postData));

    $.ajax({
        type: 'POST',
        data: JSON.stringify(postData),
        contentType: 'application/json',
        url: server_base_url + 'save',
        success: function(data) {
            console.log(data);

            if(data.response == 'success') {

                currentUser = merge_options(currentUser, postData);

                currentUserId = data.id;
                currentUser.id = currentUserId;

                Cookies.set('_id', data.id);
                Cookies.set('registered', 1);

                $('#preliminary-survey').hide();
                effectPlayer.pause();
                effectPlayer.src = "sounds/button_fx.mp3";
                effectPlayer.load();
                effectPlayer.play();

                $('#value-input-container').show();
                initializeForSequence1();               //TODO: change to initializeForSequence1

            }else{

                var errorContent = "";
                errorContent += "<h4>" + data.response + "</h4><div>";

                $.each(data.error, function(i, v){
                    errorContent += "<h5>" + v.message + "</h5>";
                });

                errorContent += "</div>";
                $('.validation-error').html(errorContent);
                $('.validation-error').show();
                console.log(data.error);
            }

        }
    });



});


function initializeForSequence1() {
    firstUserInputing = 1;
    var $survey = $('#survey');

    narratorPlayer.play();      //seq1

    setTimeout(function () {
        birdPlayer.loop = true;
        birdPlayer.volume = 0.3;
        birdPlayer.play();

        setTimeout(function () {

            $survey.survey({
                survey: surveyVar1,
                beforeChange: beforeChangeSubmit
            });

        }, 15000);

        setTimeout(function () {
            birdPlayer.volume = 0.4;
            //birdPlayer.play();
        }, 19000);

        setTimeout(function () {
            //narratorPlayer.play();

            $("#narrator-soundPlayer").attr("src", 'sounds/narration%202.mp3');
            narratorPlayer.load();
            narratorPlayer.play();
            $('#next-btn').show();

            // setTimeout(function () {}, 3000);

        }, 50000);

    }, 24000);


    setTimeout(function () {
        $('.rule-box').show();
    }, 27000);
}

/*
 $('.card').on('click', function (e) {
 e.preventDefault();
 $(this).toggleClass('flipped');
 });*/



$('#value-input').keydown(function (event) {
    if (event.keyCode == 13) {
        var input_value = $(this).val();

        if(firstUserInputing){
            effectPlayer.pause();
            effectPlayer.src = "sounds/userInput.mp3";
            effectPlayer.load();
            effectPlayer.play();
            if(input_value != '')
                currentUser['answer0'].push(input_value);

        }else{
            tryingTime++;
            if(input_value != '')
                currentUser['answer'+ (birdIndex+1)].push(input_value);

            if($.inArray(input_value, rightAnswerList) > -1){
                birdPlayer.pause();
                rightAnswerList=[];

                $('#survey').hide();
                $('#survey').html('');
                clearTimeout(surveyTimer);

                celebrate();
            }else{
                wrongAnswer();
            }
        }
        console.log(input_value);
        $(this).val('');


        //
        //$survey.remove();
    }
});

function celebrate(){

    effectPlayer.src = "sounds/correct.mp3";
    effectPlayer.load();
    effectPlayer.play();

    narratorPlayer.pause();
    $('#success-message .celebrate-message').html('Good job! You got a match!');

    if(tryingTime == 1)
        $('.try-number-message').html('<p class="try-number-message">It took you 1 try to guess the right answer.</p>');
    else
        $('.try-number-message').html('<p class="try-number-message">It took you '+ tryingTime +' tries to guess the right answer.</p>');
    $('#success-message .try-number-message').show();

$("#value-input").prop('disabled', true);

    $.ajax({
        type: 'POST',
        data: JSON.stringify(currentUser),
        contentType: 'application/json',
        url: server_base_url + 'update',
        success: function(data) {
            console.log(data);
        }
    });

    if(birdIndex == 7){

        $('#success-message').modal();
        setTimeout(function () {
            $('#success-message').modal('hide');
            setTimeout(function () {
                $('#success-message .celebrate-message').html('Good job! You have matched all bird sounds!');
                $('#success-message .try-number-message').hide();
                $('#success-message').modal();
                setTimeout(function () {
                    birdPlayer.src = "sounds/allbirds final.mp3";
                    birdPlayer.load();
                    birdPlayer.loop = true;
                    birdPlayer.play();
                }, 1500);

                setTimeout(function () {
                    $('#success-message').modal('hide');
                    playNarrator('Narrator Sound 10.mp3');
                    setTimeout(function () {
                        $('#letter-confirm').modal({backdrop: 'static', keyboard: false});
                    }, 10000);
                }, 3000);
            },500);
        },5000);

    }else{
        $('#success-message').modal();
        setTimeout(function () {
            $('#success-message').modal('hide');
            if(birdIndex == 3){
                $('.cards-container-0').hide();
                $('.cards-container-1').show();
                playNarrator('Narrator Sound 9.mp3');
                setTimeout(function() {
                    playNarrator('Narrator Sound 8.mp3');
                    setTimeout(function() {
                        $('#try-confirm-message').modal({backdrop: 'static', keyboard: false});
                    }, 1000);
                }, 7000);
            }else{
                playNarrator('Narrator Sound 8.mp3');
                setTimeout(function() {
                    $('#try-confirm-message').modal({backdrop: 'static', keyboard: false});
                }, 1000);
            }

        },5000);
    }


}



function wrongAnswer(){
    effectPlayer.src = "sounds/error.mp3";
    effectPlayer.load();
    effectPlayer.play();
}

function playNextNarrator(){

    narratorPlayer.src = "sounds/" + narratorPlayList[curPlaying];
    //Loads the audio song
    narratorPlayer.load();
    //Plays the audio song
    narratorPlayer.play();

    curPlaying++;

}


function playNarrator(link){

    narratorPlayer.src = "sounds/" + link;
    //Loads the audio song
    narratorPlayer.load();
    //Plays the audio song
    narratorPlayer.play();

    curPlaying++;

}


$('.next-sequence').on('click', function(e){
    e.preventDefault();

    effectPlayer.pause();
    effectPlayer.src = "sounds/button_fx.mp3";
    effectPlayer.load();
    effectPlayer.play();
    
    setTimeout(function(){
        initializeForSequence2();
    },1000);

});


$('.open-letter').on('click', function(e){
    e.preventDefault();

letterConfirm1 = 1;

    $('#letter-confirm').modal('hide');
    if(birdIndex == 7){
        effectPlayer.src = "sounds/letter fx.mp3";
        effectPlayer.load();
        effectPlayer.play();
        setTimeout(function () {

            $('.letter-container img').attr('src', 'images/Letter 2.png');
            $('.first-page').hide();
            $('.next-sequence').hide();
            $('.second-page').css('background-color', '#FBCCBA');
            $('.second-page').show();

            $('.letter-container').show();

            playNarrator('Letter 2 narration.mp3');
            setTimeout(function () {
                $('.button-end-container').show();
            },12000);
            setTimeout(function(){
                $('.acknowledgement-container').animate({right: "10px"},1000);
            },12000);

        },500);
    }else{



        effectPlayer.src = "sounds/letter fx.mp3";
        effectPlayer.load();
        effectPlayer.play();

        setTimeout(function () {
            // $('.second-page').css('background-color', '#FBCCBA');
            playNextNarrator();
            $('.letter-container').show();
            setTimeout(function () {
                $('.letter-container').hide();
                $('#help-confirm').modal({backdrop: 'static', keyboard: false});
            },16000);
        },500);
    }


});

$("#letter-confirm").on("hidden.bs.modal", function () {
    if(letterConfirm1 == 0) {
        setTimeout(function () {
            $('#letter-confirm').modal({backdrop: 'static', keyboard: false});
        }, 1500);
    }
});

$('.next-sequence3').on('click', function(e){
    e.preventDefault();
    birdPlayer.pause();
    $('#help-confirm').modal('hide');
    initializeForSequence3();
});


function initializeForSequence2() {
    firstUserInputing = 0;
    playNextNarrator();
    // setTimeout(function(){
    //     $('.first-page').hide();
    //     $('.second-page').show();
    // },2000);
    setTimeout(function () {
        //$('.second-page-content').css('background-image', 'url("images/BACKGROUND BIRDS.JPG")');
        // setTimeout(function () {

            playNextNarrator();

            setTimeout(function () {



                playNextNarrator();
                setTimeout(function () {

                    // $('.second-page-content').css('background-image', 'url("images/BACKGROUND BIRDS b&w.jpg")');

                    // $('.second-page').css('background-color', '#888888');
                    setTimeout(function(){
                        $('.first-page').hide();
                        $('.next-sequence').hide();
                        $('.second-page').css('background-color', '#CBBCAA');
                        $('.second-page').show();
                    },100);

                    birdPlayer.src = "sounds/ghostown fx.mp3";
                    birdPlayer.load();
                    birdPlayer.loop = true;
                    birdPlayer.play();

                    setTimeout(function(){
                        $('#letter-confirm').modal({backdrop: 'static', keyboard: false});
                    }, 9000)
                },5000);
            },3500);
        // },1000);

    }, 4000);

}



function initializeForSequence3() {

    $('.card').flip();

    $('.rule-box').hide();
    $('#survey').hide();

    $('.second-page').hide();

    $('.first-page').show();

    $('.cards-container-0').show();

    nextBird(0);                        //TODO: change to 0
}

$('.next-bird').on('click', function(e){
    e.preventDefault();
    birdIndex++;
    tryingTime = 0;

    nextBird(birdIndex);

});

$('.backtohomepage').on('click', function(e){
    e.preventDefault();


    effectPlayer.pause();
    effectPlayer.src = "sounds/button_fx.mp3";
    effectPlayer.load();
    effectPlayer.play();

    setTimeout(function(){
        window.location.href = "index.html";
    },500);
    /*e.preventDefault();

    narratorPlayer.src='sounds/narration%201.mp3';
    birdPlayer.src='sounds/allbirds%20final.mp3';
    effectPlayer.src='sounds/userInput.mp3';

    curPlaying = 0;
    rightAnswerList = []; tryingTime = 0; firstUserInputing =0; birdIndex = 0; letterConfirm1=0;

console.log('1');

    $('.rule-box').hide();
    $('#survey').hide();

    $('.second-page').hide();

    $('.first-page').show();

    $('.cards-container-0').hide();
    $('.cards-container-1').hide();
    $('.button-end-container').hide();
    $('.acknowledgement-container').css('right', '-330px');

    initializeForSequence1();*/

});

$('.backtomatching').on('click', function(e){
    e.preventDefault();
    curPlaying = 0;
    rightAnswerList = []; tryingTime = 0; firstUserInputing =0; birdIndex = 0; letterConfirm1=0;
    $('.button-end-container').hide();
    $('.cards-container-1').hide();
    $('.acknowledgement-container').css('right', '-330px');

    birdPlayer.pause();

    effectPlayer.pause();
    effectPlayer.src = "sounds/button_fx.mp3";
    effectPlayer.load();
    effectPlayer.play();

    currentUser = {'answer0': [],'answer1': [],'answer2': [],'answer3': [],'answer4': [],'answer5': [],'answer6': [],'answer7': [],'answer8': []};
    currentUser.id = currentUserId;

    initializeForSequence3();
});

function nextBird(id){

    $('#survey').html('<div class="survey-form"></div>');
    $('#survey').show();

    surveyNumber = id + 1;

    setTimeout(function() {
        switch (id) {
            case 0:
                playNarrator('narration_sound_6.mp3');

                setTimeout(function () {
                    playNarrator('narration sound 7.mp3');

                    setTimeout(function () {
                        $('.rule-box').html('<p>Which one of the birds is making this sound? Make sure to use the rhyme on the back of the cards as clues. Click on the cards to flip them around.</p>');
                        $('.first-page').show();
                        $('.rule-box').show();
                    },8000);

                    setTimeout(function () {
                        birdPlayer.src = "sounds/hoopoe final.mp3";
                        birdPlayer.load();
                        birdPlayer.loop = true;
                        birdPlayer.play();

                        $("#value-input").prop('disabled', false);

                        rightAnswerList = ['Hoopoe', 'hoopoe', 'the hoopoe'];
                        tryingTime = 0;

                        surveyTimer = setTimeout(function () {
                            $('.survey-form').survey({
                                survey: surveyVar,
                                beforeChange: beforeChangeSubmit
                            });
                        }, 27000);

                    }, 3000);
                }, 10500);

                break;
            case 1:

                playNarrator('narration sound 7.5.mp3');

                setTimeout(function () {
                    birdPlayer.src = "sounds/wren final.mp3";
                    birdPlayer.load();
                    birdPlayer.loop = true;
                    birdPlayer.play();

                    $("#value-input").prop('disabled', false);

                    rightAnswerList = ['Wren', 'wren', 'the wren', 'The wren'];
                    tryingTime = 0;

                    surveyTimer = setTimeout(function () {
                        $('.survey-form').survey({
                            survey: surveyVar,
                            beforeChange: beforeChangeSubmit
                        });
                    }, 15500);

                }, 3500);


                break;
            case 2:

                playNarrator('narration sound 7.5.mp3');
                setTimeout(function () {
                    birdPlayer.src = "sounds/jay final.mp3";
                    birdPlayer.load();
                    birdPlayer.loop = true;
                    birdPlayer.play();

                    $("#value-input").prop('disabled', false);

                    rightAnswerList = ['Jay', 'jay', 'the jay', 'The jay'];
                    tryingTime = 0;

                    surveyTimer = setTimeout(function () {
                        $('.survey-form').survey({
                            survey: surveyVar,
                            beforeChange: beforeChangeSubmit
                        });
                    }, 15500);


                }, 3500);

                break;
            case 3:
                playNarrator('narration sound 7.5.mp3');
                setTimeout(function () {
                    birdPlayer.src = "sounds/blackbird final.mp3";
                    birdPlayer.load();
                    birdPlayer.loop = true;
                    birdPlayer.play();

                    $("#value-input").prop('disabled', false);

                    rightAnswerList = ['blackbird', 'Blackbird', 'the Blackbird', 'the blackbird'];
                    tryingTime = 0;

                    surveyTimer = setTimeout(function () {
                        $('.survey-form').survey({
                            survey: surveyVar,
                            beforeChange: beforeChangeSubmit
                        });
                    }, 15500);

                }, 3500);

                break;
            case 4:
                playNarrator('narration sound 7.5.mp3');
                setTimeout(function () {
                    birdPlayer.src = "sounds/cuckoo final.mp3";
                    birdPlayer.load();
                    birdPlayer.loop = true;
                    birdPlayer.play();

                    $("#value-input").prop('disabled', false);

                    rightAnswerList = ['cuckoo', 'Cuckoo', 'the Cuckoo', 'the cuckoo'];
                    tryingTime = 0;

                    surveyTimer = setTimeout(function () {
                        $('.survey-form').survey({
                            survey: surveyVar,
                            beforeChange: beforeChangeSubmit
                        });
                    }, 15500);

                }, 3500);



                break;
            case 5:

                playNarrator('narration sound 7.5.mp3');
                setTimeout(function () {
                    birdPlayer.src = "sounds/tawny owl final.mp3";
                    birdPlayer.load();
                    birdPlayer.loop = true;
                    birdPlayer.play();

                    $("#value-input").prop('disabled', false);

                    rightAnswerList = ['tawny owl', 'Tawny owl', 'the Tawny owl', 'the tawny owl'];
                    tryingTime = 0;

                    surveyTimer = setTimeout(function () {
                        $('.survey-form').survey({
                            survey: surveyVar,
                            beforeChange: beforeChangeSubmit
                        });
                    }, 15500);

                }, 3500);

                break;
            case 6:

                playNarrator('narration sound 7.5.mp3');
                setTimeout(function () {
                    birdPlayer.src = "sounds/Chukar_final.mp3";
                    birdPlayer.load();
                    birdPlayer.loop = true;
                    birdPlayer.play();

                    $("#value-input").prop('disabled', false);

                    rightAnswerList = ['chukar partridge', 'Chukar partridge', 'Chukar Partridge', 'the chukar partridge', 'the Chukar partridge', 'the Chukar Partridge'];
                    tryingTime = 0;

                    surveyTimer = setTimeout(function () {
                        $('.survey-form').survey({
                            survey: surveyVar,
                            beforeChange: beforeChangeSubmit
                        });
                    }, 15500);

                }, 3500);

                break;
            case 7:
birdIndex = 7;
                playNarrator('narration sound 7.5.mp3');
                setTimeout(function () {
                    birdPlayer.src = "sounds/greenfinch final.mp3";
                    birdPlayer.load();
                    birdPlayer.loop = true;
                    birdPlayer.play();

                    $("#value-input").prop('disabled', false);

                    rightAnswerList = ['greenfinch', 'Greenfinch', 'the Greenfinch', 'the greenfinch'];
                    tryingTime = 0;

                    surveyTimer = setTimeout(function () {
                        $('.survey-form').survey({
                            survey: surveyVar,
                            beforeChange: beforeChangeSubmit
                        });
                    }, 15500);

                }, 3500);


                break;
            default:
                nextBird(0);
                break;
        }

    },500);

}


$('.card').on('click',function(){
    effectPlayer.src = "sounds/flip.mp3";
    effectPlayer.load();
    effectPlayer.play();
});

function merge_options(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}

$('.survey-forms button.btn-primary').on('click', function(){
    console.log('TEST');
});

$("#survey-form-container").submit(function(event){
    event.preventDefault();
});

function beforeChangeSubmit(from, to, next){

    var target = this;

    if(from === void 0){
        next();
    }else{
        var survey = $.survey(target);
        var data = survey.pageData();
        console.log(data.question);

        survey.updateData(data);

        var postJson = {};
        postJson['survey'+surveyNumber] = data.question;
        postJson['id'] = currentUser.id;

        $.ajax({
            type: 'POST',
            data: JSON.stringify(postJson),
            contentType: 'application/json',
            url: server_base_url + 'update',
            success: function(data) {
                console.log(data);
            }
        });

        next();
    }

}

