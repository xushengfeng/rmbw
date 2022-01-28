class word_card extends HTMLElement {
    constructor() {
        super();

        // var shadow = this.attachShadow({ mode: "closed" });

        var templateElem = document.querySelector("#word_card");
        var content = templateElem.content.cloneNode(true);
        var [word, phonetic, translation] = [
            this.getAttribute("word"),
            this.getAttribute("phonetic"),
            this.getAttribute("translation"),
        ];
        content.querySelector("#word").innerHTML = aeiouy(this.getAttribute("word"))[1];
        content.querySelector("#phonetic").innerHTML = this.getAttribute("phonetic");
        content.querySelector("#translation").innerHTML =
            to(this.getAttribute("translation")) +
            `<a href="https://www.dictionary.com/browse/${this.getAttribute(
                "word"
            )}" target="_blank" class="other_dic">dic</a> ` +
            `<a href="https://www.thesaurus.com//browse/${this.getAttribute(
                "word"
            )}" target="_blank" class="other_dic">dic</a>`;

        this.appendChild(content);

        io.observe(this.parentElement);

        var show = false;
        this.querySelector("#word-main").onclick = () => {
            // 只在列表模式下生效
            if (store["list"]) {
                show = !show;
                if (show) {
                    this.s();
                } else {
                    this.s_h();
                }
            }
        };

        var value = this.getAttribute("value") == "undefined" ? 0 : this.getAttribute("value");
        this.querySelector("#n").style.backgroundSize = (value / this.querySelector("#n").max) * 100 + "%";
        this.querySelector("#n").oninput = () => {
            this.querySelector("#n").style.backgroundSize =
                (this.querySelector("#n").value / this.querySelector("#n").max) * 100 + "%";
            word_value_write(this.getAttribute("word"), this.querySelector("#n").value);
        };

        var spell = false;
        this.querySelector("#spell_b").onclick = () => {
            spell = !spell;
            if (mode) {
                if (spell) {
                    this.spell_s();
                } else {
                    this.spell_s_h();
                }
            }
        };
        var spellNum = document.getElementById("spellN").value - 0;
        this.querySelector("#spellWord").oninput = () => {
            var el = this.querySelector("#word_spell");
            var inputWord = el.querySelector("#spellWord").value;
            el.querySelector("#word").innerHTML = "";
            el.querySelector("#phonetic").innerHTML = "";
            switch (inputWord) {
                case "~": // 暂时展示
                    syllable(word, el);
                    el.querySelector("#word").style = "font-size: var(--word-s)";
                    el.querySelector("#phonetic").innerHTML = phonetic;
                    el.querySelector("#spellWord").value = "";
                    play(word);
                    break;
                case "!": // 发音
                    play(word);
                    el.querySelector("#spellWord").value = "";
                    break;
                case word: // 正确
                    if (spellNum == 1) {
                        inputWord = el.querySelector("#spellWord").value = "";
                        el.querySelector("#spellWord").placeholder = "ok";
                        if (!mode) {
                            console.log(this.getAttribute("n"));
                            next(this.getAttribute("n") - 0 + 1);
                        }
                    } else {
                        spellNum--;
                        el.querySelector("#spellWord").value = "";
                        el.querySelector("#spellWord").placeholder = `Good! ${spellNum} time(s) left`;
                    }
                    break;
            }
            //错误归位
            if (inputWord.length == word.length && inputWord != word) {
                syllable(word, el);
                el.querySelector("#word").style = "font-size: var(--word-s)";
                el.querySelector("#phonetic").innerHTML = phonetic;
                spellNum = document.getElementById("spellN").value;
                el.querySelector("#spellWord").value = "";
                el.querySelector("#spellWord").placeholder = `Wrong! ${spellNum} time(s) left`;
                play(word);
            }
        };
    }

    // 卡片
    s() {
        this.querySelector("#word").style.fontSize = "var(--word-s)";
        this.querySelector("#phonetic").style.fontSize = "var(--phonetic-s)";
        this.querySelector("#translation").style.fontSize = "var(--translation-s)";
        this.querySelector("#word").style.visibility = "visible";
        this.querySelector("#phonetic").style.visibility = "visible";
        this.querySelector("#translation").style.visibility = "visible";

        this.parentElement.scrollTop = this.offsetTop - 100;

        syllable(this.getAttribute("word"), this.querySelector("#word-main"));
        // play(this.getAttribute("word"));
    }

    // 列表
    s_h() {
        this.querySelector("#word").style.fontSize = "var(--word-s-h)";
        this.querySelectorAll(".syllable").forEach((e) => {
            if (e.style) {
                e.style.boxShadow = "0 0";
            }
        });
        this.querySelectorAll(".syllable_s").forEach((e) => {
            if (e.style) {
                e.style.width = "0";
            }
        });
        this.querySelector("#phonetic").style.fontSize = "var(--phonetic-s-h)";
        this.querySelector("#translation").style.fontSize = "var(--translation-s-h)";
        this.querySelector("#word").style.visibility = "";
        this.querySelector("#phonetic").style.visibility = "";
        this.querySelector("#translation").style.visibility = "";
    }

    spell_s() {
        this.style.gridTemplateColumns = "0 1fr";
        this.querySelector("#word-main").style.height = "0";
        this.querySelector("#word_spell").querySelector("#translation").innerHTML = this.getAttribute("translation");
    }

    spell_s_h() {
        this.style.gridTemplateColumns = "var(--not-spell)";
        this.querySelector("#word-main").style.height = "var(--main-height)";
        this.querySelector("#word_spell").querySelector("#translation").innerHTML = "";
    }

    // 根据show属性切换
    set show(v) {
        this.setAttribute("show", v);
        can_record_p = false;
        if (v) {
            this.s();
        } else {
            this.s_h();
        }
        setTimeout(() => {
            can_record_p = true;
        }, 1000);
    }

    set spell(v) {
        this.setAttribute("spell", v);
        can_record_p = false;
        if (v) {
            this.spell_s();
        } else {
            this.spell_s_h();
        }
        can_record_p = true;
    }
}

window.customElements.define("word-card", word_card);
