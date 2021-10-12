class word_card extends HTMLElement {
    constructor() {
        super();
        var templateElem = document.querySelector("#word_card");
        var content = templateElem.content.cloneNode(true);
        content.querySelector("#word").innerText = this.getAttribute("word");
        content.querySelector("#phonetic").innerText = this.getAttribute("phonetic");
        content.querySelector("#translation").innerText = this.getAttribute("translation");

        this.appendChild(content);
    }

    connectedCallback() {
        // var shadow = this.attachShadow({ mode: "open" });
        // shadow.appendChild(选项);
    }
}

window.customElements.define("word-card", word_card);
