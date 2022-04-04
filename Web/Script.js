var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const AINPUT = document.querySelector("#aValue"), BINPUT = document.querySelector("#bValue"), CINPUT = document.querySelector("#cValue"), FORM = document.querySelector("#input-form");
function calculate() {
    return __awaiter(this, void 0, void 0, function* () {
        const A = parseInt(AINPUT.value), B = parseInt(BINPUT.value), C = parseInt(CINPUT.value), ROOTSDIV = document.querySelector("#roots span"), ROOTSRESULTDIV = document.querySelector("#result-roots span"), VERTEX = document.querySelector("#coordinates span"), RESULTCOORDINATES = document.querySelector("#result-coordinates span"), FORMDIV = document.querySelector("#function-form span"), GRAPHICDIV = document.querySelector("#graphic");
        GRAPHICDIV.innerHTML = null;
        try {
            if (isNaN(A) || isNaN(B) || isNaN(C)) {
                throw 'In a quadratic function "a", "b" and "c" must be numbers!';
            }
            else if (A === 0) {
                throw 'In a quadratic function "a" must be a number NOT equal 0!';
            }
            const { X1, X2, XVERTEX, YVERTEX, FORM, REALROOTS, GRAPHIC, } = yield (yield fetch(`http://127.0.0.1:5000/?a=${A}&b=${B}&c=${C}`)).json(), GRAPHICSVG = document.createElement("svg");
            let roots;
            switch (REALROOTS) {
                case 2:
                    roots = `x\u2081 = ${X1}<br>x\u2082 =  ${X2}`;
                    break;
                case 1:
                    roots = `x = ${X1}`;
                    break;
                default:
                    roots = "This quadratic function don't have any real zero.";
            }
            FORMDIV.textContent = FORM.replace(/[*][*]2/, "\u00b2").replace(/[*]/g, "");
            ROOTSDIV.textContent = "Roots (when y = 0):";
            ROOTSRESULTDIV.innerHTML = roots
                .replace(/[*]*sqrt/g, "\u221a")
                .replace(/approx/g, "\u2248");
            VERTEX.textContent = "Vertex:";
            RESULTCOORDINATES.textContent = `(${XVERTEX}, ${YVERTEX})`;
            GRAPHICSVG.innerHTML = GRAPHIC;
            GRAPHICDIV.appendChild(GRAPHICSVG);
        }
        catch (err) {
            FORMDIV.textContent = "y = ax\u00b2 + bx + c";
            ROOTSDIV.textContent = null;
            ROOTSRESULTDIV.textContent = null;
            VERTEX.textContent = null;
            RESULTCOORDINATES.textContent = err;
        }
        location.href = "#result";
    });
}
const defaultValue = function (value) {
    if (this.value === "") {
        this.value = value;
    }
}, whenKeyDown = function (nextEl, e) {
    if (e.keyCode === 13) {
        this.onblur();
        if (nextEl instanceof HTMLFormElement) {
            nextEl.submit();
        }
        else if (nextEl instanceof HTMLInputElement) {
            nextEl.focus();
            nextEl.value = "";
            e.preventDefault();
        }
    }
};
FORM.onsubmit = function (e) {
    calculate();
    if (e) {
        e.preventDefault();
    }
};
AINPUT.onblur = defaultValue.bind(AINPUT, "1");
BINPUT.onblur = defaultValue.bind(BINPUT, "0");
CINPUT.onblur = defaultValue.bind(CINPUT, "0");
AINPUT.onkeydown = (e) => whenKeyDown.apply(AINPUT, [BINPUT, e]);
BINPUT.onkeydown = (e) => whenKeyDown.apply(BINPUT, [CINPUT, e]);
CINPUT.onkeydown = (e) => whenKeyDown.apply(CINPUT, [FORM, e]);
