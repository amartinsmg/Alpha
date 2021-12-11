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
                let numer1 = (-b) + deltaRoot, numer2 = (-b) - deltaRoot
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
            } else if (b == 0) {
                if (a < 0) {
                    aa = -aa
                    x1 = `(√${delta})/${aa}`;
                    x2 = `-(√${delta})/${aa}`;
                } else {
                    x1 = `(-√${delta})/${aa}`;
                    x2 = `(√${delta})/${aa}`;
                }
            } else {
                b = -b
                if (a < 0) {
                    aa = -aa
                    x1 = `-(${b} -√${delta})/${aa}`;
                    x2 = `-(${b} +√${delta})/${aa}`;
                } else {
                    x1 = `(${b} -√${delta})/${aa}`;
                    x2 = `(${b} +√${delta})/${aa}`;
                }
            }
            return (`x' = ${x1}, x" = ${x2}`);
        }
    } else {
        return ("This is NOT a quadratic function!");
    }
}

function gcd(x, y) {
    let module = x % y;
    while (module != 0) {
        x = y;
        y = module;
        module = x % y;
    }
    return (y);
}

//console.log(gcd(60,144)); /* to test */
//console.log(gcd(12, gcd(144, gcd (6, 32)))); /* to test */

//console.log(quadraticFunction(-4, 6, 2)); /* to test */