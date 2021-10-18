class word_card extends HTMLElement {
    constructor() {
        super();

        // var shadow = this.attachShadow({ mode: "closed" });

        var templateElem = document.querySelector("#word_card");
        var content = templateElem.content.cloneNode(true);
        content.querySelector("#word").innerText = this.getAttribute("word");
        content.querySelector("#phonetic").innerText = this.getAttribute("phonetic");
        content.querySelector("#translation").innerText = this.getAttribute("translation");

        this.appendChild(content);

        var show = false;
        this.querySelector("#word-main").onclick = () => {
            if (!show) {
                show = true;
                this.querySelector("#word").style.fontSize = "8rem";
                this.querySelector("#phonetic").style.fontSize = "2rem";
                this.querySelector("#translation").style.fontSize = "2rem";
                this.querySelector("#word").style.visibility = "visible";
                this.querySelector("#phonetic").style.visibility = "visible";
                this.querySelector("#translation").style.visibility = "visible";

                document.documentElement.scrollTop = this.offsetTop - 100;
            } else {
                show = false;
                this.querySelector("#word").style.fontSize = "20px";
                this.querySelector("#phonetic").style.fontSize = "1rem";
                this.querySelector("#translation").style.fontSize = "1rem";
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
            var w = JSON.parse(window.localStorage.word_value || "{}");
            w[this.getAttribute("word")] = this.querySelector("#n").value;
            window.localStorage.word_value = JSON.stringify(w);
        };
    }
}

window.customElements.define("word-card", word_card);
