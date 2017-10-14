---
title: Devon Smith
layout: default
---
## Homework 3
Project description.

### Step 1: Analyzing the Java Application

#### Code inspection

#### State Tests from CS460 HW3 Java Code


**Testing the default output when starting the application:**

```bash
Postfix Calculator. Recognizes these operators: + - * /
Please enter q to quit

>
```

**Testing a valid expression on the calculator:**

```bash
Postfix Calculator. Recognizes these operators: + - * /
Please enter q to quit

> 5 5 +
    >>> 5 5 + = 10.0
Please enter q to quit

>
```

**Testing and expression that divides by zero:**

```bash
Postfix Calculator. Recognizes these operators: + - * /
Please enter q to quit

> 10 0 /
    >>> 10 0 / = Can't divide by zero
Please enter q to quit

>
```

**Testing an invalid statement that produces a stack exception:**

```bash
Postfix Calculator. Recognizes these operators: + - * /
Please enter q to quit

> 15 +
    >>> 15 + = Improper input format. Stack became empty when expecting first operand.
Please enter q to quit

> 15 7 3 + + -
    >>> 15 7 3 + + - = Improper input format. Stack became empty when expecting first operand.
```

This causes the calculator to produce a message telling the user what happened during the calculation.

**Testing an incomplete expression:**

```bash
Postfix Calculator. Recognizes these operators: + - * /
Please enter q to quit

> 15 7 1 1 + - / 3 * 2 1 1 + +
    >>> 15 7 1 1 + - / 3 * 2 1 1 + + = 4.0
```

When the calculator has a stack in an invalid end state containing multiple numbers the calculator pushes the top value from the stack. This causes the calculator to produce an invalid answer. I am going to change this behavior from the original so it will produce a warning for the user.


### Step 2:

### Step 3:

### Step 4: