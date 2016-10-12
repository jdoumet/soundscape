//JM game fresh
//var guess;
//var guesses = 0;
//Display rules and play narration soundfile
//while //soundfilePlays[5] = true;
//backFore= prompt ("Enter F for foreground and B for Background:");
//if (backFore != f || backFore != F || backFore != b || backFore != B)	{
//alert("Please enter a valid letter");
//} else if (backFore == b || backFore == B) {
//soundfilePlays[5]= false;
//guesses = guesses + 1;
//}
//while //soundfilePlays[6]= true;
//backFore= prompt ("Enter F for foreground and B for Background:");
//if (backFore != f || backFore != F || backFore != b || backFore != B)	{
//alert("Please enter a valid letter");
//} else if (backFore == f || backFore == F) {
//soundfilePlays[6]= false;
//guesses = guesses + 1;
//}
//var stats = "You got " + guesses/3 + "correct answers".
//while //soundfilePlays[7]= true;
//backFore= prompt ("Enter F for foreground and B for Background:");
//if (backFore != f || backFore != F || backFore != b || backFore != B)	{
//alert("Please enter a valid letter");
//} else if (backFore == b || backFore == B) {
//soundfilePlays[7]=false;
//guesses = guesses + 1;
//}
//var stats = "You got " + guesses/3 + "correct answers".
//alert(stats)

//second way of doing audio //var audioElement = document.createElement('audio');
//audioElement.setAttribute('src', 'yo.mp3');
//audioElement.play();

//first way
//var soundFile = document.getElementById("myAudio");

//function playsoundFile() {
//soundFile.play();
//}

//function pausesoundFile() {
// soundFile.pause();
//}


var surveyVar = {	title: 'Survey',
					name: 'survey',
					pages: [
						{
							name: 'survey',
							title: 'Survey',
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
									],
									required: true
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
							],
						}
					]};


(function($){

var view = {
	displayMessage: function (msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},
};
view.displayMessage("Type in Y if you hear the call getting louder or N if you do not.");

var audioPlayer, timer, playedTime = 0;

/************************************************************/


// audiojs.events.ready(function() {
// 	audioPlayer = audiojs.createAll();
// });

var vPlaylist = [
	'sounds/dynamics1.mp3',
	'sounds/dynamics2.mp3',
	'sounds/dynamics3.mp3',
], messageList = [
	'Instruction of First Song  Instruction of First Song',
	'Instruction of Second Song  Instruction of Second Song',
	'Instruction of Third Song  Instruction of Third Song'
],
vPlaylistIndex = 0;

var answerList=[
	"Y",
	"N"
	];

var guessNumber = 0, guessRight=0, guessState, inPlaying =0;

var sorted = [];
for (var i = 0; i < answerList.length; i++) {
	sorted.push(answerList[i].toLowerCase());
}
sorted.sort();			//  to Lowercase and sorted

var $survey = $('#survey');

$("#guessForm").on('submit', function(e){		// on Submit event of Guess Form
	var guess;

	e.preventDefault();
	guessNumber++;
	guess = $(this).find("#guessInput").val().toLowerCase();
	if($.inArray(guess, sorted) > -1){
		guessRight++;
		console.log(guess);

		var apObject = document.getElementById("mainAudio");
		// $("#audioContainer").pause();
		if(guess == "y" || guess == "n") {

			apObject.pause();
			
			vPlaylistIndex ++;
			if(vPlaylistIndex == vPlaylist.length){
				vPlaylistIndex = 0;
			}

			$("#mainAudio").attr("src", vPlaylist[vPlaylistIndex]);

			view.displayMessage(messageList[vPlaylistIndex]);
			
			$('#countup').hide();

			$survey.remove();

			playedTime = 0;
			updateDuo(0, 1, 0);

			inPlaying = 0;
			setTimeout(function(){
				apObject.play();
				inPlaying = 1;
				countup();
				$('#countup').show();

				$('#board').append('<div id="survey"></div>');

				$survey = $('#survey');

				$survey.survey({
					survey: surveyVar
				});

			},1000);

		}

		// alert(guessRight+"/"+guessNumber);

	}

	$(this).find("#guessInput").val("");

});



$('#preliminary-survey input.submitSurvey').on('click', function(e){
e.preventDefault();
$('#preliminary-survey').hide();
});

$('#tryGuess').on('click', function(){
	
	var apObject = document.getElementById("mainAudio");
			inPlaying = 1;
			$("#mainAudio").attr("src", vPlaylist[vPlaylistIndex]);
			view.displayMessage(messageList[vPlaylistIndex]);

			setTimeout(function(){
				apObject.play();
				playedTime = 0;
				countup();
				$('#countup').show();

				$survey.survey({
					survey: surveyVar
				});
			},1000);
	
	$(this).hide();

});


var positions = $('.countupHolder').find('.position');


function countup(){
	console.log(playedTime);
	updateDuo(0, 1, playedTime);
	playedTime++;
	if(inPlaying)
		setTimeout(countup, 1000);
	else{

		return;
	}
};
		
		// This function updates two digit positions at once
		function updateDuo(minor,major,value){
			switchDigit(positions.eq(minor),Math.floor(value/10)%10);
			switchDigit(positions.eq(major),value%10);
		};
		


function switchDigit(position,number){
		
		var digit = position.find('.digit')
		
		if(digit.is(':animated')){
			return false;
		}
		
		if(position.data('digit') == number){
			// We are already showing this number
			return false;
		}
		
		position.data('digit', number);
		
		var replacement = $('<span>',{
			'class':'digit',
			css:{
				top:'-2.1em',
				opacity:0
			},
			html:number
		});
		
		// The .static class is added when the animation
		// completes. This makes it run smoother.
		
		digit
			.before(replacement)
			.removeClass('static')
			.animate({top:'2.5em',opacity:0},'fast',function(){
				digit.remove();
			})

		replacement
			.delay(100)
			.animate({top:0,opacity:1},'fast',function(){
				replacement.addClass('static');
			});
	}



$("#volume").slider({
    min: 0,
    max: 100,
    value: 50,
	range: "min",
	animate: true,
    slide: function(event, ui) {
    	console.log(ui.value);
      setVolume((ui.value) / 100);
    }
  });

function setVolume(myVolume) {
    var myMedia = document.getElementById('mainAudio');
    myMedia.volume = myVolume;
}




			

			

})(jQuery);





		// Notice the *1000 at the end - time must be in milliseconds

/*
var Mp3Queue = function(container, files) {
        var index = 1;
        if(!container || !container.tagName || container.tagName !== 'AUDIO') throw 'Invalid container';
        if(!files || !files.length)throw 'Invalid files array';        
        
        var playNext = function() {
            if(index < files.length) {
                container.src = files[index];
                index += 1;
            } else {
                container.removeEventListener('ended', playNext, false);
            }
        };
        
        container.addEventListener('ended', playNext);
        
        container.src = files[0];
    };
    
    var container = document.getElementById('container');
    
    
    new Mp3Queue(container, [
        'sounds/ML Chukar 10.mp3',
        'sounds/ML Chukar 11.mp3',
        'http://incompetech.com/music/royalty-free/mp3-royaltyfree/Happy%20Boy%20Theme.mp3'
    ]);
*/

 //Important for adding flashing arrow graphic:	  
//displayArrow: function(location) {
//var putArrow = document.getElementById(location);
//putArrow.setAttribute("class", "arrow");
//},
//};