---
name: Introducing Moon
---

I used [Vue](https://vuejs.org/) for a while, and it solved all of my problems beautifully. After a while, in late 2015, I began to notice some performance issues with my application. So I began to create something new, as a learning project. Hopefully to see how this DOM stuff actually works, and write a solution specifically for me.

After researching how Vue works under the hood, I came across [React](https://facebook.github.io/react/). It had the concept of a virtual DOM, and patching this with state updates in order to update the DOM. I also came across the fact that Vue didn’t use this idea at the time (it does now).

I began writing a simple library, not meant for anyone else to use. It was a single file, with jumbled up code, attempting to make something. I just didn’t know what it was yet.

After getting it to work, no matter what I did, it was *ridiculously slow!* So I gave up, and kept on using my slow implementation.

#### Remake

Later, I came across [Preact](https://preactjs.com/). It was game-changing, a React alternative, that was *faster*, and only in *3kb!* I read the code, it was beautiful, easy-to-read, and I learned a lot about how a UI library actually works.

So I set out to recreate what I called “Moon”. The goal was to be like Preact, but for Vue, as I preferred Vue’s API.

#### Performance

The performance of these frameworks can be so much better, but no library has it right. They all have their benefits, but still are weak in some areas. For example, library A might be good at adding items to the end of a large list, and library B might be good at adding items to the start of a large list.

There’s a [great article](http://webreflection.blogspot.co.uk/2015/04/the-dom-is-not-slow-your-abstraction-is.html) explaining why some abstractions are slow. In a nutshell, interfacing with the DOM directly is faster than an abstraction over the DOM.

Still, dealing directly with the DOM can get messy, often leading to spaghetti code if not written correctly. All libraries have their abstraction, React and Vue use a virtual DOM, the Ember team created Glimmer, and hyperHTML uses bindings between the DOM and context fragments.

These all are specific to the library, each with its’ own performance benefits and weaknesses. The question is, which library should you use?

#### Moon to the Rescue

After a couple months of development, what was originally supposed to be a library for my use, was rewritten into a library ready for anyone to mess around with.

* ⚡️ It uses a version of the virtual DOM, but intelligently marks static nodes
and skips over them, and only updates the parts of the DOM that have changed.
* 💎 It provides a beautiful API, *very similar* to Vue. Complete with directives,
reactive DOM updates, computed properties, etc.
* 🎉 It is only *6kb*!
* 🔨 It has a built in component system, allowing you to compose your UI out of
different components.

#### Benchmarks

Here are the DBMonster results (higher is better):

* Moon — 102 rerenders/second
* Preact — 85 rerenders/second
* Vue — 50 rerenders/second
* React — 50 rerenders/second

Here are the results benchmarking TodoMVC implementations (lower is better):

![Benchmark for adding 100 items, completing 100 items, and deleting 100 items](../images/introducing-moon/benchmark.png)

It adds 100 items, completes 100 items, and deletes 100 items.

#### Another One?

I know, I know, there seems to be a new Javascript framework released every day. Moon is one of them.

This doesn’t mean you have to use it, in fact, it doesn’t mean anyone has to. If you are fine with your current solution, great! Keep on grinding.

If you are starting a new project, or are looking for some performance benefits, or want a nice API, feel free to try out Moon!

#### Why so Long?

Moon, an idea that started in late 2015, is now almost production ready in early 2017. Why did it take so long?

Remember, Moon started as a learning project. At the time, I was looking
to make something for myself, without all the bloated features of popular
libraries I *didn’t need*. I also knew nothing about the DOM.

It’s amazing how much I’ve learned since then.
