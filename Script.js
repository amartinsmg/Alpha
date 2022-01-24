const AINPUT = document.getElementById("aValue"),
    BINPUT = document.getElementById("bValue"),
    CINPUT = document.getElementById("cValue"),
    FORM  = document.querySelector(".input-form");


//Function that prints initial quadratic function

function formQF(a, b, c) {
    let form;

    //ax²

    switch (a) {
        case 1:
            form = `x\u00B2 `;
            break;
        case -1:
            form = `-x\u00B2 `;
            break;
        default:
            form = `${a}x\u00B2 `;
    };

    //bx

    if (b == -1) {
        form += `-x `;
    } else if (b == 1) {
        form += `+x `;
    } else if (b < 0) {
        form += `${b}x `;
    } else if (b > 0) {
        form += `+${b}x `;
    };

    //c

    if (c < 0) {
        form += `${c} `;
    } else if (c > 0) {
        form += `+${c} `;
    };

    form += `= 0`;
    return form;
};

//console.log(formQF(2, 4 , -6)); //Ok


//Function that calculates the great common divisor

function gcd(m, n) {
    let module = m % n;
    if (module != 0) {
        return gcd(n, module)
    }else{
        return n;
    }
}

//console.log(gcd(60,144)); /* to test */
//console.log(gcd(12, gcd(144, gcd (6, 32)))); /* to test */


//Function that returns a number as a product of prime numbers

function factorization(num) {

    //console.log(num); //Ok

    const FACTORS = [], ARR = [];
    while (num > 1) {
        for (let i = 2; i <= num; i++) {
            if (num % i == 0) {
                FACTORS.push(i);
                num /= i;
                break;
            }
        }
    }

    //console.log(FACTORS); //Ok

    let i = 0;
    while (i < FACTORS.length) {
        let j = FACTORS[i], occurrences;
        occurrences = FACTORS.lastIndexOf(j) - FACTORS.indexOf(j) + 1;
        ARR.push([j, occurrences]);
        i = FACTORS.lastIndexOf(j) + 1;
    }

    //console.log(ARR); //Ok

    return ARR;
}

//console.log(factorization(242)); //Ok


// Function that simplifies a square root

function rootSimplifier(num) {
    const ARR = factorization(num);
    let intPart = 1, radicandPart = 1;

    //console.log(ARR); //Ok

    for (let i of ARR) {
        //        console.log(i); //Ok
        //        console.log(i[0]); //Ok

        let exponent = i[1];

        //        console.log(exponent); //Ok

        if (exponent >= 2) {
            intPart *= (i[0] ** Math.floor(exponent / 2));
            if (exponent % 2 != 0) {
                radicandPart *= i[0];
            }
        } else {
            radicandPart *= i[0];
        }
    }

    //    console.log(`${intPart}\u221A${radicandPart}`); //Ok

    const FINALNUM = [intPart, radicandPart];
    return FINALNUM;
}

//console.log(rootSimplifier(124)); //Ok


//Function that calculates x value(s)

function quadraticFunction(a, b, c) {
    if (isNaN(a) || isNaN(b) || isNaN(c) || a == 0) {
        throw "In a quadratic function \"a\", \"b\" and \"c\" must be numbers, and \"a\" must be NOT equal 0!"
    }
    let aa = 2 * a;
    const DELTA = b ** 2 - 4 * a * c,
        DELTAROOT = Math.sqrt(DELTA);
    b = -b
    if (DELTA < 0) {
        return ("This quadratic function don't have any real value.")
    } else if (DELTA == 0) {
        if (b % aa == 0) {
            return `x = ${b / aa}`;
        } else {
            const GCD = gcd(b, aa);
            if (GCD != 1) {
                b /= GCD;
                aa /= GCD;
            }
            if (aa < 0) {
                aa = -aa;
                b = -b;
            }
            return `x = ${b}/${aa}`;
        }
    } else {
        let x1, x2;
        if (Number.isInteger(DELTAROOT) === true) {
            let numerator1 = b - DELTAROOT, numerator2 = b + DELTAROOT
            if (numerator1 % aa == 0) {
                x1 = `${numerator1 / aa}`;
            } else {
                const GCD1 = gcd(numerator1, aa);
                if (aa < 0) {
                    aa = -aa;
                    numerator1 = -numerator1
                    numerator2 = -numerator2;
                }
                if (GCD1 != 1) {
                    numerator1 /= GCD1;
                    aa /= GCD1;
                }
                x1 = `${numerator1}/${aa}`;
            }
            if (numerator2 % aa == 0) {
                x2 = numerator2 / aa;
            } else {
                const GCD2 = gcd(numerator2, aa);
                if (GCD2 != 0) {
                    numerator2 /= GCD2;
                    aa /= GCD2;
                }
                x2 = `${numerator2}/${aa}`;
            }
        } else {
            const DELTAROOTSIMPLIFIED = rootSimplifier(DELTA);

            //console.log(DELTAROOTSIMPLIFIED); //Ok

            let intDeltaPart = DELTAROOTSIMPLIFIED[0];
            const IRRATIONALDELTAPART = DELTAROOTSIMPLIFIED[1],
                GCD = gcd(intDeltaPart, aa);

            if (b == 0) {
                if ((intDeltaPart % aa) == 0) {
                    intDeltaPart /= aa;
                    if (intDeltaPart == 1 || intDeltaPart == -1) {
                        x1 = `-\u221A${IRRATIONALDELTAPART}`;
                        x2 = `\u221A${IRRATIONALDELTAPART}`;
                    } else {
                        x1 = `${-intDeltaPart}\u221A${IRRATIONALDELTAPART}`;
                        x2 = `${intDeltaPart}\u221A${IRRATIONALDELTAPART}`;
                    }
                } else {
                    if (GCD != 1) {
                        intDeltaPart /= GCD;
                        aa /= GCD;
                        //PS: aa will be != 1 and != -1, because GCD will be != aa
                    }
                    if (aa < 0) {
                        aa = -aa;
                        intDeltaPart = -intDeltaPart;
                    }
                    if (intDeltaPart == 1 || intDeltaPart == -1) {
                        x1 = `-(\u221A${IRRATIONALDELTAPART})/${aa}`;
                        x2 = `(\u221A${IRRATIONALDELTAPART})/${aa}`;
                    } else {
                        x1 = `${-intDeltaPart}\u221A(${IRRATIONALDELTAPART})/${aa}`;
                        x2 = `${intDeltaPart}\u221A(${IRRATIONALDELTAPART})/${aa}`;
                    }
                }
            } else {
                const GCDB = gcd(GCD, b);

                //console.log(b, intDeltaPart, aa, GCDB); //Ok

                if (GCDB != 1) {
                    intDeltaPart /= GCDB;
                    aa /= GCDB;
                    b /= GCDB;
                }

                //console.log(b, intDeltaPart, aa); //Ok

                if (aa < 0) {
                    aa = -aa;
                    b = -b;
                    intDeltaPart = -intDeltaPart;
                }

                //console.log(b, intDeltaPart, aa); //Ok

                if (aa == 1) {
                    if (intDeltaPart == -1 || intDeltaPart == 1) {
                        x1 = `${b} -\u221A${IRRATIONALDELTAPART}`;
                        x2 = `${b} +\u221A${IRRATIONALDELTAPART}`;
                    } else {
                        if (intDeltaPart < 0) {
                            intDeltaPart = -intDeltaPart;
                        }
                        x1 = `${b} ${-intDeltaPart}\u221A${IRRATIONALDELTAPART}`;
                        x2 = `${b} + ${intDeltaPart}\u221A${IRRATIONALDELTAPART}`;
                    }
                } else {
                    if (intDeltaPart == 1 || intDeltaPart == -1) {
                        x1 = `(${b} -\u221A${IRRATIONALDELTAPART})/${aa}`;
                        x2 = `(${b} +\u221A${IRRATIONALDELTAPART})/${aa}`;
                    } else {
                        if (intDeltaPart < 0) {
                            intDeltaPart = -intDeltaPart
                        }
                        x1 = `(${b} ${-intDeltaPart}\u221A${IRRATIONALDELTAPART})/${aa}`;
                        x2 = `(${b} +${intDeltaPart}\u221A${IRRATIONALDELTAPART})/${aa}`;
                    }
                }
            }
        }
        return `x' = ${x1}, x" = ${x2}`;
    }
}


//Function that calls the others

function calculate() {
    const A = parseInt(AINPUT.value),
        B = parseInt(BINPUT.value),
        C = parseInt(CINPUT.value),
        FORMDIV = document.getElementById("form-div");
        RESULTDIV = document.getElementById("result-div");
    try {
        FORMDIV.innerHTML = formQF(A, B, C);
        RESULTDIV.innerHTML = quadraticFunction(A, B, C);
    } catch (e) {
        FORMDIV.innerHTML = "This is NOT a Quadratic Function";
        RESULTDIV.innerHTML = e;
    }
}


//Test function

/* void function (a, b, c) {
    try{
        console.log(`${formQF(a, b, c)}\n${quadraticFunction(a, b, c)}`);
    } catch (e){
        console.warn(e)
    }
}(-2, -8, 16); //Ok */


//Functions that change the document

FORM.onsubmit = () => {
    calculate();
    return false;
}

AINPUT.onkeydown = (e) => {
    if (e.keyCode == 13) {
        BINPUT.focus();
        if (BINPUT.value == "0"){
            BINPUT.value = "";
        }
        return false;
    }
}

BINPUT.onkeydown = (e) => {
    if (e.keyCode == 13) {
        CINPUT.focus();
        if (CINPUT.value == "0"){
            CINPUT.value = "";
        }
        return false;
    }
}

CINPUT.onkeydown = (e) => {
    if (e.keyCode == 13) {
        return true;
    }
}