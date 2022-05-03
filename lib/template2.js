// 按钮
class lock_b extends HTMLElement {
    static get observedAttributes() {
        return ["checked"];
    }

    constructor() {
        super();
    }

    connectedCallback() {
        var box = document.createElement("input");
        box.type = "checkbox";
        box.oninput = () => {
            this._chvalue(box.checked);
        };
        this.appendChild(box);
        this.setAttribute("checked", box.checked);
    }

    get checked() {
        return this.querySelector("input").checked;
    }
    set checked(v) {
        this.querySelector("input").checked = v;
        this._chvalue(v);
    }

    _chvalue(value = undefined) {
        if (value) {
            this.style.backgroundColor = "var(--hover-color)";
        } else {
            this.style.backgroundColor = "";
        }
    }
}

window.customElements.define("lock-b", lock_b);
