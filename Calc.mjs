//Function that prints initial quadratic function

function form(a, b, c) {
  let form = "y = ";

  //ax²
  switch (a) {
    case 1:
      form += `x\u00B2 `;
      break;
    case -1:
      form += `-x\u00B2 `;
      break;
    default:
      form += `${a}x\u00B2 `;
  }

  //bx
  if (b === -1) {
    form += `-x `;
  } else if (b === 1) {
    form += `+x `;
  } else if (b < 0) {
    form += `${b}x `;
  } else if (b > 0) {
    form += `+${b}x `;
  }

  //c
  if (c < 0) {
    form += `${c} `;
  } else if (c > 0) {
    form += `+${c} `;
  }

  return form;
}

//Function that calculates the great common divisor

function gcd(m, n) {
  const MODULE = m % n;
  if (MODULE !== 0) {
    return gcd(n, MODULE);
  }
  return Math.abs(n);
}

//Function that returns a number as a product of prime numbers

function factorization(num) {
  const FACTORS = [],
    GROUPEDFACTORS = [];
  while (num > 1) {
    for (let i = 2; i <= num; i++) {
      if (num % i === 0) {
        FACTORS.push(i);
        num /= i;
        break;
      }
    }
  }
  let i = 0;
  while (i < FACTORS.length) {
    let j = FACTORS[i],
      occurrences = FACTORS.lastIndexOf(j) - FACTORS.indexOf(j) + 1;
    GROUPEDFACTORS.push([j, occurrences]);
    i = FACTORS.lastIndexOf(j) + 1;
  }
  return GROUPEDFACTORS;
}

// Function that simplifies a square root

function rootSimplifier(num) {
  const FACTORS = factorization(num);
  let intPart = 1,
    irrationalPart = 1;
  for (let i of FACTORS) {
    const [BASE, EXPONENT] = i;
    if (EXPONENT >= 2) {
      intPart *= BASE ** Math.floor(EXPONENT / 2);
      if (EXPONENT % 2 === 0) {
        continue;
      }
    }
    irrationalPart *= BASE;
  }
  return [intPart, irrationalPart];
}

//Function that calculates x value(s)

function core(a, b, c) {
  if (isNaN(a) || isNaN(b) || isNaN(c)) {
    throw 'In a quadratic function "a", "b" and "c" must be numbers!';
  } else if (a === 0) {
    throw 'In a quadratic function "a" must be a number NOT equal 0!';
  }
  let zeros;
  const AAAA = 4 * a;
  if (a < 0) {
    a = -a;
    b = -b;
    c = -c;
  }
  const AA = 2 * a,
    DELTA = b ** 2 - 4 * a * c,
    DELTAROOT = Math.sqrt(DELTA),
    B = -b,
    GCDX = gcd(B, AA),
    GCDY = gcd(DELTA, AAAA),
    VERTEX_X = B / AA,
    VERTEXX = B % AA === 0 ? `${B / AA}` : `${B / GCDX}/${AA / GCDX}`,
    VERTEXY =
      -DELTA % AAAA === 0
        ? `${-DELTA / AAAA}`
        : AAAA > 0
          ? `${-DELTA / GCDY}/${AAAA / GCDY}`
          : `${DELTA / GCDY}/${-AAAA / GCDY}`,
    VERTEX = [VERTEXX, VERTEXY],
    X1 = (B - DELTAROOT) / AA,
    X2 = (B + DELTAROOT) / AA;
  if (DELTA < 0) {
    zeros = "This quadratic function don't have any real zero.";
  } else if (DELTA === 0) {
    zeros = `x = ${VERTEXX}`;
  } else {
    let x1, x2;
    if (DELTAROOT % 1 === 0) {
      const NUMERATOR1 = B - DELTAROOT,
        NUMERATOR2 = B + DELTAROOT,
        GCD1 = gcd(NUMERATOR1, AA),
        GCD2 = gcd(NUMERATOR2, AA);
      x1 = NUMERATOR1 % AA === 0
        ? `${NUMERATOR1 / AA}`
        : `${NUMERATOR1 / GCD1}/${AA / GCD1}`;
      x2 = NUMERATOR2 % AA === 0
        ? `${NUMERATOR2 / AA}`
        : `${NUMERATOR2 / GCD2}/${AA / GCD2}`;
    } else {
      const [INTDELTAPART, IRRATIONALDELTAPART] = rootSimplifier(DELTA),
        GCD = gcd(INTDELTAPART, AA);
      if (B === 0) {
        if (INTDELTAPART % AA === 0) {
          if (INTDELTAPART / AA === 1) {
            x1 = `-\u221A${IRRATIONALDELTAPART}`;
            x2 = `\u221A${IRRATIONALDELTAPART}`;
          } else {
            x1 = `${-INTDELTAPART / AA}\u221A${IRRATIONALDELTAPART}`;
            x2 = `${INTDELTAPART / AA}\u221A${IRRATIONALDELTAPART}`;
          }
        } else {
          if (INTDELTAPART / GCD === 1) {
            x1 = `-(\u221A${IRRATIONALDELTAPART})/${AA / GCD}`;
            x2 = `(\u221A${IRRATIONALDELTAPART})/${AA / GCD}`;
          } else {
            x1 = `${-INTDELTAPART / GCD}\u221A(${IRRATIONALDELTAPART})/${AA / GCD}`;
            x2 = `${INTDELTAPART / GCD}\u221A(${IRRATIONALDELTAPART})/${AA / GCD}`;
          }
        }
      } else {
        const GCDB = gcd(GCD, B);
        if (AA / GCDB === 1) {
          if (INTDELTAPART / GCDB === 1) {
            x1 = `${B / GCDB} -\u221A${IRRATIONALDELTAPART}`;
            x2 = `${B / GCDB} +\u221A${IRRATIONALDELTAPART}`;
          } else {
            x1 = `${B / GCDB} ${-INTDELTAPART / GCDB}\u221A${IRRATIONALDELTAPART}`;
            x2 = `${B / GCDB} + ${INTDELTAPART / GCDB}\u221A${IRRATIONALDELTAPART}`;
          }
        } else {
          if (INTDELTAPART / GCDB === 1) {
            x1 = `(${B / GCDB} -\u221A${IRRATIONALDELTAPART})/${AA / GCDB}`;
            x2 = `(${B / GCDB} +\u221A${IRRATIONALDELTAPART})/${AA / GCDB}`;
          } else {
            x1 = `(${B / GCDB} ${-INTDELTAPART / GCDB}\u221A${IRRATIONALDELTAPART})/${AA / GCDB}`;
            x2 = `(${B / GCDB} +${INTDELTAPART / GCDB}\u221A${IRRATIONALDELTAPART})/${AA / GCDB}`;
          }
        }
      }
    }
    zeros = `x' = ${x1}\nx" = ${x2}`;
  }
  return [zeros, VERTEX, X1, X2, VERTEX_X];
}


//Test function

/* void (function (a, b, c) {
  try {
    console.log(`${form(a, b, c)}\n${core(a, b, c)[0]}`);
  } catch (e) {
    console.warn(e);
  }
})(-2, -8, 16); //Ok */


export { form, core };
