// 界面渲染
function changeDropdown() {
    dropdownC = ''
    for (i in map) {
        dropdownC += '<option>' + i + '</option>'
    }
    document.getElementById('dropdown').innerHTML = dropdownC

    document.getElementById('dropdown').value=window.localStorage["drop"]
}

var  dropdownValue

function change(n) {
    dropdownValue = document.getElementById('dropdown').value
    switch (n) {
        case 0:
            modle = 0
            showList()
            break;
        case 1:
            modle = 1
            showSpell()
            break;
    }
    window.localStorage["drop"]=document.getElementById('dropdown').value
}
function checkboxClass(id,name){
    return '<div class="mdc-form-field"><div class="mdc-checkbox"><input type="checkbox" class="mdc-checkbox__native-control" id="'+id+'" /><div class="mdc-checkbox__background"><svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24"><path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" /></svg><div class="mdc-checkbox__mixedmark"></div></div><div class="mdc-checkbox__ripple"></div></div><label for="'+id+'">'+name+'</label></div>'
}
function showList() {
    var c = ''
    for (i in map[dropdownValue]) {
        var id = map[dropdownValue][i]
        c += '<div class="listItem" id="' + i + '" onclick="next(' + i + ')">' + dic[id][0] + '</div>'
    }
    
    document.getElementById('List').innerHTML = '<a onclick="listS(0)"><li class="nav-item">list</li></a>'+checkboxClass('R','random')+checkboxClass('bingC','bing')+checkboxClass('wordC','word')+checkboxClass('phoneticC','phonetic')+checkboxClass('translationC','translation')+'<div id="leftList">' + c + '</div>'
    document.getElementById('main').innerHTML = '<div id="wordDetail"><div id="word"></div><div id="phonetic"></div><div id="translation"></div><iframe id="bing"></iframe></div>'
    c=''

    document.getElementById("bingC").checked = window.localStorage["bingC"]=='true'?true:false
    document.getElementById("wordC").checked = window.localStorage["wordC"]=='true'?true:false
    document.getElementById("phoneticC").checked = window.localStorage["phoneticC"]=='true'?true:false
    document.getElementById("translationC").checked = window.localStorage["translationC"]=='true'?true:false
    if(window.localStorage[dropdownValue] != undefined){
        next(window.localStorage[dropdownValue])
    }else{
        next(0)
    }
    
}

function showSpell() {
    dropdownValue = document.getElementById('dropdown').value
    document.getElementById('List').innerHTML = '<ul style="padding: 0;"><a onclick="listS(0)"><li class="nav-item">list</li></a></ul><select id="spellN"><option>1</option><option>2</option><option>3</option><option>4</option></select>'

    document.getElementById('main').innerHTML = '<input id="spellWord" type="text" oninput="trueOrFalse()" autofocue="autofocue"><div id="Sword"></div><div id="Sphonetic"></div><div id="Stranslation"></div>'
    ScreateWord()

    document.getElementById('spellN').value = window.localStorage['spellN']
}

function listS(n) {
    if (n == 0) {
        document.getElementById('List').style.left = '-40%'
    } else {
        document.getElementById('List').style.left = '0'
    }
}

var wptList, word, phonetic, translation
n = 0

function next(num) {
    n = document.getElementById('R').checked == true ? Math.floor(Math.random() * (map[dropdownValue].length + 1)) : num
    n = n < 0 ? 0 : n
    wptList = {"bingC":document.getElementById('bingC').checked, "wordC":document.getElementById('wordC').checked, "phoneticC":document.getElementById('phoneticC').checked, "translationC": document.getElementById('translationC').checked}
    id = map[dropdownValue][n]
    word = dic[id][0]
    phonetic = dic[id][1]
    translation = dic[id][2]
    document.getElementById('translation').innerHTML = ''
    document.getElementById('phonetic').innerHTML = ''
    document.getElementById("word").innerHTML = ''
    if (document.getElementById('playC').checked) {
        play(word)
    }
    if (wptList['wordC']) {
        document.getElementById('word').innerHTML = document.getElementById('wordStyle').checked==true?aeiouy(word):word
    }
    if (wptList["phoneticC"]) {
        document.getElementById('phonetic').innerHTML = phonetic
    }
    if (wptList["translationC"]) {
        document.getElementById('translation').innerHTML = to(translation)
    }
    if (document.getElementById('bingC').checked && wptList[0] && wptList[1] && wptList[2]) {
        document.getElementById('bing').src = "https://cn.bing.com/dict/search?q=" + dic[id][0]
    } else {
        document.getElementById('bing').src = ''
    }

    location.href = '#' + n
    window.localStorage[dropdownValue]=n
    window.localStorage["bingC"]=document.getElementById('bingC').checked
    window.localStorage["wordC"]=document.getElementById('wordC').checked
    window.localStorage["phoneticC"]=document.getElementById('phoneticC').checked
    window.localStorage["translationC"]=document.getElementById('translationC').checked
}

function answer() {
    if (document.getElementById('bingC').checked) {
        document.getElementById('bing').src = "https://cn.bing.com/dict/search?q=" + dic[id][0]
    }
    if (!wptList['wordC']) {
        document.getElementById('word').innerHTML = document.getElementById('wordStyle').checked==true?aeiouy(word):word
    }
    if (!wptList["phoneticC"]) {
        document.getElementById('phonetic').innerHTML = phonetic
    }
    if (!wptList["translationC"]) {
        document.getElementById('translation').innerHTML = to(translation)
    }
    play(word)
}

function play(word) {
    audio = document.getElementById('audio')
    // audio.src = 'http://tts.baidu.com/text2audio?lan=en&ie=UTF-8&spd=4&text=' + word
    audio.src = 'https://dict.youdao.com/dictvoice?le=eng&type=1&audio=' + word
    audio.play()
}

// 释义编排
function to(word) {
    word = word.replace(/【/g, '[').replace(/】/g, ']').replace(/（/g, '(').replace(/）/g, ')').replace(/，/g, ',')
    word = word.replace(/\s([a-z]+\.)/g, '</br>$&')
    word = word.replace(/；\s*<\/br>/g, '</br>')
    word = word.replace(/；/g, ' | ')
    word = word.replace(/[a-z]+\./g, '<span class="cx">$&</span>')
    return word
}
// 标记
function aeiouy(word) {
    // word = word.replace(/ /g,'<span class="space"></span>')
    word = word.replace(/(ai)|(air)|(al)|(ar)|(are)|(au)|(aw)|(ay)|(ea)|(ee)|(er)|(ear)|(eer)|(er)|(ere)|(ey)|(ie)|(ir)|(oa)|(oi)|(oo)|(oor)|(or)|(oor)|(our)|(ou)|(oy)|(ow)|(ur)/g, '<>$&</>')
    word = word.replace(/(se)|(ch)|(th)|(sh)|(wh)|(tch)|(ds)|(ts)|(dr)|(tr)|(ing)|(cial)|(sion)|(tion)/g, '< >$&</ >')
    word = word.replace(/([aeiou])|(?<=[^aeiou])y/g, '<span class="aeiouy">$&</span>')
    word = word.replace(/<>/g, '<span class="yuan">')
    word = word.replace(/<\/>/g, '</span>')
    word = word.replace(/< >/g, '<span class="fu">')
    word = word.replace(/<\/ >/g, '</span>')
    // word = word.replace(/([aeiou])[^aeiou](e)/g, '<span class="aeiou_e">$&</span>')

    return word
}

// 键盘
document.onkeyup = function (e) {
    var event = e || window.event;
    event.preventDefault();
    var key = event.which || event.keyCode || event.charCode;
    if (modle == 0) {
        if (key == 37 || key == 38) {
            next(n - 1)
        }
        if (key == 39 || key == 40) {
            next(n + 1)
        }
        if (key == 37 || key == 38 || key == 39 || key == 40) {
            next(n)
        }
        if (key == 13) {
            answer()
        }
    }
}

// 拼写
function ScreateWord() {
    spellNum = document.getElementById('spellN').value
    window.localStorage["spellN"]=spellNum
    var n = Math.floor(Math.random() * (map[dropdownValue].length + 1))
    var id = map[dropdownValue][n]
    word = dic[id][0]
    phonetic = dic[id][1]
    translation = dic[id][2]
    document.getElementById('Stranslation').innerHTML = to(translation)
    document.getElementById("spellWord").value = ''
    document.getElementById("spellWord").placeholder = ""
    document.getElementById("Sword").innerHTML = ''
    document.getElementById('Sphonetic').innerHTML = ''
    if (document.getElementById('playC').checked) {
        play(word)
    }

}
// 判断
function trueOrFalse() {
    inputWord = document.getElementById('spellWord').value
    document.getElementById("Sword").innerHTML = ''
    document.getElementById('Sphonetic').innerHTML = ''
    switch (inputWord) {
        case '~':
            document.getElementById('Sword').innerHTML = document.getElementById('wordStyle').checked==true?aeiouy(word):word
            document.getElementById('Sphonetic').innerHTML = phonetic
            document.getElementById("spellWord").value = ''
            play(word)
            break;
        case '!':
            play(word)
            document.getElementById("spellWord").value = ''
            break;
        case word:
            if (spellNum == 1) {
                ScreateWord()
            } else {
                spellNum--
                document.getElementById("spellWord").value = ''
                document.getElementById("spellWord").placeholder = "Good"
            }
    }
    if (inputWord.length == word.length && inputWord != word) {
        document.getElementById("spellWord").value = ''
        document.getElementById("spellWord").placeholder = "Wrong"
        spellNum = document.getElementById('spellN').value
    }
}
