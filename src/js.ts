var map = <object>map,
    dic = <object>dic;

var store = JSON.parse(window.localStorage.rmbw || "{}");
function save() {
    window.localStorage.rmbw = JSON.stringify(store);
    var tmp_store = store;
    delete tmp_store.sql;
    fetch(url, {
        method: "POST",
        body: JSON.stringify(tmp_store),
    }).then((res) => {
        res.json();
        tmp_store = null;
    });
}
window.onbeforeunload = () => {
    save();
};
setInterval(save, 5 * 60 * 1000);

/**上传数据库 */
var upload_el = <HTMLInputElement>document.getElementById("upload_store");

var fileHandle: FileSystemFileHandle;

if (window.showOpenFilePicker) {
    document.getElementById("upfile").onclick = file_load;
} else {
    document.getElementById("upfile").onclick = () => {
        upload_el.click();
    };
    upload_el.onchange = file_load;
}

async function file_load() {
    let file: File;
    if (window.showOpenFilePicker) {
        [fileHandle] = await window.showOpenFilePicker({
            types: [
                {
                    description: "JSON",
                    accept: {
                        "text/*": [".json"],
                    },
                },
            ],
            excludeAcceptAllOption: true,
        });
        if (fileHandle.kind != "file") return;
        file = await fileHandle.getFile();
    } else {
        file = upload_el.files[0];
    }

    let reader = new FileReader();
    reader.onload = () => {
        store = JSON.parse(<string>reader.result);
        setTimeout(() => {
            url = "http://" + (store["sql"] || "0.0.0.0") + ":8888";
            load();
            chart();
            rander_chart();
        }, 500);
    };
    reader.readAsText(file);
}

/**下载数据库 */
async function write_file(text: string) {
    if (fileHandle && (await fileHandle.requestPermission({ mode: "readwrite" })) === "granted") {
        const writable = await fileHandle.createWritable();
        await writable.write(text);
        await writable.close();
    } else {
        let a = document.createElement("a");
        let blob = new Blob([text]);
        a.download = `rmbw_data.json`;
        a.href = URL.createObjectURL(blob);
        a.click();
        URL.revokeObjectURL(String(blob));
    }
}

function download_store() {
    let t = JSON.stringify(store);
    write_file(t);
}

document.getElementById("download_store").onclick = download_store;

var url = "http://" + (store["sql"] || "0.0.0.0") + ":8888";

// 界面渲染和初始化
window.addEventListener("load", load);

function load() {
    fetch(url, {
        method: "GET",
    })
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            delete res.sql;
            // 合并数据，res覆盖相同键的值
            Object.assign(store, res);
        });

    tags_list();
    changeDropdown();
    showWordList();
    if (window.location.href.substring(window.location.href.length - 3) == "?px") {
        change(false);
    } else {
        change(true);
        change_b_list();
    }
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("sw.js");
    }
}

var dropdownValue;
function changeDropdown() {
    let dropdownC = "";
    for (let i in map) {
        dropdownC += "<option>" + i + "</option>";
    }
    document.getElementById("dropdown").innerHTML = dropdownC;

    if (store["drop"]) (<HTMLSelectElement>document.getElementById("dropdown")).value = dropdownValue = store["drop"];
}

// 词书切换按钮
document.getElementById("dropdown").addEventListener("change", () => {
    change_b_list();
});

// 模式切换按钮
var mode = false;
document.getElementById("mode_b").onclick = () => {
    mode = !mode;
    change(mode);
};

function change(n) {
    mode = n;
    var l = document.querySelectorAll("word-card");
    if (n) {
        document.getElementById("mode_b").innerHTML = "背词";
        for (let i in l) {
            l[i].spell = false;
        }
    } else {
        document.getElementById("mode_b").innerHTML = "拼写";
        for (let i in l) {
            l[i].spell = true;
        }
    }
    showWordList();
}

// 左边控件和单词表
function showWordList() {
    document.getElementById("spellN").value = store.spellN || 3;
    document.getElementById("sql").value = store.sql || "0.0.0.0";
    document.getElementById("dic_key").value = store.dic_key || "";

    // 选项切换
    document.getElementById("bingC").onclick = () => {};

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
    document.getElementById("r_in_0").checked = store["r_in_0"];
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
        store["r_in_0"] = document.getElementById("r_in_0").checked;
        check();
    };

    document.getElementById("spellN").oninput = () => {
        store["spellN"] = document.getElementById("spellN").value;
    };
    document.getElementById("sql").oninput = () => {
        store["sql"] = document.getElementById("sql").value;
        url = "http://" + (store["sql"] || "0.0.0.0") + ":8080";
    };
    document.getElementById("sql").onchange = load;
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
        document.getElementById("List").style.transform = "translateX(-110%)";
    } else {
        document.getElementById("List").style.transform = "translateX(0)";
    }
}
document.getElementById("list_show").addEventListener("click", () => {
    listS(1);
});

document.getElementById("List").onblur = document.getElementById("list_disappear").onclick = () => {
    listS(0);
};

/**
 * 更改词书，生成底部页数栏
 */
function change_b_list() {
    store["drop"] = dropdownValue = document.getElementById("dropdown").value;
    var c = "";
    for (let i = 1; i <= Math.ceil(map[dropdownValue].length / 50); i++) {
        c += `<li>${i}</li>`;
    }
    document.querySelector("#nav2").innerHTML = c;
    for (let i = 0; i <= Math.ceil(map[dropdownValue].length / 50) - 1; i++) {
        ((i) => {
            document.querySelectorAll("#nav2>li")[i].onclick = () => {
                slow_load(i, 50);
            };
        })(i);
    }
    if (store[dropdownValue]) {
        var page = <number>store[dropdownValue].page || 0;
    } else {
        store[dropdownValue] = { page: 0, page_step: 50, w_n: 0 };
        var page = 0;
    }
    slow_load(page, 50);
    can_record_p = false;
    next(store[dropdownValue].w_n);
    can_record_p = true;

    // 渲染完成

    book_words_l = map[dropdownValue].map((v) => dic[v][0]);
    sum();

    big_list(document.getElementById("list").checked);
}
var book_words_l = [];

var word_num = 0;
var word_value = store.word_value || {};
var page_w_l = [];

/**
 * 加载页
 * @param {number} num 页数
 * @param {number} step 一页列表数
 * @returns none
 */
function slow_load(num: number, step: number) {
    if (num * step > map[dropdownValue].length) {
        return;
    }
    var c = "";
    page_w_l = [];
    word_value = store.word_value || {};
    for (let i = num * step; i < (num + 1) * step && i < map[dropdownValue].length; i++) {
        id = map[dropdownValue][i];
        let w = dic[id][0];
        c += `<div><word-card word="${dic[id][0]}" phonetic="${dic[id][1]}" translation="${dic[id][2]}" value="${
            word_value[w]?.k?.v || 0
        },${word_value[w]?.s?.v || 0},${word_value[w]?.v?.v || 0}" n="${i}" tabindex=${i}></word-card></div>`;
        page_w_l.push(id);
    }
    can_record_p = false;
    document.querySelector("#main").innerHTML = c;
    document.getElementById("main").scrollTop = 0;
    can_record_p = true;
    [].forEach.call(document.querySelectorAll("#nav2>li"), function (v) {
        v.className = "";
    });
    document.querySelectorAll("#nav2>li")[num].className = "nav2-li-h";

    store[dropdownValue].page_step = step;
    store[dropdownValue].page = num;

    save();

    big_list(document.getElementById("list").checked);
}

function log_book_words() {
    var c = "";
    for (let i = 0; i < map[dropdownValue].length; i++) {
        let id = map[dropdownValue][i];
        c += `${dic[id][0]}\n`;
    }
    console.log(c);
}

var can_record_p = false;
// 判断滚动到某个单词
var io = new IntersectionObserver(
    (entries) => {
        if (entries[0].isIntersecting) {
            var card_el = entries[0].target.querySelector("word-card");
            // 记录位置
            if (can_record_p) {
                console.log(card_el.getAttribute("word"));
                word_num = Number(card_el.getAttribute("n")) % store[dropdownValue].page_step;
                store[dropdownValue].w_n = word_num;
            }
            // 自动播放
            if (store.autoC && !store["list"]) {
                play(card_el.getAttribute("word"));
            }

            if (!store["list"]) {
                syllable(card_el.getAttribute("word"), card_el.querySelector("#word-main"));
                word_more(card_el.getAttribute("word"));
            }
        }
    },
    {
        threshold: 0.75,
    }
);

async function word_more(word) {
    var more_r = await more(word);
    var more_stems = more_r[0].meta?.stems || [];
    more_stems = `<span>${more_stems.join("</span><span>")}</span>`;
    var et = more_r[0].et || more_r[1].et || "";
    if (et) {
        var more_et = et[0][1];
        var et_o = {
            "{b}": "<strong>",
            "{/b}": "</strong>",
            "{inf}": "<sub>",
            "{/inf}": "</sub>",
            "{it}": "<i>",
            "{/it}": "</i>",
            "{sc}": "<small>",
            "{/sc}": "</small>",
            "{sup}": "<sup>",
            "{/sup}": "</sup>",
            "{ldquo}": "&ldquo;",
            "{rdquo}": "&rdquo;",
            "{bc}": "<strong>: </strong>",
        };
        for (let i in et_o) {
            more_et = more_et.replace(RegExp(i, "g"), et_o[i]);
        }
        more_et = more_et.replace(/{.*}/g, "");
    } else {
        more_et = "";
    }
    var more_short_def = more_r[0].shortdef;
    if (more_short_def && more_short_def.length == 0) more_short_def = more_r[1].shortdef;
    more_short_def = more_short_def ? `<li>${more_short_def.join("</li><li>")}</li>` : "";
    document.querySelector(
        `word-card[word="${word}"] #more`
    ).innerHTML = `<div id="stems">${more_stems}</div><div id="def">${more_short_def}</div><div id="et">${more_et}</div>`;
}

/**
 * 记录单词记忆状态
 * @param word 单词
 * @param key 键
 * @param v 值
 */
function word_value_write(word: string, key: "k" | "s" | "v", v: number) {
    if (!store.word_value) store.word_value = {};
    if (!store.word_value[word])
        store.word_value[word] = { k: { v: 0, t: [] }, s: { v: 0, t: [] }, v: { v: 0, t: [] } };
    if (!store.word_value[word]?.[key]) store.word_value[word][key] = { v: 0, t: [] };
    let o_v = store.word_value[word][key].v;
    store.word_value[word][key].v = v;
    if (v != o_v) store.word_value[word][key].t.push(new Date().getTime());
    sum();
    if (window.showOpenFilePicker && fileHandle) {
        download_store();
    }
}

/**
 * 列表/卡片模式
 * @param {boolean} v t:列表模式, f:卡片模式
 */
function big_list(v: boolean) {
    var l = document.querySelectorAll("word-card");
    if (v) {
        document.getElementById("main").style.scrollSnapType = "none";
        document.documentElement.style.setProperty("--main-div-height", "auto");
        for (let i in l) {
            l[i].show = false;
        }
    } else {
        document.getElementById("main").style.scrollSnapType = "";
        document.documentElement.style.setProperty("--main-div-height", "100%");
        for (let i in l) {
            l[i].show = true;
        }
    }
}

// 存储
var wptList, word, phonetic, translation, id;
var n = 0;

function next(num) {
    // n随机与否
    if (document.getElementById("R").checked) {
        if (document.getElementById("r_in_0").checked) {
            let el_l = document.querySelectorAll("word-card[value='0']");
            let i = Math.floor(Math.random() * el_l.length);
            n = Number(el_l[i].n) % 50;
        } else {
            n = Math.floor(Math.random() * (page_w_l.length + 1));
        }
    } else {
        n = num;
    }
    n = n < 0 ? 0 : n; // n must>=0

    id = page_w_l[n];
    word = dic[id][0];
    phonetic = dic[id][1];
    translation = dic[id][2];

    if (document.getElementById("playC").checked) {
        play(word);
    }

    var el: HTMLElement = document.querySelector(`word-card[word="${word}"]`);

    document.getElementById("main").scrollTop = el.offsetTop - document.getElementById("main").offsetTop;

    el.style.outline = "1px dashed";
    setTimeout(() => {
        el.style.outline = "";
    }, 300);

    if (!mode) {
        (<HTMLElement>document.querySelector(`word-card[word="${word}"] #spellWord`)).focus();
    }
}

// var spellNum = document.getElementById("spellN").value - 0;
// 展示答案
function answer(el, w, p, t) {
    el.querySelector("#word").innerHTML = w;
    el.querySelector("#phonetic").innerHTML = p;
    el.querySelector("#translation").innerHTML = t;
    play(w);
}

function play(word: string) {
    let audio = <HTMLAudioElement>document.getElementById("audio");
    audio.src = "https://dict.youdao.com/dictvoice?le=eng&type=1&audio=" + word;
    audio.play();
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

async function more(word) {
    if (!word.includes(".")) {
        store.more = store.more || {};
        if (store.more[word]) {
            return store.more[word];
        } else {
            store.dic_key = (<HTMLInputElement>document.getElementById("dic_key")).value;
            if (store.dic_key != "") {
                var res = await fetch(
                    `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${store.dic_key}`,
                    {
                        method: "GET",
                    }
                );

                res = await res.json();
                for (let i in res) {
                    delete res[i].def;
                }
                store.more[word] = res;
                return res;
            }
        }
    }
}

async function syllable(word, el) {
    if (can_record_p) {
        var syllable_r = await more(word);
        if (syllable_r && syllable_r[0].hwi) {
            var syllable_t = syllable_r[0].hwi.hw;
            var n = 0;
            while (syllable_t.replace(/\*/g, "") != word) {
                syllable_t = syllable_r[0].uros[n].ure;
                n += 1;
            }
            if (el) {
                el.querySelector("#word").innerHTML = w(syllable_t);
            } else {
                return w(syllable_t);
            }
            function w(worddd) {
                worddd = worddd.split("*");
                for (let i in worddd) worddd[i] = `<span class="syllable">${worddd[i]}</span>`;
                worddd = worddd.join('<span class="syllable_s"></span>');
                return worddd;
            }
        } else {
            el.querySelector("#word").innerHTML = word;
        }
    }
}

document.getElementById("spacing").oninput = () => {
    document.documentElement.style.setProperty(
        "--spacing",
        `${(<HTMLInputElement>document.getElementById("spacing")).value}em`
    );
};

function sum() {
    var w_n = 0;
    var all_n = 0;
    Object.keys(store.word_value).map((v) => {
        if (book_words_l.includes(v)) {
            if (store.word_value[v]?.k?.v) w_n++;
            all_n += store.word_value[v]?.k?.v || 0;
        }
    });
    document.getElementById("sum").innerText = `${w_n}/${map[dropdownValue].length} ${all_n}/${
        map[dropdownValue].length * 3
    }`;

    rander_chart();
}

document.onkeyup = (e) => {
    if (e.key == "Enter" && store.list && (<HTMLInputElement>document.getElementById("R")).checked) {
        next(1);
    }
};

function chart() {
    var z_date = new Date(2022, 0, 1);
    var 开始数 = (z_date.getDay() + 1) * 24 * 60 * 60 * 1000;
    var s_date = new Date(z_date.getTime() - 开始数);
    var t = "";
    for (let x = 1; x <= 53; x++) {
        t += "<div>";
        for (let y = 1; y <= 7; y++) {
            s_date = new Date(s_date.getTime() + 24 * 60 * 60 * 1000);
            let x = `${s_date.getFullYear()}-${s_date.getMonth() + 1}-${s_date.getDate()}`;
            t += `<div title="${s_date.toDateString()}" id="d${x}"></div>`;
        }
        t += "</div>";
    }
    document.getElementById("chart").innerHTML = t;
}
chart();

/**
 * 设定日历格子
 * @param {string} date 日期
 * @param {number} value 值
 */
function set_chart(date: string, value: number) {
    document.getElementById(`d${date}`).style.background = `rgba(0, 255, 0, ${value / max_v})`;
    var t = document.getElementById(`d${date}`).title.replace(/.+,/, "");
    document.getElementById(`d${date}`).title = value + "," + t;
}

var max_v = 0;
function rander_chart() {
    var time_line = [];
    var date_value = {};
    for (let i in store.word_value) {
        time_line.push(store.word_value[i]?.k?.t || []);
        time_line.push(store.word_value[i]?.s?.t || []);
        time_line.push(store.word_value[i]?.v?.t || []);
    }
    time_line = time_line.flat();

    for (let i of time_line) {
        var time = new Date(i);
        var key = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`;
        if (date_value[key]) {
            date_value[key]++;
        } else {
            date_value[key] = 1;
        }
        if (date_value[key] > max_v) max_v = date_value[key];
    }

    for (let i in date_value) {
        set_chart(i, date_value[i]);
    }
}
rander_chart();

function tags_list() {
    if (!store?.tags) store.tags = {};
    let datalist = document.createElement("datalist");
    for (let i in store.tags) {
        let o = document.createElement("option");
        o.value = i;
        datalist.append(o);
    }
    datalist.id = "tags_list";
    document.body.append(datalist);
}

document.onkeydown = (e) => {
    if (e.ctrlKey && e.key == "s") {
        e.preventDefault();
        if (window.showOpenFilePicker && fileHandle) {
            download_store();
        }
    }
};
