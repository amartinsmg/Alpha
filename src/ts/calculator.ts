abstract class Calculator {
  // This method that gets the value of an input element

  protected static getInputValue(el: HTMLInputElement): string {
    return el.value.trim().replace(",", ".");
  }

  // This method that reads the value of an input element and checks if it's valid

  protected static validateInputValue(
    els: HTMLInputElement[],
    fraction: boolean,
    ...nonZero: string[]
  ): string {
    for (let el of els) {
      const VALUE: string = Calculator.getInputValue(el),
        FractionRegEx = /^-?\d+[/][1-9]\d+$/,
        NumberRegEx = /^-?\d*[.]?\d+$/,
        ZeroFractionRegEx = /^-?0+[/]/,
        ZeroNumberRegEx = /^-?0*[.]?0+$/,
        VALID_VALUE = fraction
          ? FractionRegEx.test(VALUE) || NumberRegEx.test(VALUE)
          : NumberRegEx.test(VALUE),
        ZERO_NUMBER =
          ZeroFractionRegEx.test(VALUE) || ZeroNumberRegEx.test(VALUE);
      if (!VALID_VALUE) return "Enter a valid number!";
      if (nonZero.includes(el.name) && ZERO_NUMBER)
        return "Enter a non-zero number!";
    }
    return "valid";
  }

  // This method displays the errors found in user input above the input element

  protected static showFeedback(
    el: HTMLInputElement,
    parentForm: HTMLFormElement,
    parentClass: any
  ): void {
    const FEEDBACK = parentClass.validateInputValue([el]),
      ParentEl = el.parentElement as HTMLElement;
    if (FEEDBACK !== "valid" && ParentEl.childElementCount === 2) {
      const InvalidMessageDiv = document.createElement("div"),
        removeInvalidMessage = () => {
          el.classList.remove("invalid-input");
          InvalidMessageDiv.remove();
        },
        once = true;
      el.classList.add("invalid-input");
      InvalidMessageDiv.classList.add("invalid-feedback");
      InvalidMessageDiv.textContent = FEEDBACK;
      ParentEl.appendChild(InvalidMessageDiv);
      el.addEventListener("input", removeInvalidMessage, { once });
      parentForm.addEventListener("reset", removeInvalidMessage, { once });
    }
  }

  // This method moves focus to the next element or submits the form if there is none

  protected static whenKeyDown(
    e: KeyboardEvent,
    nextEl?: HTMLInputElement
  ): void {
    if (e.key === "Enter") {
      if (nextEl) {
        nextEl.focus();
        nextEl.value = "";
        e.preventDefault();
      }
      return void 0;
    }
  }
}

export default Calculator;
