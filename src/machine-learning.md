---
name: Machine learning
math: true
---

Artificial Intelligence is a topic that has been attracting a lot of interest from people lately, myself included. Around a 6 months ago, I became interested in machine learning.

I tried looking for information on the internet, but most of the articles I found included complex mathematic notations and often used a machine learning framework to show code samples. While the frameworks are great, I think it is just as important to know what exactly goes on under the hood.

This will be a series of blog posts set to help you understand how machine learning works, with a in-depth guide and code samples. The code samples will use Python, with NumPy. NumPy allows for complex math operations to be extremely simple in code, and is not specifically for machine learning. We will be using it for matrix multiplication, dot products, etc.

#### What is Machine Learning?

Machine learning essentially allows for a machine to learn patterns between certain items without any of it having to be hard-coded or specified. The machine itself learns these patterns as it trains.

The flexibility of machine learning allows it to be used for a variety of topics. They are used to solve problems such as **classification** and **regression** problems.

I'll use an example of emails and spam to explain these two types of problems.

Classification problems are problems in which an input is taken in, and it is classified into a certain group.

![Classification Visual](../images/machine-learning/classification.svg)

Regression problems are problems in which an input is taken in, and there is an output that doesn't correspond to a group.

![Regression Visual](../images/machine-learning/regression.svg)

There are also **two main types of learning** methods: supervised and unsupervised.

Supervised learning is when you have a set of inputs and outputs, and you train the machine on that. Unsupervised learning is when you only have a set of inputs, and you train the machine to find patterns between them. Essentially, machine learning is the process of a machine finding the relationship between inputs and outputs.

#### Feedforward Neural Networks

One method of machine learning is to use a **Feedforward Neural Network**. They work by:

* Taking an input
* Multiplying the input by a certain set of weights
* Applying an **activation function**
* Returning an output

![Feedforward Neural Network](../images/machine-learning/FeedForwardNeuralNetwork.svg)

Those **weights** are where the magic happens. The neural network has to find the perfect set of weights to get the desired output, after starting with a random set of weights. The act of multiplying the inputs by the weights to form an output is **forward propagation**, as you are moving the inputs through the network. The activation function is just a function that can squash a value between a certain range, it introduces **nonlinearity** into the model.

Throughout this article, `$X$` refers to the input, `$W_h$` refers to the weight(s), and `$b_h$` refers to the bias (we will get to this later).

Let's use a simple example, with a single input, single weight, and single output. The neural network will be extremely simple:

```math
X W_h
```

That's it! A neural network in a simple multiplication problem, we take the input, multiply it by the weight, and get an output. Now this weight can only adapt to represent a certain **feature** of the relationship between the input and output, so we need to add more. To do this, we use vectors. We can use them to represent multiple inputs and outputs as well. We will still be doing the same thing, but using more numbers.

Instead of multiplying, our weights and inputs can have different dimensions, so we use a **dot product**. Getting a dot product of a vector with another vector will lead to a new vector with the same number of rows as the first vector, and the same number of columns as the second.

Basically, the dot product performs the multiplication while transforming the shape of the input into the shape of the output.

Our activation function is used to make things nonlinear.

With all of that, we have the basic forward propagation of a feedforward neural network, which is represented in math as:

```math
activation((X W_h) + b_h)
```

#### Back Propagation

We multiplied some numbers, so what?

The output can be random if our weight is random, which means our network isn't really learning anything, it's just returning an output for each input. It doesn't adjust anything to try and improve the output to match the expected one.

How can we change the output? One thing we can do is change the input itself, but we don't have control over that, so we just have to change the weights.

First, we need a way to see how far off our network was. We can do that by using a **loss function**. We'll use the **mean sum squared** loss function, represented mathematically as:

```math
l(o, y) = \sum 0.5(o - y)^2
```

Where `o` is the output of our network, and `y` is the target output. All this does is take the output and expected output, and gives us a representation of how far off each part in the output is. We use this function to see how good the network is performing.

The goal is for our network to get the loss to equal 0, meaning the weights used map all of the inputs to the outputs correctly.

You might think that the best way doing this is to try all of the possible weights until we get a good result. While that might work for extremely small networks, when you get hundreds of thousands of weights, it may take _years_ to compute.

Instead of that, what if we could track exactly what the weights should change by to decrease the loss? That is what a **derivative** is for.

We can find the derivative of the loss function with respect to the weights. This allows us adjust the weights in the correct way in order to lower the loss.

Let's visualize this by graphing a range of weights and their corresponding loss.

![Weight to Loss Visual](../images/machine-learning/weightToLoss.svg)

If we find the derivative of the loss function with respect to the weights, we can find our way downhill from where we are, and move a little closer to our goal: having a loss of 0.

First, let's go through an example of how a derivative works.

For simplicity, let's have a simple function that takes some input `X` and returns it multiplied by a weight `w`.

```math
f(X, w) = Xw
```

The derivative of this function with respect to the weight is:

```math
\frac{\partial f}{\partial w} = X
```

We need to find the effect the weight has on `X`. Let's use a weight of `5`, and an input of `2`. If we plug it into the derivative function, we get `2` as a result.

That means that if we change the weights by one, then the output of the function will increase by `2`, and it does!

Now, we have to do the same thing, but for our loss function, with respect to our weights. This gives us a **gradient** of how much our loss will _increase_ based on how we change our weights. A gradient is basically the derivative of all of the inputs in a vector. All we have to do after that, is _decrease_ our weights by the gradient, and we will decrease the loss!

Let's find the partial derivative of the loss function with respect to some weights.

```math
\frac{\partial l}{\partial w}
```

If we use the chain rule, we get:

```math
\frac{\partial l}{\partial w} = \frac{\partial l}{\partial o} * \frac{\partial o}{\partial h} * \frac{\partial h}{\partial w}
```

Let's find all parts of the equation:

```math
\frac{\partial l}{\partial o} = o - y\\
\frac{\partial o}{\partial h} = \frac{e^{-o}}{\left(1\ +e^{-o}\right)^2}\\
\frac{\partial h}{\partial w} = X^\intercal
```

We can multiply all of them, and we'll have the gradients! Now we'll know exactly what will happen as a result of updating our weights in a certain direction, and can push them into the direction that makes the loss function zero.

#### The Problem (Coming Soon)

#### The Code (Coming Soon)

#### Conclusion

This article is a work in progress. Feel free to give any suggestions or fixes.
