(function () {

    var nodes = [];
    var edges = [];
    var childrenData = new Map(); //holds nodes' children info for restoration
    var idCounter = 0;
    var head = window.domTree.head;
    var body = window.domTree.body;
    var treeMaxSize = head.estimatedSize + body.estimatedSize;
    var subTreeMaxSize = Math.max(head.estimatedSize, body.estimatedSize);
    var formatter = new Intl.NumberFormat('en-US');
    var percentFormatter = new Intl.NumberFormat('en-US', {
        style: 'percent',
        maximumFractionDigits: 2,
    });

    var colorsByLevel = [
        '#00c853',
        '#64dd17',
        '#aeea00',
        '#eeff41',
        '#ffeb3b',
        '#ffc107',
        '#ff9800',
        '#bf360c',
    ];

    mapNode(window.domTree.head);
    mapNode(window.domTree.body);

    var cy = window.cy = cytoscape({
        container: document.body,
        boxSelectionEnabled: false,
        autounselectify: true,
        elements: {
            nodes: nodes,
            edges: edges,
        },
        style: [{
            selector: 'node',
            style: {
                'content': 'data(name)',
                'text-opacity': 0.5,
                'text-valign': 'center',
                'text-halign': 'center',
                "font-size": "10px",
                'background-color': 'data(color)'
            }
        }, {
            selector: 'edge',
            style: {
                'curve-style': 'bezier',
                'width': 1,
                'target-arrow-shape': 'triangle',
                'line-color': 'data(color)',
                'target-arrow-color': 'data(color)'
            }
        }],

        layout: {
            name: 'dagre'
        },
    });

    for (var x = 0; x < nodes.length; x++) {
        var curNode = cy.$('#' + nodes[x].data.id);
        var id = curNode.data('id');
        //get its connectedEdges and connectedNodes
        var connectedEdges = curNode.connectedEdges(function () {
            //filter on connectedEdges
            return !curNode.target().anySame(curNode);
        });
        var connectedNodes = connectedEdges.targets();
        childrenData.set(id, {
            data: connectedNodes.union(connectedEdges),
        });
    }

    cy.on('tap', 'node', function () {
        var nodes = this;
        var id = nodes.data('id')

        if (childrenData.get(id).removed == true) {
            childrenData.get(id).data.restore();
            childrenData.get(id).removed = false;
        } else {
            recursivelyRemove(id, nodes);
        }
    });

    cy.ready(function () {
        bindPopovers(nodes);
    });

    function getNodeSizeLevel(size) {
        return Math.floor((size - 1) / (subTreeMaxSize / 8));
    }

    function getNodeColor(level) {
        return colorsByLevel[level];
    }

    function mapNode(node) {
        var nodeData = getNodeData(node);
        nodes.push({
            data: nodeData,
        });
        if (node.children && node.children.length) {
            for (var i = 0; i < node.children.length; i++) {
                var childId = mapNode(node.children[i]);
                edges.push({
                    data: {
                        source: nodeData.id,
                        target: childId,
                        color: nodeData.color,
                    },
                });
            }
        }
        return nodeData.id;
    }

    function getNodeData(node) {
        var id = ++idCounter;
        var sizeLevel = getNodeSizeLevel(node.estimatedSize);
        var color = getNodeColor(sizeLevel);
        var name = node.tagName;
        if (node.attributes.id) {
            name += '#' + node.attributes.id;
        }
        return {
            id: id,
            name: name,
            color: color,
            sizeLevel: sizeLevel,
            popoverContent: getPopoverContent(node),
        };
    }

    function getPopoverContent(node) {
        var sizePer = node.estimatedSize / treeMaxSize;
        var content = 'size: ' + formatter.format(node.estimatedSize);
        content += ' (' + percentFormatter.format(sizePer) + ')';

        var attributes = node.attributes;
        for (attributeName in attributes) {
            if (attributes.hasOwnProperty(attributeName)) {
                content += '<br />' + attributeName + ': ' + attributes[attributeName];
            }
        }
        return content;
    }

    function bindPopovers(nodes) {
        for (var i = 0; i < nodes.length; i++) {
            var nodeData = nodes[i].data;

            cy.$('#' + nodeData.id).qtip({
                content: nodeData.popoverContent,
                position: {
                    my: 'top center',
                    at: 'bottom center'
                },
                show: {
                    event: 'mouseover'
                },
                hide: {
                    event: 'mouseout'
                },
                style: {
                    classes: 'qtip-bootstrap',
                    tip: {
                        width: 16,
                        height: 8
                    }
                }
            });
        }
    }

    function recursivelyRemove(id, nodes) {
        var toRemove = [];
        for (;;) {
            nodes.forEach(function (node) {
                childrenData.get(node.data('id')).removed = true;
            });

            var connectedEdges = nodes.connectedEdges(function (el) {
                //getting connectedEdges from all the nodes that only go down the tree
                //aka not keeping edges where their target is a node in the current group of nodes
                return !el.target().anySame(nodes);
            });

            var connectedNodes = connectedEdges.targets();
            Array.prototype.push.apply(toRemove, connectedNodes);
            nodes = connectedNodes;

            if (nodes.empty()) {
                break;
            }
        }
        for (var i = toRemove.length - 1; i >= 0; i--) {
            toRemove[i].remove();
        }
    }
})()
