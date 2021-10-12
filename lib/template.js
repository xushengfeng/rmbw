class word_card extends HTMLElement {
    constructor() {
        super();

        var shadow = this.attachShadow({ mode: "open" });

        var templateElem = document.querySelector("#word_card");
        var content = templateElem.content.cloneNode(true);
        content.querySelector("#word").innerText = this.getAttribute("word");
        content.querySelector("#phonetic").innerText = this.getAttribute("phonetic");
        content.querySelector("#translation").innerText = this.getAttribute("translation");

        shadow.appendChild(content);

        this.shadowRoot.querySelector('#n0').onclick=()=>{
            [].forEach.call(this.shadowRoot.querySelectorAll('#n>div'), function(v) {
                v.style.background=""
              });
            this.shadowRoot.querySelector('#n0').style.background="#000"
        }

        this.shadowRoot.querySelector('#n1').onclick=()=>{
            [].forEach.call(this.shadowRoot.querySelectorAll('#n>div'), function(v) {
                v.style.background=""
              });
            this.shadowRoot.querySelector('#n0').style.background="#000"
            this.shadowRoot.querySelector('#n1').style.background="#000"
        }

        this.shadowRoot.querySelector('#n2').onclick=()=>{
            [].forEach.call(this.shadowRoot.querySelectorAll('#n>div'), function(v) {
                v.style.background=""
              });
            this.shadowRoot.querySelector('#n0').style.background="#000"
            this.shadowRoot.querySelector('#n1').style.background="#000"
            this.shadowRoot.querySelector('#n2').style.background="#000"
        }

        this.shadowRoot.querySelector('#n3').onclick=()=>{
            [].forEach.call(this.shadowRoot.querySelectorAll('#n>div'), function(v) {
                v.style.background=""
              });
            this.shadowRoot.querySelector('#n0').style.background="#000"
            this.shadowRoot.querySelector('#n1').style.background="#000"
            this.shadowRoot.querySelector('#n2').style.background="#000"
            this.shadowRoot.querySelector('#n3').style.background="#000"
        }


        var show = false;
        this.shadowRoot.querySelector('#word-main').onclick = () => {
            if(!show){
                show=true
                this.shadowRoot.querySelector("#word").style.fontSize='80px'
            }else{
                show=false
                this.shadowRoot.querySelector("#word").style.fontSize='20px'
            }
        };
    }
}

window.customElements.define("word-card", word_card);
