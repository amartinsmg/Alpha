function gcd(m, n) {
    let module = m % n;
    while (module != 0) {
        m = n;
        n = module;
        module = m % n;
    }
    return (n);
}

//console.log(gcd(60,144)); /* to test */
//console.log(gcd(12, gcd(144, gcd (6, 32)))); /* to test */

function factorization(num) {
    let steps = [], factors = [];
    while (num > 1) {
        for (let i = 2; i <= num; i++) {
            if (num % i == 0) {
                steps.push([num, i]);
                factors.push(i);
                num /= i;
                break;
            }
        }
    }
    steps.push([num, '']);
    //return(factors);
    //return steps;
    let arr = [], i = 0;
    while (i < factors.length) {
        let m = factors[i], occurrences;
        occurrences = factors.lastIndexOf(m) - factors.indexOf(m) + 1;
        arr.push([m, occurrences]);
        i = factors.lastIndexOf(m) + 1
    }
    return (arr);
}

//console.log(factorization(242)); /* to test */

function rootSimpl(Num) {
    let arr = factorization(Num);

    //    console.log(arr); /* Ok */

    let intPart = 1, radicandPart = 1, finalNum;

    for (let i = 0; i < arr.length; i++) {

        //        console.log(arr[i][0]); /* Ok */

        let exponent = arr[i][1];

        //        console.log(exponent); /* Ok */

        if (exponent >= 2) {
            intPart *= (arr[i][0] * Math.floor(exponent / 2));
            if (exponent % 2 != 0) {
                radicandPart *= arr[i][0];
            }
        } else {
            radicandPart *= arr[i][0];
        }
    }
    //    finalNum = `${intPart}√${radicandPart}`;
    finalNum = [intPart, radicandPart];
    return (finalNum);
}

//console.log(rootSimpl(242)); /* to test */

function quadraticFunction(a, b, c) {
    if ((!isNaN(a)) && (!isNaN(b)) && (!isNaN(c)) && (a != 0)) {
        let delta, deltaRoot, x1, x2, aa = 2 * a;
        delta = b ** 2 - 4 * a * c;
        if (delta < 0) {
            return ("This quadratic function don't have any real value.")
        } else if (delta == 0) {
            b = -b
            if (b % aa == 0) {
                return (`x = ${b / aa}`);
            } else {
                let gcdx = gcd(b, aa);
                if (gcdx != 1) {
                    b /= gcdx;
                    aa /= gcdx;
                }
                if (aa < 0) {
                    aa = -aa;
                    b = -b;
                }
                return (`x = ${b}/${aa}`);
            }
        } else {
            deltaRoot = Math.sqrt(delta);
            if (Number.isInteger(deltaRoot) === true) {
                let numer1 = (-b) - deltaRoot, numer2 = (-b) + deltaRoot
                if (numer1 % aa == 0) {
                    x1 = numer1 / aa;
                } else {
                    let gcd1 = gcd(numer1, aa);
                    if (gcd1 != 1) {
                        numer1 /= gcd1;
                        aa /= gcd1;
                    }
                    if (aa < 0) {
                        aa = -aa;
                        numer1 = -numer1;
                    }
                    x1 = `${numer1}/${aa}`;
                }
                if (numer2 % aa == 0) {
                    x2 = numer2 / aa;
                } else {
                    let gcd2 = gcd(numer2, aa);
                    if (gcd2 != 0) {
                        numer2 /= gcd2;
                        aa /= gcd2;
                    }
                    if (aa < 0) {
                        aa = -aa;
                        numer2 = -numer2;
                    }
                    x2 = `${numer2}/${aa}`;
                }
            } else {
                deltaRootSimpl = rootSimpl(delta);
                let gcd1 = gcd(deltaRootSimpl[0], aa)

                //console.log(deltaRootSimpl); /*to test*/

                if (b == 0) {
                    if ((deltaRootSimpl[0] % aa) == 0) {
                        deltaRootSimpl[0] /= aa;
                        switch (deltaRootSimpl[0]) {
                            case 1:
                                x1 = `-√${deltaRootSimpl[1]}`;
                                x2 = `√${deltaRootSimpl[1]}`;
                                break;
                            case -1:
                                x1 = `√${deltaRootSimpl[1]}`;
                                x2 = `-√${deltaRootSimpl[1]}`;
                                break;
                            default:
                                x1 = `${-deltaRootSimpl[0]}√${deltaRootSimpl[1]}`;
                                x2 = `${deltaRootSimpl[0]}√${deltaRootSimpl[1]}`;
                        }
                    } else {
                        if (gcd1 != 1) {
                            deltaRootSimpl[0] /= gcd1;
                            aa /= gcd1;
                        }
                        if (aa < 0) {
                            aa = -aa;
                            deltaRootSimpl[0] = - deltaRootSimpl[0];
                            switch (deltaRootSimpl[0]) {
                                case 1:
                                    x1 = `-(√${deltaRootSimpl[1]})/${aa}`;
                                    x2 = `(√${deltaRootSimpl[1]})/${aa}`;
                                    break;
                                case -1:
                                    x1 = `(√${deltaRootSimpl[1]})/${aa}`;
                                    x2 = `-(√${deltaRootSimpl[1]})/${aa}`;
                                    break;
                                default:
                                    x1 = `${-deltaRootSimpl[0]}√(${deltaRootSimpl[1]})/${aa}`;
                                    x2 = `${deltaRootSimpl[0]}√(${deltaRootSimpl[1]})/${aa}`;
                            }
                        } else {
                            x1 = `${-deltaRootSimpl[0]}√(${deltaRootSimpl[1]})/${aa}`;
                            x2 = `${deltaRootSimpl[0]}√(${deltaRootSimpl[1]})/${aa}`;
                        }
                    }
                } else {
                    b = -b
                    let gcd2 = gcd(gcd1, b)
                    if (gcd1 != 1) {
                        deltaRootSimpl[0] /= gcd2;
                        aa /= gcd2;
                        b /= gcd2;
                    }
                    if (aa < 0) {
                        aa = -aa
                        b = -b
                        deltaRootSimpl[0] = -deltaRootSimpl[0]
                    }
                    if (aa == 1) {
                        switch (deltaRootSimpl[0]) {
                            case 1:
                                x1 = `${b} -√${deltaRootSimpl[1]}`;
                                x2 = `${b} +√${deltaRootSimpl[1]}`;
                                break;
                            case -1:
                                x1 = `${b} +√${deltaRootSimpl[1]}`;
                                x2 = `${b} -√${deltaRootSimpl[1]}`;
                                break;
                            default:
                                if(deltaRootSimpl[0] > 0){
                                    x1 = `${b} ${-deltaRootSimpl[0]}√${deltaRootSimpl[1]}`;
                                    x2 = `${b} + ${deltaRootSimpl[0]}√${deltaRootSimpl[1]}`;
                                }else {
                                    x1 = `${b} + ${-deltaRootSimpl[0]}√${deltaRootSimpl[1]}`;
                                    x2 = `${b} ${deltaRootSimpl[0]}√${deltaRootSimpl[1]}`;
                                }
                        }
                    } else {
                        switch (deltaRootSimpl[0]) {
                            case 1:
                                x1 = `(${b} -√${deltaRootSimpl[1]})/${aa}`;
                                x2 = `(${b} +√${deltaRootSimpl[1]})/${aa}`;
                                break;
                            case -1:
                                x1 = `(${b} +√${deltaRootSimpl[1]})/${aa}`;
                                x2 = `(${b} -√${deltaRootSimpl[1]})/${aa}`;
                                break;
                            default:
                                if(deltaRootSimpl[0] > 0){
                                    x1 = `(${b} ${-deltaRootSimpl[0]}√${deltaRootSimpl[1]})/${aa}`;
                                    x2 = `(${b} + ${deltaRootSimpl[0]}√${deltaRootSimpl[1]})/${aa}`;
                                }else {
                                    x1 = `(${b} + ${-deltaRootSimpl[0]}√${deltaRootSimpl[1]})/${aa}`;
                                    x2 = `(${b} ${deltaRootSimpl[0]}√${deltaRootSimpl[1]})/${aa}`;
                                }
                        }
                    }
                }
            }
            return (`x' = ${x1}, x" = ${x2}`);
        }
    } else {
        return ("This is NOT a quadratic function!");
    }
}

console.log(quadraticFunction(1, 3, -5)); /* to test */