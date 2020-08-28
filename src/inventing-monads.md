---
name: Inventing monads
---

Monads are an esoteric concept to many, resulting in hundreds of tutorials, guides, and examples attempting to explain them. Curious developers might look into them only to find the classic answer, "Monads are monoids in the category of endofunctors". In the end, they're just another abstraction to help deal with repetitive patterns in functional code.

This guide will use JavaScript instead of a pure functional programming language (e.g. Haskell) to make things more approachable for developers accustomed to imperative languages. It will, however, assume you have basic knowledge of functional programming, including currying and lambdas.

Think of monads as a way to overload a semicolon. It might sound a little crazy at first, but imagine being able to override the semicolon to reduce boilerplate in specific code blocks. That's basically how monads are used in practice.

As a final note before we start, I am by no means an expert on this topic. I'm fifteen years old with good knowledge of mostly high school level math, and may have missed some parts. Monads are complex and closely tied with category theory, which is a very abstract and vast branch of mathematics that can be hard to grok. If I missed something, feel free to reach out and let me know — I'm always open to learning something new.

#### Blocks

First, many languages have a pattern that allows for creating a set of bindings and then a value based on it. In JavaScript, this is accomplished with a self-invoking function. They can also be transformed into a recursive structure of function calls with variable values. Being explicit about composing functions in this way can help clarify how exactly monads can modify the flow of a program.

For example, the following block of code:

```js
const middleName = (() => {
	const id = getId ();
	const user = getUser (id);
	return getMiddleName (user);
})();
```

Can be represented as:

```js
const apply = x => f => f (x);
const middleName = apply (getId()) (id =>
	apply (getUser(id)) (user =>
		getMiddleName(user)
	)
);
```

It's a dense representation, but they are equivalent. Note that functions are called with a space between the name and opening parenthesis, this isn't common syntax but it's valid JavaScript. It's there to simulate "call by juxtaposition" syntax in languages like Haskell, where functions are called with `f x y z`. But instead of calling them like you normally would in JavaScript with `f(x)(y)(z)`, we call them with `f (x) (y) (z)`.

This functional version of blocks works by breaking them down into two parts:

```js
const middleName = (() => {
	const id = getId ();
	return (() => {
		const user = getUser (id);
		return getMiddleName (user);
	})();
})();
```

Instead of having everything in the same block, we define a "block" simply as a value based on a variable. In the outer block, the `id` is the variable, and the value is a function of the `id`. In this case, the value is another block, where `user` is the variable and the value is a function of the user.

#### Null Everywhere

Revisiting the previous example, the code might look like this:


```js
const apply = x => f => f (x);
const middleName = apply (getId()) (id =>
	apply (getUser(id)) (user =>
		getMiddleName(user)
	)
);
```

It's clean enough, right? Now imagine if `id` could be `null`, `user` could be `null`, or `middleName` could be `null`. The utility functions will all end up looking like this:

```js
// Simulate the fetching of an ID.
const getId = () => {
	const random = Math.floor(Math.random() * 1000);

	return random < 700 ? random : null;
};

// Simulate the fetching of a user.
const getUser = id => {
	if (id === null) {
		return null;
	} else {
		return {
			first: "John",
			last: "Doe",
			middle: Math.random() < 0.7 ? "Bob" : null
		};
	}
};

// Simulate the fetching of a middle name.
const getMiddleName = user => {
	if (user.middle === null) {
		return null;
	} else {
		return user.middle;
	}
};
```

Every utility function has to check and handle `null` values, and has the possibility of returning `null` as well. But what if we checked for it automatically?

Once again, the functional version of the block would look like this:

```js
const apply = x => f => f (x);
const middleName = apply (getId()) (id =>
	apply (getUser(id)) (user =>
		getMiddleName(user)
	)
);
```

Looking at this, we can find a pattern: every `apply` takes a nullable value as input and applies it to a function. This function always returns another nullable value, and by extension `apply` needs to also return a nullable value because it may be used within the function itself. Instead of handling `null` within each function, `apply` can handle it.

```js
const apply = x => f => x === null ? null : f (x);
```

Since the inputs can be `null`, it checks and returns `null` whenever the input is `null`. If not, it passes `x` to the function. It treats the function as a black box that can return anything, but assumes that it takes a non-null value as input. Since `apply` itself will have a nullable value as input, it handles the `null` case and then passes any real values into the function. Now, the full the code will look like this:

```js
// Simulate the fetching of an ID.
const getId = () => {
	const random = Math.floor(Math.random() * 1000);

	return random < 700 ? random : null;
};

// Simulate the fetching of a user.
const getUser = id => ({
	first: "John",
	last: "Doe",
	middle: Math.random() < 0.7 ? "Bob" : null
});

// Simulate the fetching of a middle name.
const getMiddleName = user => user.middle;

// Get the middle name, if it exists.
const apply = x => f => x === null ? null : f (x);
const middleName = apply (getId()) (id =>
	apply (getUser(id)) (user =>
		getMiddleName(user)
	)
);

console.log(middleName);
// 49% => "Bob", 51% => null
```

#### Logging

Keeping the same example, let's say we want to keep track of log messages. In a functional language, you can't modify a global variable to keep track of all of the messages. Instead, each function can return an output along with a log message.

```js
const getId = () => [7, "Got an id of 7."];
const getUser = id => [{
	first: "John",
	last: "Doe",
	middle: "Bob"
}, id[1] + " Got a user with name John Bob Doe."];
const getMiddleName = user => [user[0].middle, user[1] + " Got the middle name of a user."];

const apply = x => f => f (x);
const middleName = apply (getId()) (id =>
	apply (getUser(id)) (user =>
		getMiddleName(user)
	)
);
```

This is messy, and we had to modify the utility functions in order to handle the incoming array input. Instead, we can change the `apply` function to propagate the log for us. In this case, the inputs to `apply` always have the structure of `[output, log]`. However, we want the function `f` to only receive the output. Unlike the previous example, we will now assume that `f` returns the same `[output, log]` pair. Since `f` can return the output of _another_ `apply`, we need to return the same type from `apply`.

```js
const apply = x => f => {
	const result = f (x[0]);
	return [result[0], x[1] + " " + result[1]];
};
```

Since everything has the same array type, we take it as an input. Instead of passing the log to the function though, we only pass the output of the value `x[0]` to the function `f`. We assume that this function will return its own output and log. Since this function can return the output of `apply`, we return a new pair with the function output along with the combined logs.

The full code will then be much simpler, and doesn't include anything related to the previous log message in the utility functions:

```js
// Get various data from a user.
const getId = () => [7, "Got an id of 7."];
const getUser = id => [{
	first: "John",
	last: "Doe",
	middle: "Bob"
}, "Got a user with name John Bob Doe."];
const getMiddleName = user => [user.middle, "Got the middle name of a user."];

// Get the middle name along with logs.
const apply = x => f => {
	const result = f (x[0]);
	return [result[0], x[1] + " " + result[1]];
};
const middleName = apply (getId()) (id =>
	apply (getUser(id)) (user =>
		getMiddleName(user)
	)
);

console.log(middleName);
// => ["Bob", "Got an id of 7. Got a user with name John Bob Doe. Got the middle name of a user."]
```

#### Global Environment

Let's say we have a global object fetched from somewhere, and it holds data for a user.

```js
{
	id: 7,
	first: "John",
	last: "Doe"
}
```

Along with that, we have a calculation based on this environment.

```js
const getInitials = environment => environment.first[0] + environment.last[0];
const getName = initials => environment => `${initials} ${environment.first} ${environment.last}`;
const getIdentity = name => environment => environment.id.toString() + " " + name;

const apply = x => f => f (x);
const identity = apply (getInitials (environment)) (initials =>
	apply (getName (initials) (environment)) (name =>
		getIdentity (name) (environment)
	)
);
```

In this case, every single function requires the `environment` as an input. What if we made that implicit?

```js
const getInitials = environment => environment.first[0] + environment.last[0];
const getName = initials => environment => `${initials (environment)} ${environment.first} ${environment.last}`;
const getIdentity = name => environment => environment.id.toString() + " " + name (environment);

const apply = x => f => f (x);
const identity = apply (getInitials) (initials =>
	apply (getName (initials)) (name =>
		getIdentity (name)
	)
);
```

It looks nicer, but the utility functions had to change. They now have to call their first argument with the environment in order to get their true value. However, `apply` can make some assumptions in this case. It can assume that every input is a _function of the environment_, and every function takes a value and returns another function of the environment.

We can solve this problem using `apply`. Every input `x` is a function of the environment, but it would be nice if given function `f` could expect the _output_ of `x`. How can we get the output out of `x`? We need to pass it the environment, so we can return a _new function_ that depends on the environment and calls `x`. Now it can pass the output to `f` as it expects. Since `f` is also a function of the environment, we can call it with our given environment and finally return the result.

```js
const apply = x => f => environment => f (x (environment)) (environment);
```

It's a little confusing, but `apply` uses the assumptions to its advantage. First of all, it returns a function of the environment. This function applies the environment to the input `x`, and passes it to `f`. Since we assume `f` returns another function of the environment, we apply it with the given environment _again_ and return its output.

With that, the final code looks like:

```js
// Utility functions to return calculations based on an environment.
const getInitials = environment => environment.first[0] + environment.last[0];
const getName = initials => environment => `${initials} ${environment.first} ${environment.last}`;
const getIdentity = name => environment => environment.id.toString() + " " + name;

// Get the identity of the environment user.
const apply = x => f => environment => f (x (environment)) (environment);
const identity = apply (getInitials) (initials =>
	apply (getName (initials)) (name =>
		getIdentity (name)
	)
);

// Since `identity` is a function of an environment, we can pass it any environment.
console.log(identity ({
	id: 7,
	first: "John",
	last: "Doe"
}));
// => 7 JD John Doe
```

#### Passing State

Let's say we have a state for holding the seed of a random number generator.

```js
7
```

In pure functional languages, there is no concept of mutation, only pure functions. However, for things like random number generation, there is often a seed that is kept track of as state. It needs to be sent around so that the next number and seed can be generated from it. We can write a block like this:

```js
const getRandom = state => {
	const result = 7 * state + 7;
	return [result % 100, result];
};

const getSum = x => y => state => {
	const xResult = x (state);
	const yResult = y (xResult[1]);
	return [xResult[0] + yResult[0], yResult[1]];
};

const apply = x => f => f (x);
const sum = apply (getRandom) (random1 =>
	apply (getRandom) (random2 =>
		getSum (random1) (random2)
	)
);
```

In this example, every value is a function of state that returns and output along with new state. It's not the best code though, because `getSum` has to call both of its arguments with the state in order to get their value, then it has to correctly manage the latest state and return it.

However, `apply` can assume that every input is a _function of state that returns output and new state_. It can also assume that the function takes only an output value and returns another function of state.

Using these assumptions, it would be nice if the function `f` could expect only the output portion of `x`'s return value. To get `x`'s output, we need to call it with the state, so we can return a new function of state. Within this function, we can pass `x` the state and get an output along with new state. Now we can supply `f` the output, and since `f` returns a function of state, we can call it again with the new state returned by `x`. Finally, we can return this result.

```js
const apply = x => f => state => {
	const result = x (state);
	return f (result[0]) (result[1]);
};
```

It's elegant, but dense. Since the output of the given function is assumed to be another function of state, `apply` starts by returning a new function of state. This function calls the input `x` with the state to get an output along with new state. It passes the output to `f`, which expects just the output of `x` as its input. Since `f` returns another function of state, it calls it again with the new state returned by `x`.

The full code looks like:

```js
// Utility functions for number manipulation.
const getRandom = state => {
	const result = 7 * state + 7;
	console.log("Random number: " + (result % 100)); // Log random numbers for debugging.
	return [result % 100, result];
};

const getSum = x => y => state => [x + y, state];

// Generate the sum of two random numbers.
const apply = x => f => state => {
	const result = x (state);
	return f (result[0]) (result[1]);
};

const sum = apply (getRandom) (random1 =>
	apply (getRandom) (random2 =>
		getSum (random1) (random2)
	)
);

console.log(sum (7));
// => Random number: 56
// => Random number: 99
// => [155, 399]
```

#### Conclusion

You'll notice how I didn't mention monads throughout the examples. That's because the code was just written using a natural abstraction, and that abstraction was the `apply` function, which applied functions that made up do-blocks in special ways. The truth is, we just implemented four different monads:

1. Null Everywhere - `Maybe` Monad - Assumed `x: nullable` and `f: nullable -> any`
2. Logging - `Writer` Monad - Assumed `x: [any, string]` and `f: any -> [any, string]`
3. Global Environment - `Reader` Monad - Assumed `x: environment -> any` and `f: any -> environment -> any`
4. Passing State - `State` Monad - Assumed `x: state -> [any, state]` and `f: any -> state -> [any, state]`

The monad itself is a triple of a type constructor, a type converter, and a type combinator.

The type constructor is just a way of defining the type of value that stayed constant throughout the do-blocks. For example, the `Maybe` monad type constructor returns `T | null`, and the `State` monad type constructor returns `state -> [output, state]`.

The type converter is a way of creating a "unit" value of the type. For example, the `Writer` monad type converter is `const unit = x => [x, ""]`. It wraps any value within a `Writer` type that includes the value along with an empty log. We didn't cover these much to reduce the complexity of getting started.

The type combinator is another name for our `apply` function, with a signature of `m -> (any -> m) -> m`. It basically means that it accepts an input with the type constructor of a monad and a function that returns the same type. Using these two, it returns an output with the same type. This is commonly named `bind`.

Together, the three of these form a monad. Think of it like this: a do-block can be split into recursive `apply` calls. If we make assumptions that every input is a certain type, then `apply` can transform the input before applying it to the function. If we make assumptions that the function outputs a certain type, then `apply` can transform the output of the function to combine it with the original input. Basically, it can return whatever it wants using the given input and function. To make this even more useful, `apply` can return the same type that it assumes the function will return. This allows the function to use `apply` within itself.

Some other great resources on monads include:

* [You Could Have Invented Monads! (And Maybe You Already Have.)](http://blog.sigfpe.com/2006/08/you-could-have-invented-monads-and.html)
* [Functors, Applicatives, And Monads In Pictures](http://adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html)
* [Three Useful Monads](http://adit.io/posts/2013-06-10-three-useful-monads.html)
* <a href="https://en.wikipedia.org/wiki/Monad_(functional_programming)">Monad (functional programming)</a>

In the end, the monad is just an abstraction that has access to the inner workings of block expressions, giving it control over how things flow from input to function.
