(function () {

    var nodes = [];
    var edges = [];
    var idCounter = 0;
    var treeMaxSize = window.domTree.estimatedSize;
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
    var categories = colorsByLevel.map((color, i) => ({
        name: i,
        itemStyle: {
            normal: {
                color,
            }
        }
    }));

    mapNode(window.domTree);

    var chart = window.echarts.init(document.getElementById('chart'));

    option = {
        title: {
            text: ''
        },
        tooltip: {
            formatter: tooltipFormatter,
        },
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
            {
                type: 'graph',
                layout: 'force',
                symbolSize: 45,
                focusNodeAdjacency: false,
                roam: true,
                categories: categories,
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            fontSize: 12
                        },
                    }
                },
                force: {
                    repulsion: 1000
                },
                data: nodes,
                links: edges,
                lineStyle: {
                    normal: {
                        opacity: 0.9,
                        width: 2,
                        curveness: 0
                    }
                }
            }
        ]
    };

    chart.setOption(option);

    function getNodeSizeLevel(size) {
        return Math.floor((size - 1) / (treeMaxSize / 8));
    }

    function tooltipFormatter(params) {
        if (params.dataType !== 'node') return null;

        var nodeData = params.data;
        var sizePer = nodeData.estimatedSize / treeMaxSize;
        var content = 'size: ' + formatter.format(nodeData.estimatedSize);
        content += ' (' + percentFormatter.format(sizePer) + ')';

        var attributes = nodeData.attributes;
        for (attributeName in attributes) {
            if (attributes.hasOwnProperty(attributeName)) {
                content += '<br />' + attributeName + ': ' + attributes[attributeName];
            }
        }
        return content;
    }

    function mapNode(node) {
        var nodeData = getNodeData(node);
        nodes.push(nodeData);
        if (node.children && node.children.length) {
            for (var i = 0; i < node.children.length; i++) {
                var childId = mapNode(node.children[i]);
                edges.push({
                    source: nodeData.id,
                    target: childId,
                });
            }
        }
        return nodeData.id;
    }

    function getNodeData(node) {
        var id = idCounter++;
        var sizeLevel = getNodeSizeLevel(node.estimatedSize);
        return {
            id: id,
            name: node.tagName,
            draggable: true,
            category: sizeLevel,
            attributes: node.attributes,
            estimatedSize: node.estimatedSize,
        };
    }
})()
