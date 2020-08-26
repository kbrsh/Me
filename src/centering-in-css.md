---
name: Centering In CSS
---

Unfortunately, there is no built in support for centering in CSS, but there are some ways to do it. I will be talking about two of the most effective ways to do it.

#### Flexbox

Using flexbox is a clean, hack-free way to center elements. The only downside is browser support, don't use this if you need to support IE 10 and below.

Say you have the following HTML:

```html
<div class="center">
    <h1>Centered Content</h1>
</div>
```

You need to center everything **within** the `div`. So you would apply the following styles to the **parent element**. Which is `.center` in this case.

```css
.center {
   display: flex; /* activates flexbox */
   align-items: center; /* align items vertically */
   justify-content: center; /* align items horizontally */
}
```

#### Table

Using a table will require more code than flexbox, but will support many more browsers; this includes IE 6 and up!

With the following HTML:

```html
<div class="center">
    <div class="cell">
        <div class="content">
            <h1>Centered Content</h1>
        </div>
    </div>
</div>
```

You will need three containers:

1. One on the outside, representing a `table`
2. A `cell` inside of of the `table`, this will be a `table-cell`
3. A container for all of the centered content


Now, you can style them:

```css
.center {
    display: table; /* make .center a table */
}

.cell {
    display: table-cell; /* make table cell */
    vertical-align: middle; /* vertically align cell in the middle */
}

.content {
    margin-left: auto; /* the content's left side margin is auto (centering it) */
    margin-right: auto; /* the content's right side margin is auto (centering it) */
    text-align: center; /* align any other text items in the center*/
    /* text-align: center; is optional */
}
```

There, now you can center things supporting IE 6 and up.
