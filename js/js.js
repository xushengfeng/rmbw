var store = JSON.parse(window.localStorage.rmbw || "{}");
function save() {
    window.localStorage.rmbw = JSON.stringify(store);
    fetch(url, {
        method: "POST",
        body: JSON.stringify(store),
    }).then((res) => res.json());
}
window.onbeforeunload = () => {
    save();
};
setInterval(save, 5 * 60 * 1000);

var url = "http://" + (store["sql"] || "0.0.0.0") + ":8888";

fetch(url, {
    method: "GET",
})
    .then((res) => {
        return res.json();
    })
    .then((res) => {
        store = res;
    });

// 界面渲染和初始化
window.addEventListener("load", () => {
    changeDropdown();
    showWordList();
    if (window.location.href.substring(window.location.href.length - 3) == "?px") {
        change(1);
        showSpell();
    } else {
        change(0);
        showList();
    }
    mode = 0;
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("sw.js");
    }
});

function changeDropdown() {
    dropdownC = "";
    for (i in map) {
        dropdownC += "<option>" + i + "</option>";
    }
    document.getElementById("dropdown").innerHTML = dropdownC;

    if (store["drop"]) document.getElementById("dropdown").value = store["drop"];
}

var mode = 0;
document.getElementById("mode_b").onclick = () => {
    if (mode == 0) {
        mode = 1;
        document.getElementById("mode_b").innerHTML = "拼写";
    } else {
        mode = 0;
        document.getElementById("mode_b").innerHTML = "背词";
    }
    change(mode);
};

var dropdownValue;

function change(n) {
    store["drop"] = dropdownValue = document.getElementById("dropdown").value;
    if (n == 0) {
        document.documentElement.style.setProperty("--not-spell", "1fr 0");
    } else {
        document.documentElement.style.setProperty("--not-spell", "0 1fr");
    }
    showWordList();
}

// 左边控件和单词表
function showWordList() {
    document.getElementById("control").innerHTML =
        checkboxClass("list", "列表模式") +
        checkboxClass("playC", "发音") +
        checkboxClass("playtC", "翻译发音") +
        checkboxClass("autoC", "自动播放") +
        checkboxClass("wordStyle", "样式") +
        checkboxClass("R", "random") +
        checkboxClass("bingC", "bing") +
        checkboxClass("wordC", "word") +
        checkboxClass("phoneticC", "phonetic") +
        checkboxClass("translationC", "translation") +
        `<input type="number" min="1" id="spellN" value="${store.spellN || 3}">
        <input type=text placeholder="数据库地址" id="sql" value="${store.sql || "0.0.0.0"}">
        <input type=text placeholder="词典key" id="dic_key" value="${store.dic_key || ""}">`;

    // 选项切换
    document.querySelector("#bingC").onclick = () => {};

    // document.querySelector(':root').setAttribute('style', '--display-word:block');
    document.getElementById("list").checked = store["list"];
    document.getElementById("bingC").checked = store["bingC"];
    document.getElementById("wordC").checked = store["wordC"];
    document.getElementById("phoneticC").checked = store["phoneticC"];
    document.getElementById("translationC").checked = store["translationC"];
    document.getElementById("playC").checked = store["playC"];
    document.getElementById("playtC").checked = store["playtC"];
    document.getElementById("autoC").checked = store["autoC"];
    document.getElementById("wordStyle").checked = store["wordStyle"];
    document.getElementById("spellN").value = store["spellN"];
    document.getElementById("R").checked = store["R"];
    check();
    // 选项存储
    document.getElementById("control").onclick = () => {
        store["list"] = document.getElementById("list").checked;
        store["bingC"] = document.getElementById("bingC").checked;
        store["wordC"] = document.getElementById("wordC").checked;
        store["phoneticC"] = document.getElementById("phoneticC").checked;
        store["translationC"] = document.getElementById("translationC").checked;
        store["playC"] = document.getElementById("playC").checked;
        store["playtC"] = document.getElementById("playtC").checked;
        store["autoC"] = document.getElementById("autoC").checked;
        store["wordStyle"] = document.getElementById("wordStyle").checked;
        store["R"] = document.getElementById("R").checked;
        check();
    };

    document.getElementById("spellN").oninput = () => {
        store["spellN"] = document.getElementById("spellN").value;
    };
    document.getElementById("sql").oninput = () => {
        store["sql"] = document.getElementById("sql").value;
        url = "http://" + (store["sql"] || "0.0.0.0") + ":8080";
    };
    document.getElementById("dic_key").oninput = () => {
        store["dic_key"] = document.getElementById("dic_key").value;
    };

    function check() {
        big_list(document.getElementById("list").checked);

        if (document.querySelector("#wordC").checked) {
            document.documentElement.style.setProperty("--display-word", "visible");
        } else {
            document.documentElement.style.setProperty("--display-word", "hidden");
        }
        if (document.querySelector("#phoneticC").checked) {
            document.documentElement.style.setProperty("--display-phonetic", "visible");
        } else {
            document.documentElement.style.setProperty("--display-phonetic", "hidden");
        }
        if (document.querySelector("#translationC").checked) {
            document.documentElement.style.setProperty("--display-translation", "visible");
        } else {
            document.documentElement.style.setProperty("--display-translation", "hidden");
        }
        if (document.querySelector("#wordStyle").checked) {
            document.documentElement.style.setProperty("--display-aeiouy", "underline");
        } else {
            document.documentElement.style.setProperty("--display-aeiouy", "none");
        }
    }
}

function listS(v) {
    if (v == 0) {
        document.getElementById("List").style.transform = "translateX(-102%)";
    } else {
        document.getElementById("List").style.transform = "translateX(0)";
    }
}

function checkboxClass(id, name) {
    return (
        '<div class="mdc-form-field"><div class="mdc-checkbox"><input type="checkbox" class="mdc-checkbox__native-control" id="' +
        id +
        '" /><div class="mdc-checkbox__background"><svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24"><path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" /></svg><div class="mdc-checkbox__mixedmark"></div></div><div class="mdc-checkbox__ripple"></div></div><label for="' +
        id +
        '">' +
        name +
        "</label></div>"
    );
}

// 背书模式
function showList() {
    mode = 0;
    // document.getElementById('main').innerHTML = '<div id="wordDetail"><div id="word"></div><div id="phonetic"></div><div id="translation"></div><iframe id="bing" title="bing词典"></iframe></div>'

    var c = "";
    for (i = 1; i <= Math.ceil(map[dropdownValue].length / 50); i++) {
        c += `<li>${i}</li>`;
    }
    document.querySelector("#nav2").innerHTML = c;
    for (i = 0; i <= Math.ceil(map[dropdownValue].length / 50) - 1; i++) {
        ((i) => {
            document.querySelectorAll("#nav2>li")[i].onclick = () => {
                slow_load(i, 50);
            };
        })(i);
    }
    if (store[dropdownValue] != undefined) {
        var page = store[dropdownValue].page || 0;
    } else {
        var page = 0;
    }
    slow_load(page, 50);
}

word_num = 0;
word_value = store.word_value || {};
var page_w_l = [];

function slow_load(num, step) {
    if (num * step > map[dropdownValue].length) {
        return;
    }
    var c = "";
    page_w_l = [];
    word_value = store.word_value || {};
    for (i = num * step; i < (num + 1) * step && i < map[dropdownValue].length; i++) {
        id = map[dropdownValue][i];
        c += `<div><word-card word="${dic[id][0]}" phonetic="${dic[id][1]}" translation="${dic[id][2]}" value="${
            word_value[dic[id][0]]
        }" n="${i}"></word-card></div>`;
        page_w_l.push(id);
    }
    if (mode == 0) document.querySelector("#main").innerHTML = c;
    [].forEach.call(document.querySelectorAll("#nav2>li"), function (v) {
        v.className = "";
    });
    document.querySelectorAll("#nav2>li")[num].className = "nav2-li-h";

    var l = { page: num, page_step: step, w_n: word_num };
    store[dropdownValue] = l;

    save();
}

// 判断滚动到某个单词
var io = new IntersectionObserver(
    (entries) => {
        if (entries[0].isIntersecting) {
            console.log(entries[0].target.getAttribute("word"));
            // 自动播放
            if (store.autoC && !store["list"]) {
                play(entries[0].target.getAttribute("word"));
            }
        }
    },
    {
        threshold: 1,
    }
);

function word_value_write(word, n) {
    if (!store.word_value) store.word_value = {};
    store.word_value[word] = n;
}

function big_list(v) {
    if (v) {
        document.getElementById("main").style.scrollSnapType = "none";
        document.documentElement.style.setProperty("--main-div-height", "auto");
    } else {
        document.getElementById("main").style.scrollSnapType = "";
        document.documentElement.style.setProperty("--main-div-height", "100%");
    }
}

// 存储
var wptList, word, phonetic, translation, id;
n = 0;

function next(num) {
    n = document.getElementById("R").checked == true ? Math.floor(Math.random() * (page_w_l.length + 1)) : num; // n随机与否
    n = n < 0 ? 0 : n; // n must>=0
    store[dropdownValue].w_n = n;

    wptList = {
        bingC: document.getElementById("bingC").checked,
        wordC: document.getElementById("wordC").checked,
        phoneticC: document.getElementById("phoneticC").checked,
        translationC: document.getElementById("translationC").checked,
        playC: document.getElementById("playC").checked,
    };

    id = page_w_l[n];
    word = dic[id][0];
    phonetic = dic[id][1];
    translation = dic[id][2];

    // 界面归位
    // document.getElementById("translation").innerHTML = "";
    // document.getElementById("phonetic").innerHTML = "";
    // document.getElementById("word").innerHTML = "";

    // 根据选项展示
    // if (mode == 0) {
    //     if (wptList["wordC"]) {
    //         document.getElementById("word").innerHTML =
    //             document.getElementById("wordStyle").checked == true ? aeiouy(word) : word;
    //     }
    //     if (wptList["phoneticC"]) {
    //         document.getElementById("phonetic").innerHTML = phonetic;
    //     }
    //     if (wptList["translationC"]) {
    //         document.getElementById("translation").innerHTML = to(translation);
    //     }
    //     if (document.getElementById("bingC").checked && wptList[0] && wptList[1] && wptList[2]) {
    //         document.getElementById("bing").src = "https://cn.bing.com/dict/search?q=" + dic[id][0];
    //     } else {
    //         document.getElementById("bing").src = "";
    //     }
    // } else {
    //     document.getElementById("translation").innerHTML = to(translation);
    //     document.getElementById("spellWord").value = "";
    //     document.getElementById("spellWord").placeholder = "";
    // }

    if (document.getElementById("playC").checked) {
        play(word);
    }

    document.getElementById("main").scrollTop =
        document.querySelector(`word-card[word="${word}"]`).offsetTop - document.getElementById("main").offsetTop;
}

// var spellNum = document.getElementById("spellN").value - 0;
// 展示答案
function answer(el, w, p, t) {
    el.querySelector("#word").innerHTML = w;
    el.querySelector("#phonetic").innerHTML = p;
    el.querySelector("#translation").innerHTML = t;
    play(w);
}

function play(word) {
    audio = document.getElementById("audio");
    if (document.getElementById("playtC").checked == true) {
        audio.src = "https://dict.youdao.com/dictvoice?le=eng&type=1&audio=" + word;
        audio.play();
        // audio.onended = function () {
        //     audio.src = "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=7&text=" + translation;
        //     audio.play();
        //     audio.onended = function () {};
        // };
    } else {
        audio.src = "https://dict.youdao.com/dictvoice?le=eng&type=1&audio=" + word;
        audio.play();
    }
}

// 释义编排
function to(word) {
    word = word.replace(/【/g, "[").replace(/】/g, "]").replace(/（/g, "(").replace(/）/g, ")").replace(/，/g, ",");
    word = word.replace(/\s([a-z]+\.)/g, "</br>$&");
    word = word.replace(/；\s*<\/br>/g, "</br>");
    word = word.replace(/；/g, " | ");
    word = word.replace(/[a-z]+\./g, '<span class="cx">$&</span>');
    return word;
}
// 标记
function aeiouy(word) {
    // word = word.replace(/ /g,'<span class="space"></span>')
    word1 = word.replace(
        /(ai)|(air)|(al)|(ar)|(are)|(au)|(aw)|(ay)|(ea)|(ee)|(er)|(ear)|(eer)|(er)|(ere)|(ey)|(ie)|(ir)|(oa)|(oi)|(oo)|(oor)|(or)|(oor)|(our)|(ou)|(oy)|(ow)|(ur)/g,
        "<>$&</>"
    );
    word1 = word1.replace(
        /(se)|(ch)|(th)|(sh)|(wh)|(tch)|(ds)|(ts)|(dr)|(tr)|(ing)|(cial)|(sion)|(tion)/g,
        "< >$&</ >"
    );
    word1 = word1.replace(/<>/g, '<span class="yuan">');
    word1 = word1.replace(/<\/>/g, "</span>");
    word1 = word1.replace(/< >/g, '<span class="fu">');
    word1 = word1.replace(/<\/ >/g, "</span>");
    word2 = word.replace(/([aeiou])|(?<=[^aeiou])y/g, '<span class="aeiouy">$&</span>');
    // word = word.replace(/([aeiou])[^aeiou](e)/g, '<span class="aeiou_e">$&</span>')

    return [word1, word2];
}

async function more(word) {
    if (!word.includes(".")) {
        store.more = store.more || {};
        if (store.more[word]) {
            return store.more[word];
        } else {
            store.dic_key = document.getElementById("dic_key").value;
            var res = await fetch(
                `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${store.dic_key}`,
                {
                    method: "GET",
                }
            );

            res = await res.json();
            delete res.def;
            store.more[word] = res;
            return res;
        }
    }
}

function syllable(word, el) {
    if (!word.includes(" ") && !word.includes(".")) {
        store.syllable_l = store.syllable_l || {};
        if (store.syllable_l[word]) {
            if (el) {
                el.querySelector("#word").innerHTML = w(store.syllable_l[word]);
            } else {
                return w(store.syllable_l[word]);
            }
            console.log("n");
        } else {
            fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${store.dic_key}`, {
                method: "GET",
            })
                .then((res) => {
                    return res.json();
                })
                .then((res) => {
                    console.log(res);
                    store.syllable_l[word] = res[0].hwi.hw;
                    if (el) {
                        el.querySelector("#word").innerHTML = w(res[0].hwi.hw);
                    } else {
                        return w(res[0].hwi.hw);
                    }
                });
        }
        function w(worddd) {
            worddd = worddd.split("*");
            for (i in worddd) worddd[i] = `<span class="syllable">${worddd[i]}</span>`;
            worddd = worddd.join('<span class="syllable_s"></span>');
            return worddd;
        }
    }
}

document.getElementById("spacing").oninput = () => {
    document.documentElement.style.setProperty("--spacing", `${document.getElementById("spacing").value}em`);
};

// 键盘
document.onkeyup = function (e) {
    var event = e || window.event;
    event.preventDefault();
    var key = event.which || event.keyCode || event.charCode;
    if (mode == 0) {
        // 列表模式下生效
        if (key == 37 || key == 38) {
            next(Number(n) - 1);
        }
        if (key == 39 || key == 40) {
            next(Number(n) + 1);
        }
        // if (key == 37 || key == 38 || key == 39 || key == 40) {
        // next(n)
        // }
        if (key == 13) {
            answer();
        }
    }
};
