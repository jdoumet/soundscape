var User = require('./model.js');

exports.save = function(req, res) {
    var params = req.body;

    var newUser = User(params);

// save the user
    newUser.save(function(err) {
        if (err){
            res.send({"response": err.message, "error": err.errors});
        }else{
            res.send({"response": "success", "id": newUser.id});
        }
    });

};

exports.update = function(req, res) {

    // res.send({"response": 'ok'});
    var params = req.body, id = params.id;
    delete params.id;

    User.findByIdAndUpdate(id, {$set: params}, {new: true}, function(err){
        res.send({"response": err});
    });

};


exports.get = function(req, res) {
    User.findOne({_id: req.params.id}, function(error, user) {
        res.send(user);
    })
};

// first locates a thread by title, then locates the replies by thread ID.
exports.list = (function(req, res) {

    User.find(function(err, users) {
        res.send(users);
    });
});

exports.statistics = (function(req, res) {

    User.find({}, function(err, users) {
        //console.log(users);
        res.render("statistics", { userList: users });
    });

});

exports.charts = (function(req, res) {

    User.find({}, function(err, users) {
        var numberForEachBirds = [['ageRangeName', 'Bird1', 'Bird2','Bird3','Bird4','Bird5','Bird6','Bird7','Bird8']],
            surveyForEachBirds = [['ageRangeName', 'Sad', 'Nervous','No Answer','Relaxed','Happy']],
            AgeGroupKeys = ['less than 7', '7 to 10', '12 to 14', '14 to 16', '16 and up'],
            arrayForGuess1 = {'less than 7':[], '7 to 10':[], '12 to 14':[], '14 to 16':[], '16 and up':[]},
            surveyArrayForEachBirds = {'less than 7':[0,0,0,0,0], '7 to 10':[0,0,0,0,0], '12 to 14':[0,0,0,0,0], '14 to 16':[0,0,0,0,0], '16 and up':[0,0,0,0,0]}
            ,ageGroupForGuess1=[],instrumentExpWithTryNumbers={'No':[],'2':[],'3':[],'4':[],'more':[]},
            birdWatchingExpWithTryNumbers={'No':[],'1':[],'2':[],'3':[],'4':[],'more':[]},
            musicTheoryExpWithTryNumbers={'No':[],'1':[],'2':[],'3':[],'4':[],'more':[]},
            surveyForGuess1=[['Sad',0],['Nervous',0],['No Answer',0],['Relaxed', 0],['Happy',0]];

        var numberForEachBirdsTemp = users.map(function(c, i){
            var ageRangeName = AgeGroupKeys[c.age];
            return [ageRangeName, c.answer1.length, c.answer2.length, c.answer3.length, c.answer4.length, c.answer5.length, c.answer6.length, c.answer7.length, c.answer8.length];
        });

        AgeGroupKeys.forEach(function(c){
            var average = averageArray(numberForEachBirdsTemp.filter(function(v){ return v[0] == c}));
            if(average != null)
                numberForEachBirds.push(average);
        });

        users.forEach(function(c){
            if(!((0<c.age) && (c.age<5))){
                c.age = 0;
            }

            arrayForGuess1[AgeGroupKeys[c.age]].push(c.answer0.length);
            switch(c.survey0){
                case 'a':
                    surveyForGuess1[0][1]++;
                    surveyArrayForEachBirds[AgeGroupKeys[c.age]][0]++;
                    break;
                case 'b':
                    surveyForGuess1[1][1]++;
                    surveyArrayForEachBirds[AgeGroupKeys[c.age]][1]++;
                    break;
                case 'c':
                    surveyForGuess1[2][1]++;
                    surveyArrayForEachBirds[AgeGroupKeys[c.age]][2]++;
                    break;
                case 'd':
                    surveyForGuess1[3][1]++;
                    surveyArrayForEachBirds[AgeGroupKeys[c.age]][3]++;
                    break;
                case 'e':
                    surveyForGuess1[4][1]++;
                    surveyArrayForEachBirds[AgeGroupKeys[c.age]][4]++;
                    break;
            }

            if(!!c.question2){
                var question2 = c.question2;
                instrumentExpWithTryNumbers[question2].push([c.answer1.length, c.answer2.length, c.answer3.length, c.answer4.length, c.answer5.length, c.answer6.length, c.answer7.length, c.answer8.length]);
            }else{
                instrumentExpWithTryNumbers['No'].push([c.answer1.length, c.answer2.length, c.answer3.length, c.answer4.length, c.answer5.length, c.answer6.length, c.answer7.length, c.answer8.length]);
            }

            if(!!c.question4){
                var question4 = c.question4;
                musicTheoryExpWithTryNumbers[question4].push([c.answer1.length, c.answer2.length, c.answer3.length, c.answer4.length, c.answer5.length, c.answer6.length, c.answer7.length, c.answer8.length]);
            }else{
                musicTheoryExpWithTryNumbers['No'].push([c.answer1.length, c.answer2.length, c.answer3.length, c.answer4.length, c.answer5.length, c.answer6.length, c.answer7.length, c.answer8.length]);
            }

            if(!!c.question6){
                var question6 = c.question6;
                birdWatchingExpWithTryNumbers[question6].push([c.answer1.length, c.answer2.length, c.answer3.length, c.answer4.length, c.answer5.length, c.answer6.length, c.answer7.length, c.answer8.length]);
            }else{
                birdWatchingExpWithTryNumbers['No'].push([c.answer1.length, c.answer2.length, c.answer3.length, c.answer4.length, c.answer5.length, c.answer6.length, c.answer7.length, c.answer8.length]);
            }
        });

        var instrumentExpWithTryNumbersTmp = [['Years of playing musical Instrument', 'Bird1', 'Bird2','Bird3','Bird4','Bird5','Bird6','Bird7','Bird8']],
        musicTheoryExpWithTryNumbersTmp = [['Years of music theory experience', 'Bird1', 'Bird2','Bird3','Bird4','Bird5','Bird6','Bird7','Bird8']],
        birdWatchingExpWithTryNumbersTmp = [['Years of bird watching experience', 'Bird1', 'Bird2','Bird3','Bird4','Bird5','Bird6','Bird7','Bird8']];
        convertToArrayWith9Attributes(instrumentExpWithTryNumbers).forEach(function(c){
            instrumentExpWithTryNumbersTmp.push(c);
        });
        convertToArrayWith9Attributes(musicTheoryExpWithTryNumbers).forEach(function(c){
            musicTheoryExpWithTryNumbersTmp.push(c);
        });
        convertToArrayWith9Attributes(birdWatchingExpWithTryNumbers).forEach(function(c){
            birdWatchingExpWithTryNumbersTmp.push(c);
        });

        for(var k in surveyArrayForEachBirds){
            surveyForEachBirds.push([k,surveyArrayForEachBirds[k][0],surveyArrayForEachBirds[k][1],surveyArrayForEachBirds[k][2],surveyArrayForEachBirds[k][3]
                ,surveyArrayForEachBirds[k][4]]);
        }
        for(var k in arrayForGuess1){
            var v = arrayForGuess1[k], rv;
            if(v.length == 0){
                rv = 0;
            }else {
                var validNumber = 0;
                rv = parseFloat(v.reduce(function (p, c) {
                        if(c>0)
                            validNumber++;
                        return p + c;
                    }, 0)) / validNumber
            }
            ageGroupForGuess1.push([k, rv]);
        }

        res.render("charts", { userList: users, ageGroupForGuess1: ageGroupForGuess1, surveyForGuess1: surveyForGuess1,
            numberForEachBirds: numberForEachBirds,surveyForEachBirds:surveyForEachBirds,
            instrumentExpWithTryNumbers: instrumentExpWithTryNumbersTmp,
            musicTheoryExpWithTryNumbers: musicTheoryExpWithTryNumbersTmp,
            birdWatchingExpWithTryNumbers: birdWatchingExpWithTryNumbersTmp,
        });
    });

});

function convertToArrayWith9Attributes(obj){
    var returnArray = [],noArray = [];

    obj['No'].forEach(function(c){
        noArray.push(['No',c[0],c[1],c[2],c[3],c[4],c[5],c[6],c[7]]);
    });
    returnArray.push(averageArray(noArray)) ;
    for(var k in obj){
        if(k != 'No') {
            var subArray = [];
            obj[k].forEach(function (c) {
                subArray.push([k,c[0],c[1],c[2],c[3],c[4],c[5],c[6],c[7]]);
            });
            returnArray.push(averageArray(subArray));
        }
    }
    return returnArray;
}

function averageArray(array) {
    if (array.length > 0) {
        var tryArray = [0,0,0,0,0,0,0,0],
            sum = array.reduce(function (pre, cur) {
                for(var i=0; i<=7;i++){
                    if(cur[i+1]>0)
                        tryArray[i]++;
                }
                return [cur[0], pre[1] + cur[1], pre[2] + cur[2], pre[3] + cur[3], pre[4] + cur[4], pre[5] + cur[5], pre[6] + cur[6], pre[7] + cur[7], pre[8] + cur[8]];
            }, ['',0,0,0,0,0,0,0,0]);
        return [sum[0], tryArray[0] ? parseFloat( sum[1]) / tryArray[0] : 0, tryArray[1] ? parseFloat(sum[2]) / tryArray[1] : 0,
            tryArray[2] ? parseFloat(sum[3]) / tryArray[2] : 0, tryArray[3] ? parseFloat(sum[4]) / tryArray[3] : 0,
            tryArray[4] ? parseFloat(sum[5]) / tryArray[4] : 0, tryArray[5] ? parseFloat(sum[6]) / tryArray[5] : 0,
            tryArray[6] ? parseFloat(sum[7]) / tryArray[6] : 0, tryArray[7] ? parseFloat(sum[8]) / tryArray[7] : 0]
    }else{
        return null;
    }
}