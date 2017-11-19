(function() {

    var nodes = [];
    var edges = [];
    var idCounter = 0;
    var head = window.domTree.head;
    var body = window.domTree.body;
    var maxSize = Math.max(head.estimatedSize, body.estimatedSize);

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

    function getNodeColor(size) {
        var level = Math.floor((size - 1) / (maxSize / 8));
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
        };
    }
})()
