---
name: Optimal Virtual DOM
---

The virtual DOM is an idea that stems from functional programming in user interfaces. On every update new UI trees replace the current one. The problem arises, however, when this idea of an immutable, declarative view is applied in the browser.

The DOM is inherently imperative; it is updated through mutating method calls. A virtual DOM bridges the gap between declarative and imperative environments, accepting lightweight trees while mutating the DOM under the hood.

Still, a fast implementation of the virtual DOM can be a difficult task. As I've worked on [Moon](https://kbrsh.github.io/moon), I've tried many different approaches to the diffing algorithm, with the most [recent revision](https://github.com/kbrsh/moon/commit/e7a7cd9ab427be89cb7efee70df86dfe0401d770) being explained here. It's good at benchmarks because it sticks to one principle: avoiding the DOM as much as possible.

There are many ways to approach a virtual DOM implementation, each building on top of the previous one to gain better performance.

#### Replace

The simplest way of implementing a virtual DOM is based on replacing elements. A new element created from a virtual node replaces the old one.

```js
node.parentNode.replaceChild(nodeFromVNode(vnode), node);
```

This is wasteful because the DOM was not designed for large numbers of element creation, preferring granular method calls instead.

#### DOM Diff

Transforming the DOM through a diff and patch between a virtual node and the DOM allows for more precise changes. For example, updating a `className` property may check against the current state of the DOM.

```js
if (node.className !== vnode.className) {
	node.className = vnode.className;
}
```

Even so, _reading_ the DOM is bad for performance. Virtual node object property access is much faster.

#### Virtual DOM Diff

Instead of diffing against the DOM, the previous virtual DOM can be stored and used instead.

```js
if (vnodeOld.className !== vnodeNew.className) {
	node.className = vnodeNew.className;
}
```

Now, the DOM is accessed only when it is necessary — to modify it. However, when diffing against children, this means accessing `childNodes`:

```js
for (let i = 0; i < length; i++) {
	const vchildOld = vnodeOld.children[i];
	const vchildNew = vnodeNew.children[i];

	if (vchildOld !== vchildNew) {
		// Assume that `diff` takes an old virtual node, new virtual node, and a
		// DOM element to patch.
		diff(vchildOld, vchildNew, node.childNodes[i]);
	}
}
```

Even a loop using `firstChild` and `nextSibling` would still access the DOM on every iteration. This is slow. Moon gets around this by keeping track of children in a separate property on every DOM element called `MoonChildren`.

```js
for (let i = 0; i < length; i++) {
	const vchildOld = vnodeOld.children[i];
	const vchildNew = vnodeNew.children[i];

	if (vchildOld !== vchildNew) {
		diff(vchildOld, vchildNew, node.MoonChildren[i]);
	}
}
```

#### Conclusion

A diff between virtual nodes, accessing the DOM only for modification, is the fastest approach to a virtual DOM. It avoids the DOM as much as possible, favoring plain JavaScript objects instead, making reading and writing much cheaper. Combined with using constructors for virtual nodes, storing events on DOM nodes, and using a purely functional design, Moon's view driver is faster than ever before.
