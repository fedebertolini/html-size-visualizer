(function() {

    var nodes = [];
    var edges = [];
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

    cy.ready(function() {
        bindPopovers(nodes);
    });

    cy.on('tap', 'node', function(evt){
        var node = evt.target;
        var edges = cy.edges().filter(e => e.source().id() === node.id());
        edges.forEach(e => {
            if (e.target().hidden()) {
                e.target().show();
            } else {
                e.target().hide();
            }
        });
    });

    function getNodeColor(size) {
        var level = Math.floor((size - 1) / (subTreeMaxSize / 8));
        return colorsByLevel[level];
    }

    function mapNode(node) {
        var nodeData = getNodeData(node);
        nodes.push({
            data: nodeData,
        });
        if (node.children && node.children.length) {
            for(var i = 0; i < node.children.length; i++) {
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
        var color = getNodeColor(node.estimatedSize);
        var name = node.tagName;
        if (node.attributes.id) {
            name += '#' + node.attributes.id;
        }
        return {
            id: id,
            name: name,
            color: color,
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
})()
