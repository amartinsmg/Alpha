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
                x1 = ((-b) + deltaRoot) / aa;
                x2 = ((-b) - deltaRoot) / aa;
            } else if (b == 0) {
                x1 = `(-√${delta})/${aa}`;
                x2 = `(√${delta})/${aa}`;
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


//console.log(quadraticFunction(-1, 0, 5)); /* to test */