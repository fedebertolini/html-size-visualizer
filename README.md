# html-size-visualizer

## Description
Simple node app that parses a HTML document and creates a graph representation of the document.
Each HTML tag is represented with a node. Each node is colored depending on its sub-tree's
estimated size (in characters) using a green-red scale, red for the node with the biggest
subtree (always one of the tree roots: `<head>` or `<body>`) and green for the smallest leafs.

The graph is intended to detect possible optimizations by trimming out the biggests
sub-trees.

## Instalation
```
git clone git@github.com:fedebertolini/html-size-visualizer.git
cd html-size-visualizer
npm install
```

## Usage
To parse a local HTML file:
```
node index.js --path myFile.html
```

To parse a website's HTML:
```
node index.js --url http://www.example.com
```
