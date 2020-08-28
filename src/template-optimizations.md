---
name: Template optimizations
---

The majority of JavaScript libraries/frameworks use either templates or JSX to define a view. Templates allow for a well-defined structure, using a special syntax for binding data to the view. JSX allows for JavaScript to be used anywhere in the template, which adds a lot of power but can result in repetitive code.

[Moon](http://moonjs.ga) is a 7kb library with syntax inspired by Vue. Both Moon and Vue use a template system (although JSX can be used with Vue as well). To implement the template syntax, they have compilers that optimize the templates in different ways.

#### Virtual DOM

In the end, a compiler has the job of converting the template syntax into a function that can return a virtual DOM tree.

The virtual DOM is essentially a representation of the DOM as a set of objects. This lightweight representation is important because it can be implemented as a function of the current state. Every time data in an app is updated, an entirely new version of the virtual DOM can be generated and compared with the current version.

While the virtual DOM is lightweight, creating the whole tree for every render can use a lot of memory and impact performance. That is why it is important for compilers to be able to optimize templates and reuse static virtual nodes, as they do not need to be recreated on every render.

The virtual DOM consists of virtual nodes, which look something like:

```js
{
  type: "div", // Type of element
  props: {}, // Properties (attributes, directives, DOM properties),
  data: {}, // Internal data (SVG utilities, event listeners)
  children: [] // Children virtual nodes
}
```

Moon and Vue both compare a new virtual DOM with the old one, and update the DOM with a minimum amount of transformations. They also both have different ways of creating the virtual DOM.

Both provide a function to create virtual nodes. These functions are responsible for transforming a set of arguments into an object containing all of the required data for the current state of the view.

In Vue, a developer-friendly function is used to define a virtual DOM tree. This function is extremely flexible and can accept a variety of arguments with multiple types. This flexibility requires a normalization step at runtime.

For example:

```js
_c(
  "div",
  {},
  [
    "Text",
    _c("h1", "Heading"),
    _c(FooComponent, {
      props: {
        bar: "baz"
      }
    })
  ]
);
```

The virtual DOM utilities in Moon are more verbose and require fewer checks at runtime. Moon can allow this syntax because the compiler is meant to generate the normalized code rather than a developer.

For example:

```js
m("div", {}, {}, [
  m("#text", "Text"),
  m("h1", {}, {}, [m("#text", "Heading")]),
  m(
    "Foo",
    {
      props: {
        attrs: {
          bar: "baz"
        }
      }
    },
    {},
    []
  )
]);
```

Both Moon and Vue have ways of detecting static elements at compile time. On top of that, Moon optimizes static directives and attributes.

Moon optimizes by hoisting virtual DOM nodes. Instead of returning a new virtual DOM node with a function call, static virtual nodes are cached and reused every time. When comparing this virtual DOM with the actual DOM, Moon skips static nodes because they have the same reference.

It has a recursive method to detect static nodes. When a parent element is composed of all static children, the parent will be hoisted out of the render function, rather than the children.

#### Static Elements

Moon and Vue both detect a completely static template, and optimize by hoisting the whole virtual DOM tree out of the render function.

```html
<div>
  <h1>Static Heading</h1>
</div>
```

```js
_m(0): function anonymous() {
  with (this) {
    return _c("div", [_c("h1", [_v("Static Heading")])]);
  }
}

function render() {
  with (this) {
    return _m(0);
  }
}
```

In this case, the function `_m(0)` is created, and it returns a tree used in the render function.

```html
<div>
  <h1>Static Heading</h1>
</div>
```

```js
function render(m) {
  var instance = this;
  var staticNodes = instance.compiledRender.staticNodes;

  if (staticNodes === undefined) {
    staticNodes = instance.compiledRender.staticNodes = [
      // Static root element
      m("div", {}, {}, [m("h1", {}, {}, [m("#text", "Static Heading")])])
    ];
  }

  return staticNodes[0]; // Cached root element
}
```

The most significant difference here is the prelude of the function. At the start of every render function, Moon inserts a declaration of the static nodes of that instance.

First, this part checks if the `instance.compiledRender.staticNodes` array exists. If it doesn't, then Moon declares all of the static nodes in it. This initial step only happens _once_, and the static nodes will be reused on every subsequent render.

In this case, Moon marks the outer `div` as static and creates it once. After the initial creation, it will always return the same virtual node from `staticNodes[0]`.

#### Nested Elements

When nesting multiple elements, it is important for the compiler to hoist all of the static elements out of the render function, while only creating new nodes for the dynamic parts.

```html
<div>
  <div>
    <div>
      <p>Static</p>
    </div>
    <div>
      <p>Dynamic {{foo}}</p>
    </div>
  </div>
</div>
```

```js
_m(0): function anonymous() {
  with (this) {
    return _c("div", [_c("p", [_v("Static")])]);
  }
}

function render() {
  with (this) {
    return _c("div", [
      _c("div", [_m(0), _c("div", [_c("p", [_v("Dynamic " + _s(foo))])])])
    ]);
  }
}
```

Vue optimizes the `div` containing the static paragraph by hoisting it out of the render function into `_m(0)`.

```html
<div>
  <div>
    <div>
      <p>Static</p>
    </div>
    <div>
      <p>Dynamic {{foo}}</p>
    </div>
  </div>
</div>
```

```js
function render(m) {
  var instance = this;
  var staticNodes = instance.compiledRender.staticNodes;
  var foo = instance.get("foo");

  if (staticNodes === undefined) {
    staticNodes = instance.compiledRender.staticNodes = [
      m("div", {}, {}, [m("p", {}, {}, [m("#text", "Static")])]) // Static div
    ];
  }

  return m("div", {}, {}, [
    m("div", {}, {}, [
      staticNodes[0], // Cached div
      m("div", {}, {}, [m("p", {}, {}, [m("#text", "Dynamic " + foo)])])
    ])
  ]);
}
```

Moon does the same optimization by hoisting the `div` containing the static paragraph out of the render function.

#### Dynamic Properties

Surprisingly, when given a dynamic property, Vue ignores any static elements inside of the parent element. On the other hand, Moon detects the static element and hoists it out of the render function.

```html
<div>
  <h1>Static Heading</h1>
  <p>Dynamic Paragraph: {{foo}}</p>
</div>
```

```js
function render() {
  with (this) {
    return _c("div", [
      _c("h1", [_v("Static Heading")]),
      _c("p", [_v("Dynamic Paragraph: " + _s(foo))])
    ]);
  }
}
```

In this case, Vue did not optimize the static heading, and a new virtual node is being created and returned every time.

```html
<div>
  <h1>Static Heading</h1>
  <p>Dynamic Paragraph: {{foo}}</p>
</div>
```

```js
function render(m) {
  var instance = this;
  var staticNodes = instance.compiledRender.staticNodes;
  var foo = instance.get("foo");

  if (staticNodes === undefined) {
    staticNodes = instance.compiledRender.staticNodes = [
      m("h1", {}, {}, [m("#text", "Static Heading")]) // Static heading
    ];
  }

  return m("div", {}, {}, [
    staticNodes[0], // Cached heading
    m("p", {}, {}, [m("#text", "Dynamic Paragraph: " + foo)])
  ]);
}
```

In this case, Moon detects the static `h1` and hoists it out of the render function. After this, it is cached and referenced as `staticNodes[0]`, allowing Moon to skip it when rendering.

#### Dynamic Attributes

When given dynamic attributes, Vue does not optimize static elements. In contrast, Moon optimizes the static children elements.

```html
<div>
  <h1>Static Heading</h1>
  <p v-bind:foo="foo">Dynamic Paragraph</p>
</div>
```

```js
function render() {
  with (this) {
    return _c("div", [
      _c("h1", [_v("Static Heading")]),
      _c("p", { attrs: { foo: foo } }, [_v("Dynamic Paragraph")])
    ]);
  }
}
```

Here Vue does not optimize the static `h1` element or the static paragraph text element.

```html
<div>
  <h1>Static Heading</h1>
  <p m-literal:foo="foo">Dynamic Paragraph</p>
</div>
```

```js
function render(m) {
  var instance = this;
  var staticNodes = instance.compiledRender.staticNodes;
  var foo = instance.get("foo");

  if (staticNodes === undefined) {
    staticNodes = instance.compiledRender.staticNodes = [
      m("#text", "Dynamic Paragraph"), // Static paragraph text
      m("h1", {}, {}, [m("#text", "Static Heading")]) // Static heading
    ];
  }

  return m("div", {}, {}, [
    staticNodes[1], // Cached heading
    m("p", { attrs: { foo: foo } }, {}, [staticNodes[0]]) // Cached text
  ]);
}
```

Moon detects the static text of the paragraph and the static `h1` node. It hoists both elements out of the render function. When updating the DOM, these elements will be skipped because they have the same reference.

#### Conditionals

When conditionally rendering elements, Vue does not optimize the conditional elements at all. Moon detects static elements and hoists them out of the render function. Also, when given a static condition (although unlikely), Moon will hoist the whole condition out of the render function.

```html
<div>
  <p v-if="fooCondition">Condition True</p>
  <p v-else>Condition False</p>
</div>
```

```js
function render() {
  with (this) {
    return _c("div", [
      fooCondition
        ? _c("p", [_v("Condition True")])
        : _c("p", [_v("Condition False")])
    ]);
  }
}
```

Vue does not optimize by hoisting the static paragraphs and will recreate them on every render depending on `fooCondition`.

```html
<div>
  <p m-if="fooCondition">Condition True</p>
  <p m-else>Condition False</p>
</div>
```

```js
function render(m) {
  var instance = this;
  var staticNodes = instance.compiledRender.staticNodes;
  var fooCondition = instance.get("fooCondition");

  if (staticNodes === undefined) {
    staticNodes = instance.compiledRender.staticNodes = [
      m("p", {}, {}, [m("#text", "Condition True")]), // Static paragraph
      m("p", {}, {}, [m("#text", "Condition False")]) // Static paragraph
    ];
  }

  // Cached paragraphs
  return m("div", {}, {}, [fooCondition ? staticNodes[0] : staticNodes[1]]);
}
```

Moon marks both paragraphs as static and hoists them out of the function in `staticNodes[0]` and `staticNodes[1]`. The function returns the same paragraphs whenever the condition is evaluated.

#### Events

Lastly, Vue does not optimize on static events with `on`. This is likely done because methods and data in Vue are mutable, and they can change at any time. On the contrary, methods in Moon are immutable, and Moon's compiler can optimize them as a result.

```html
<div>
  <button v-on:click="fooMethod"></button>
</div>
```

```js
function render() {
  with (this) {
    return _c("div", [
      _c("button", {
        on: {
          click: fooMethod
        }
      })
    ]);
  }
}
```

On each render, new virtual nodes for the `div` and the `button` will be created, and Vue will update the event listeners if they changed.

```html
<div>
  <button m-on:click="fooMethod"></button>
</div>
```

```js
function render(m) {
  var instance = this;
  var staticNodes = instance.compiledRender.staticNodes;
  var fooMethod = instance.methods["fooMethod"];

  if (staticNodes === undefined) {
    staticNodes = instance.compiledRender.staticNodes = [
      m("div", {}, {}, [ // Static root element
        m(
          "button",
          {},
          {
            events: {
              click: [
                function(event) {
                  fooMethod();
                }
              ]
            }
          },
          []
        )
      ])
    ];
  }

  return staticNodes[0]; // Cached root element
}
```

After analyzing this template, Moon detected the static root element and hoisted it out of the render function. Whenever the app is rendered, the same outer `div` will be returned every time from `staticNodes[0]`.

#### Conclusion

In the end, Vue only optimizes in a few test cases, in which there were static elements inside of a static parent element. However, Moon detected many of the static elements and hoisted them out of the render function so that the static virtual nodes could be reused. This also allows for the virtual DOM engine to skip over static elements because they have the same reference on every render.
