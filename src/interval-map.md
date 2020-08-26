---
name: Interval Map
math: true
---

Many programs require a mathematical function capable of mapping an interval of numbers linearly onto another interval. A `$\mathit{map}$` function maps one interval linearly onto another.

```math
\mathit{map}(x):[a,b]\to[c,d] \\
\mathit{map}(x) = \frac{d - c}{b - a}(x - a) + c
```

#### Example

The interval `$[0, 10]$` can be mapped to `$[0, 100]$` using `$\mathit{map}$`.

```math
\begin{aligned}
  \mathit{map}(x) & = 10x \\
  \\
  \mathit{map}(0) & = 0 \\
  \mathit{map}(10) & = 100
\end{aligned}
```

#### Derivation

The `$\mathit{map}$` function can be thought of as a linear function that passes through the points `$(a,c)$` and `$(b,d)$`. This means that the function should map `$a$` to `$c$` and `$b$` to `$d$`.

```math
\begin{aligned}
  \mathit{map}(a) & = c \\
  \mathit{map}(b) & = d
\end{aligned}
```

With two points the slope can be obtained and the function can be written and simplified.

```math
\begin{aligned}
  \mathit{map}(x) - c & = \frac{d - c}{b - a}(x - a) \\
  \mathit{map}(x) & = \frac{d - c}{b - a}(x - a) + c
\end{aligned}
```

The function can be verified to ensure a correct mapping of `$a$` to `$c$`.

```math
\begin{aligned}
  \mathit{map}(a) &= \frac{d - c}{b - a}(a - a) + c \\
  \mathit{map}(a) &= c
\end{aligned}
```

The same can be done to ensure `$b$` maps to `$d$`.

```math
\begin{aligned}
  \mathit{map}(b) &= \frac{d - c}{b - a}(b - a) + c \\
  \mathit{map}(b) &= d - c + c \\
  \mathit{map}(b) &= d
\end{aligned}
```
