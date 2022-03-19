import numpy as np
from matplotlib import pyplot as plt

a = int(input())
b = int(input())
c = int(input())
delta = b ** 2 - 4 *a * c
if delta > 0:
    x1 = (-b - np.sqrt(delta))/(2 * a)
    x2 = (-b + np.sqrt(delta))/(2 * a)
else:
    x1 = -b / (2 * a)
    x2 = x1

x = np.arange((x1 - 2), (x2 + 2), .1)
y = a * x ** 2 + b * x + c

fig = plt.figure()
plt.plot(x, y)
#plt.show()

fig.savefig("plot.png")