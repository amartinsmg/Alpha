//Função que transforma a string em número

function decimal(num) {
    num = num.replace(",", ".");
    num = Number(num);
    if (isNaN(num) === true) {
        return 0;
    } else {
        return num;
    }
}


//Função que imprime a fórmula da função quadrática

function formF(a, b, c) {
    var printIt;

    //impressão de ax²

    switch (a) {
        case 1:
            printIt = `x² `;
            break;
        case -1:
            printIt = `-x² `;
            break;
        default:
            printIt = `${a}x² `;
    };

    //impressão de bx

    if (b == 1) {
        printIt += `+x `;
    } else if (b == -1) {
        printIt += `-x `;
    } else if (b < 0) {
        printIt += `${b}x `;
    } else if (b > 0) {
        printIt += `+${b}x `;
    };

    //impressão de c

    if (c < 0) {
        printIt += `${c} `;
    } else if (c > 0) {
        printIt += `+${c} `;
    };

    printIt += `= 0`;
    return printIt;
};


//Função que calcula o resultado

function quadraticFunction(a, b, c) {
    if ((!isNaN(a)) && (!isNaN(b)) && (!isNaN(c)) && (a != 0)) {
        var delta, deltaRoot, x1, x2, aa = 2 * a;
        delta = Math.pow(b, 2) - 4 * a * c;
        if (delta < 0) {
            return ("This quadratic function don't have any real value.")
        } else if (delta == 0) {
            x1 = - b / aa;
            return (`x = ${x1}`);
        } else {
            deltaRoot = Math.sqrt(delta);
            if (Number.isInteger(deltaRoot) === true) {
                x1 = ((-b) - deltaRoot) / aa;
                x2 = ((-b) + deltaRoot) / aa;
            } else if (b == 0) {
                x1 = `(-√${delta})/${aa}`;
                x2 = `(√${delta})/${aa}`;
            } else {
                x1 = `(${-b} -√${delta})/ ${aa}`;
                x2 = `(${-b} +√${delta})/ ${aa}`;
            }
            return (`x' = ${x1}, x" = ${x2}`);
        }
    } else {
        return ("This is NOT a quadratic function!");
    }
}


//Função principal que pega as imputs e chama as demais funções

function calculator() {
    var aValue, bValue, cValue;
    aValue = document.getElementById("aValue").value;
    bValue = document.getElementById("bValue").value;
    cValue = document.getElementById("cValue").value;
    aValue = decimal(aValue);
    bValue = decimal(bValue);
    cValue = decimal(cValue);
    if (aValue != 0) {
        document.getElementById("functionPrinting").innerHTML = formF(aValue, bValue, cValue);
        document.getElementById("resultPrinting").innerHTML = quadraticFunction(aValue, bValue, cValue);
    } else {
        alert("In a quadratic function \"a\" must be NOT equal 0!");
    }
}


//Função de teste

/* function testCalculator(aValue, bValue, cValue) {
    return(`${formF(aValue, bValue, cValue)}\n${quadraticFunction(aValue, bValue, cValue)}`);
} */

console.log(testCalculator(-2, 4, 6)); /* to test */