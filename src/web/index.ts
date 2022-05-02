interface APIDataSucess {
  readonly roots: string[];
  readonly vertex: string[];
  readonly form: string;
  readonly graph: string;
}

interface APIDataError {
  readonly error: string;
}

type APIData = APIDataSucess | APIDataError;

class QFCalculator {
  readonly roots: string;
  readonly vertex: string;
  readonly form: string;
  readonly graph: HTMLElement;

  private constructor({ roots, vertex, form, graph }: APIDataSucess) {
    roots = roots.map((i) =>
      i.replace("sqrt", "\u221a").replace("approx", "\u2248")
    );
    switch (roots.length) {
      case 2:
        this.roots = `x\u2081 = ${roots[0]}<br>x\u2082 =  ${roots[1]}`;
        break;
      case 1:
        this.roots = `x = ${roots[0]}`;
        break;
      default:
        this.roots = "This quadratic function don't have any real zero.";
    }
    this.vertex = `(${vertex.join(", ")})`;
    this.form = form.replace("**2", "\u00b2").replace(/[*]/g, "");
    this.graph = document.createElement("svg");
    this.graph.innerHTML = graph;
  }

  public static main(): void {
    //Constatns that store elements that will be often read or changed

    const AInput: HTMLInputElement = document.querySelector("#a-input"),
      BInput: HTMLInputElement = document.querySelector("#b-input"),
      CInput: HTMLInputElement = document.querySelector("#c-input"),
      Form: HTMLFormElement = document.querySelector("#input-form"),
      FormDiv: HTMLDivElement = document.querySelector("#function-form"),
      RootsDiv: HTMLDivElement = document.querySelector("#label-roots"),
      ResultRootsDiv: HTMLDivElement = document.querySelector("#roots"),
      CoordinatesDiv: HTMLDivElement = document.querySelector("#label-coordinates"),
      ResultCoordinatesDiv: HTMLDivElement = document.querySelector("#coordinates"),
      GraphDiv: HTMLDivElement = document.querySelector("#graph");

    //Call the API, read its response and update the document when form is submitted

    Form.addEventListener("submit", async (e) => {
      e.preventDefault();
      GraphDiv.innerHTML = null;
      try {
        try {
          QFCalculator.testInput([AInput, BInput, CInput]);
        } catch {
          throw "Invalid input!";
        }
        const A = QFCalculator.getValue(AInput),
          B = QFCalculator.getValue(BInput),
          C = QFCalculator.getValue(CInput),
          RESPONSE = await fetch(`http://127.0.0.1:5000/?a=${A}&b=${B}&c=${C}`),
          Data: APIData = await RESPONSE.json();
        if ("error" in Data) {
          throw Data.error;
        }
        const QuadraticFunction = new QFCalculator(Data);
        FormDiv.textContent = QuadraticFunction.form;
        RootsDiv.textContent = "Roots (when y = 0):";
        ResultRootsDiv.innerHTML = QuadraticFunction.roots;
        CoordinatesDiv.textContent = "Vertex:";
        ResultCoordinatesDiv.textContent = QuadraticFunction.vertex;
        GraphDiv.appendChild(QuadraticFunction.graph);
      } catch (err) {
        FormDiv.textContent = "y = ax\u00b2 + bx + c";
        RootsDiv.textContent = null;
        ResultRootsDiv.textContent = null;
        CoordinatesDiv.textContent = null;
        ResultCoordinatesDiv.textContent =
          err instanceof Error ? err.message : err;
      }
      location.href = "#output";
    });

    //Methods that call the testInput method for their parent objects when they lose focus

    AInput.onblur = () =>
      QFCalculator.testInput([AInput], QFCalculator.displayMessage);
    BInput.onblur = () =>
      QFCalculator.testInput([BInput], QFCalculator.displayMessage);
    CInput.onblur = () =>
      QFCalculator.testInput([CInput], QFCalculator.displayMessage);

    //Methods that call the QFCalculator.whenKeyDown function when a key is downed

    AInput.onkeydown = (e) => QFCalculator.whenKeyDown(e, BInput);
    BInput.onkeydown = (e) => QFCalculator.whenKeyDown(e, CInput);
    CInput.onkeydown = (e) => QFCalculator.whenKeyDown(e);
  }

  //Read an element's value and check if it's valid

  private static testInput(
    els: HTMLInputElement[],
    catchEroor?: Function
  ): void {
    for (let el of els) {
      const VALUE = QFCalculator.getValue(el),
        FractionRegEx = /^-?\d+dividedBy\d+$/,
        DividedByZeroRegEx = /dividedBy0/,
        FloatRegEx = /^-?\d*[.]\d{1,15}$/,
        IntegerRegEx = /^-?\d+$/,
        ZeroFractionRegEx = /^-?0+dividedBy/,
        ZeroFloatRegEx = /^-?0*[.]0+$/,
        ZeroIntegerRegEx = /^-?0+$/,
        VALIDFRACTION =
          FractionRegEx.test(VALUE) && !DividedByZeroRegEx.test(VALUE),
        VALIDEFLOAT = FloatRegEx.test(VALUE),
        VALIDEINTEGER = IntegerRegEx.test(VALUE),
        ZERONUMBER =
          ZeroFractionRegEx.test(VALUE) ||
          ZeroFloatRegEx.test(VALUE) ||
          ZeroIntegerRegEx.test(VALUE);
      try {
        if (el.id === "a-input" && ZERONUMBER) {
          throw "Enter a non-zero number!";
        }
        if (!(VALIDFRACTION || VALIDEFLOAT || VALIDEINTEGER)) {
          throw "Enter a integer, float or fractional number!";
        }
      } catch (err) {
        if (catchEroor) {
          catchEroor(el, err);
        } else {
          throw err;
        }
      }
    }
  }

  private static displayMessage(el: HTMLElement, message: string): void {
    const ParentEl = el.parentElement;
    if (ParentEl.childElementCount === 2) {
      const InvalidMessageDiv = document.createElement("div");
      el.classList.add("invalid-input");
      InvalidMessageDiv.classList.add("invalid-message");
      InvalidMessageDiv.textContent = message;
      ParentEl.appendChild(InvalidMessageDiv);
      el.addEventListener(
        "keydown",
        () => {
          el.classList.remove("invalid-input");
          InvalidMessageDiv.remove();
        },
        { once: true }
      );
    }
  }

  //Get the value of an element and format it

  private static getValue(el: HTMLInputElement): string {
    return el.value.trim().replace("/", "dividedBy");
  }

  //Move focus to the next element or submit the form if there is none

  private static whenKeyDown(
    e: KeyboardEvent,
    nextEl?: HTMLInputElement
  ): void {
    if (e.keyCode === 13) {
      if (nextEl) {
        nextEl.focus();
        nextEl.value = "";
        e.preventDefault();
      }
      return void 0;
    }
  }
}

window.addEventListener("load", QFCalculator.main);
