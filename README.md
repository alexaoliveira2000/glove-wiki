# Wiki Game - GloVe Algorithm

In this document I talk about a program that I developed in order to solve the "Wiki Game".

## What is the Wiki Game?
The "Wiki Game" is a game - usually played among friends - where players start on a specific Wikipedia page and, by clicking only on links within the page, must reach a specific target page. There are many variations of it, but the more common one is that the player that reaches the target page in the fewest number of clicks (number of pages) wins.

This game tests players knowledge and their ability to find connections between different subjects.

## What is "similarity"?
If we start on page "Dog" and our target page is "Paw", the path may be difficult, but in principle it's a little bit easier when compared to the target page "Table". This means there must be some kind of way to say that "Paw" is more similar to "Dog" than "Table", although this can be abstract and very difficult to quantify.

Luckily, there are ways to say "how much" a word is similar to another one, as you'll see.

## Dimensions
Imagine we have the words - "wolf", "dog", "tiger" and "cat" - and we want to compare them with one another in terms of **canine/feline** and **domestic/wild**. How can we quantify this? Look at the following Q&A:
- Q: What is more similar to the dog - wolf or cat?
  - A: They have the same similarity. Wolf is a canine (just like the dog), but the cat is a domestic animal (just like the dog). You'd say they would be at the same "distance" to the dog.
- Q: What is more similar to the tiger - wolf or dog?
  - A: Wolf is more similar to tiger than dog. The wolf is a wild animal (just like the tiger). The tiger is not similar to the dog because it is a feline and a wild animal (unlike the dog). You'd say "wolf" is closer to "tiger" than dog.

If you notice, we can quantify the similarities between words if we define **dimensions**. On this example, there are two dimensions: canine/feline and domestic/wild. You can literally draw a cartesian graph where on the X dimension you put the level of "feline", and on the Y dimension you put the level of "wild":

![image](https://github.com/alexaoliveira2000/glove-wiki/assets/77057098/df691f27-4f47-41da-bc8f-6bbeda9ac0de)

Now it's a lot easier to compare them, and you can literally quantify the similarity by the proximity of the points (distance between them). But what if we add a third dimension, for example the size of the animal? We would be drawing a third axis - Z - creating a 3D graph. This logic keeps going each time we add a new dimension (a new type of comparison between words), creating graphs with dimensions we cannot even imagine, in scales of the hundreds.

## GloVe - Global Vectors for Word Representation
GloVe is an artificial intelligence model that was trained to capture all these relationships between every word on the english alphabet. For every word, that word is analysed in hundreds of dimensions. The most popular models have this evaluation done for 200 and 300 dimensions, with a vocabulary that varies between 400k and 2 million words. What each dimension evaluates, is a complete mistery that only the AI itself knows - they don't represent specific characteristics that we normally think about.

These trained models are available on GitHub - https://github.com/stanfordnlp/GloVe. They consist of text files with all dimension values for each word. For this specific project, I used the model that was trained based on Wikipedia (Wikipedia 2014 + Gigaword 5), because it makes more sense for this specific game.
