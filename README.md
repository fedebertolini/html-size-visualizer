# html-size-visualizer

## Description
Simple CLI that parses a HTML document and creates a graph representation of the document.
Each HTML tag is represented with a node. Each node is colored depending on its sub-tree's
estimated size (in characters) using a green-red scale, red for the node with the biggest
subtree (always the root `<html>` tag) and green for the smallest leafs.

The graph is intended to detect possible optimizations by trimming out the biggests
sub-trees.

Example:
![Example](https://github.com/fedebertolini/html-size-visualizer/raw/master/Screenshot.png)

## Installation
```
npm -g html-size-visualizer
```

## Usage
The CLI requires only one argument: either a URL or a local file path.

To parse a local HTML file:
```
html-size-visualizer myFile.html
```

To parse a website's HTML:
```
html-size-visualizer http://www.example.com
```
