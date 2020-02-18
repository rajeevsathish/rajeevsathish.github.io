$(function () {

    var lives           = 10;
    var testWord        = '';
    var questionSet     = {};
    var matchedWord     = [];
    var selectedLang    = 'en';
    var totalQuestions  = 3;
    var currentQuestion = 0;
    
    var showLives = document.getElementById('mylives');
    // Animate man
    animate = function () {
        var drawMe = lives;
        drawArray[drawMe]();

    };
    freezAll = function () {
        var r = confirm("You have lost to restart the game click ok");
        if (r == true) {
            lives = 10
        } else {

        }
    }
    // Hangman
    canvas = function () {
        myStickman = document.getElementById("stickman");
        context = myStickman.getContext("2d");
        context.beginPath();
        context.strokeStyle = "#fff";
        context.lineWidth = 2;
    };

    head = function () {
        myStickman = document.getElementById("stickman");
        context = myStickman.getContext("2d");
        context.beginPath();
        context.arc(60, 25, 10, 0, Math.PI * 2, true);
        context.stroke();
    };

    draw = function ($pathFromx, $pathFromy, $pathTox, $pathToy, isTrue = false) {
        context.moveTo($pathFromx, $pathFromy);
        context.lineTo($pathTox, $pathToy);
        context.stroke();
        if (isTrue) {
            freezAll();
        };
    };

    frame1 = function () {
        draw(0, 150, 150, 150);
    };

    frame2 = function () {
        draw(10, 0, 10, 600);
    };

    frame3 = function () {
        draw(0, 5, 70, 5);
    };

    frame4 = function () {
        draw(60, 5, 60, 15);
    };

    torso = function () {
        draw(60, 36, 60, 70);
    };

    rightArm = function () {
        draw(60, 46, 100, 50);
    };

    leftArm = function () {
        draw(60, 46, 20, 50);
    };

    rightLeg = function () {
        draw(60, 70, 100, 100, true);
    };

    leftLeg = function () {
        draw(60, 70, 20, 100);
    };

    drawArray = [
        rightLeg,
        leftLeg,
        rightArm,
        leftArm,
        torso,
        head,
        frame4,
        frame3,
        frame2,
        frame1
    ];
    comments = function () {
        showLives.innerHTML = "You have " + lives + " lives";
        if (lives < 1) {
            showLives.innerHTML = "Game Over";
        }
        // for (var i = 0; i < geusses.length; i++) {
        // 	if (counter + space === geusses.length) {
        // 		showLives.innerHTML = "You Win!";
        // 	}
        // }
    };
    canvas();
    comments();
    charMatched = function (index, charMatch) {
        index.forEach(occurrence => {
            var el = '#guess_' + occurrence;
            $(el).text(charMatch);
            matchedWord.push(charMatch);
        });
        if (currentQuestion < (totalQuestions - 1) && splitText.length === matchedWord.length) {    
            $('#myModal').modal({
                show: 'true'
            }); 
        } else if (currentQuestion === (totalQuestions - 1) && splitText.length === matchedWord.length){
            $('.modal-body').find('p').text('You won !')
            $('#myModal').modal({
                show: 'true'
            }); 
            $('.modal-footer').hide();
        }
    }
    goToNextQuestion = () => {
        if (currentQuestion < (totalQuestions - 1) && splitText.length === matchedWord.length) {
            currentQuestion += 1;
            $('#myModal').modal({
                show: 'false'
            }); 
            getQuestionSet(currentQuestion, selectedLang)
        } else {
           
        }
    }
    
    //var GraphemeSplitter = require('grapheme-splitter')
    var splitText = [];
    splitHindi = function (word) {
        var splitter = new GraphemeSplitter();
        var t = splitter.splitGraphemes(word)
        console.log('----->', t); // TODO: log!
        createDash(t);
        splitText = t;
    }
    splitKannada = function (k) {
        var parts = k.split('');
        arr = [];
        for (var i = 0; i < parts.length; i++) {
            var s = k.charAt(i);
            while ((i + 1) < k.length && k.charCodeAt(i + 1) < 0xC85 || k.charCodeAt(i + 1) > 0xCB9 || k.charCodeAt(i) == 0xCCD) {
                s += k.charAt(i + 1);
                i++;
            }
            arr.push(s);
        }
        console.log('----->', arr);
        splitText = arr;
        createDash(arr);
    }
    createDash = (array) => {
        var ul = document.getElementById('my-word');
        ul.innerHTML = '';
        for (var i = 0; i < array.length; i++) {
            var li = document.createElement('li');
            li.setAttribute('id', 'guess_' + i)
            li.appendChild(document.createTextNode('_'));
            ul.appendChild(li);
        }
    }
    loadJSON = (lang, cb) => {
        let key = lang + '_data';
        let data = null;
        switch (key) {
            case 'en_data':
                data = en_data
                break;
            case 'kn_data':
                data = kn_data
                break;
            case 'hi_data':
                data = hi_data
                break;
            default:
                break;
        }
        var result = [];
        for (var i = 0; i < totalQuestions; i++) {
            result.push(data[Math.floor(Math.random() * data.length)]);
        }
        cb(null, result);
    }
    getQuestionSet = (index, lang) => {
        // Get questions from API
        loadJSON(lang, (err, response) => {
            for (let i = 0; i < response.length; i++) {
                questionSet[i] = {};
                questionSet[i]['word']              = response[i]['word'];
                questionSet[i]['questionText']      = response[i]['questionText'];
                questionSet[i]['questionNumber']    = response[i]['questionNumber'];
            }
            matchedWord = [];
            document.getElementById('question').innerHTML = questionSet[index]['questionText'];
            testWord = questionSet[index]['word'];
            switch (lang) {
                case 'hi':
                    splitHindi(testWord);
                    break;
                case 'kn':
                    splitKannada(testWord);
                    break
                default:
                    splitText = testWord.split('');
                    createDash(splitText)
                    break;
            }
        });
    };
    getAllIndexes = (arr, val) => {
        var indexes = [], i = -1;
        while ((i = arr.indexOf(val, i + 1)) != -1) {
            indexes.push(i);
        }
        return indexes;
    }
    isLetterMatch = (input) => {
        var index = getAllIndexes(splitText, input)
        if (index.length > 0) {
            console.log('char Index', index);
            console.log('call the fill in method');
            charMatched(index, input);

        } else {
            lives -= 1
            comments();
            if (lives < 0) {
            } else {
                animate();
                console.log('call the hangman function --->');
                console.log('UPDATE global variable for displaying the number of lives left...');
            }
        }
    }

    var t,
        o = '',
        layouts = [];

    // Change display language, if the definitions are available
    showKb = function (layout) {
        var kb = $('#multi').getkeyboard();
        kb.options.layout = layout;
        kb.options.noFocus = true;
        kb.redraw();
    };

    $.each(jQuery.keyboard.layouts, function (i, l) {
        if (l.name) {
            layouts.push([i, l.name]);
        }
    });
    // sort select options by language name, not
    layouts.sort(function (a, b) {
        return a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : 0;
    });
    $.each(layouts, function (i, l) {
        o += '<option value="' + l[0] + '">' + l[1] + '</option>';
    });

    $('#multi').keyboard({
        layout: 'qwerty',
        stayOpen: true,
    })
        // activate the typing extension
        .addTyping({
            showTyping: true,
            delay: 200
        })
        .previewKeyset();
    $('#lang')
        .html(o)
        .change(function () {
            var kb = $('#multi'),
                $this = $(this),
                $opt = $this.find('option:selected'),
                layout = $this.val();
            //$('h2').text($opt.text());
            showKb(layout);
            selectedLang = layout;
            //getQuestion from API
            getQuestionSet(currentQuestion, layout);
        }).trigger('change');
    $('#multi').focusout((e) => {
        var kb = $('#multi').getkeyboard();
        //kb.toggle();
        let userInput = $('#multi').val();
        if (userInput) {
            isLetterMatch(userInput);
        }
        $('#multi_keyboard').find("input").val('');
        showKb(selectedLang);
        $('#multi').val('');
    });
    showHint = () => {
        // document.getElementById('hint').innerHTML = questionSet[currentQuestion]['hint'];
        var i = splitText[Math.floor(Math.random() * splitText.length)];
        isLetterMatch(i);
    }
});