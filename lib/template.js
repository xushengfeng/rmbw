class word_card extends HTMLElement {
    constructor() {
        super();

        // var shadow = this.attachShadow({ mode: "closed" });

        var templateElem = document.querySelector("#word_card");
        var content = templateElem.content.cloneNode(true);
        content.querySelector("#word").innerHTML = aeiouy(this.getAttribute("word"))[1];
        content.querySelector("#phonetic").innerHTML = this.getAttribute("phonetic");
        content.querySelector("#translation").innerHTML =
            to(this.getAttribute("translation")) +
            `<a href="https://www.dictionary.com/browse/${this.getAttribute("word")}" target="_blank" class="other_dic">dic</a>`;

        this.appendChild(content);

        var show = false;
        this.querySelector("#word-main").onclick = () => {
            if (!show) {
                show = true;
                this.querySelector("#word").style.fontSize = "var(--word-s)";
                this.querySelector("#phonetic").style.fontSize = "var(--phonetic-s)";
                this.querySelector("#translation").style.fontSize = "var(--translation-s)";
                this.querySelector("#word").style.visibility = "visible";
                this.querySelector("#phonetic").style.visibility = "visible";
                this.querySelector("#translation").style.visibility = "visible";

                this.parentElement.scrollTop = this.offsetTop - 100;

                syllable(this.getAttribute("word"), this);
                play(this.getAttribute("word"));
            } else {
                show = false;
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
        };

        var value = this.getAttribute("value") == "undefined" ? 0 : this.getAttribute("value");
        this.querySelector("#n").style.backgroundSize = (value / this.querySelector("#n").max) * 100 + "%";
        this.querySelector("#n").oninput = () => {
            this.querySelector("#n").style.backgroundSize =
                (this.querySelector("#n").value / this.querySelector("#n").max) * 100 + "%";
            word_value_write(this.getAttribute("word"), this.querySelector("#n").value);
        };
    }
}

window.customElements.define("word-card", word_card);
