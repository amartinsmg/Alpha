function quadraticFunction(a, b, c) {
    if ((!isNaN(a)) && (!isNaN(b)) && (!isNaN(c)) && (a != 0)) {
        var delta, deltaRoot, x1, x2, aa = 2 * a;
        delta = b ** 2 - 4 * a * c;
        if (delta < 0) {
            return ("This quadratic function don't have any real value.")
        } else if (delta == 0) {
            if (-b % aa == 0) {
                return (`x = ${- b / aa}`);
            } else {
                return (`x = ${-b}/${aa}`);
            }
        } else {
            deltaRoot = Math.sqrt(delta);
            if (Number.isInteger(deltaRoot) === true) {
                let numer1 = (-b) + deltaRoot, numer2 = (-b) - deltaRoot
                if (numer1 % aa == 0) {
                    x1 = numer1 / aa;
                } else {
                    x2 = `${numer2}/ ${aa}`;
                }
                if (numer2 % aa == 0) {
                    x2 = numer2 / aa;
                } else {
                    x2 = `${numer2}/ ${aa}`;
                }
            } else if (b == 0) {
                x1 = `(-√${delta})/ ${aa}`;
                x2 = `(√${delta})/ ${aa}`;
            } else {
                x1 = `(${-b} -√${delta})/ ${aa}`;
                x2 = `(${-b} +√${delta})/ ${aa}`;
            };
            return (`x' = ${x1}, x" = ${x2}`);
        };
    } else {
        return ("This is NOT a quadratic function!");
    };
};


//console.log(quadraticFunction(4, -4, 1)); /* to test */