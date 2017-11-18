const parser = require('../../parser');

describe('parser', () => {
    it('should parse the simple html file', () => {
        const filePath = process.cwd() + '/__tests__/parser/files/simple.html';

        const domTree = parser.parseFile(filePath);
        expect(domTree).toEqual({
            root: {
                nodeType: 'tag',
                tagName: 'html',
                attributes: {},
                estimatedSize: 220,
                children: [
                    {
                        nodeType: 'tag',
                        tagName: 'head',
                        attributes: {
                            lang: 'en'
                        },
                        estimatedSize: 122,
                        children: [
                            {
                                nodeType: 'tag',
                                tagName: 'title',
                                attributes: {},
                                estimatedSize: 26,
                                children: [
                                    {
                                        nodeType: 'text',
                                        textValue: 'Simple file',
                                        estimatedSize: 11,
                                    }
                                ],
                            },
                            {
                                nodeType: 'tag',
                                tagName: 'meta',
                                estimatedSize: 73,
                                attributes: {
                                    name: 'description',
                                    content: 'This is a simple HTML document',
                                },
                                children: [],
                            }
                        ]
                    },
                    {
                        nodeType: 'tag',
                        tagName: 'body',
                        attributes: {},
                        estimatedSize: 85,
                        children: [
                            {
                                nodeType: 'tag',
                                tagName: 'h1',
                                attributes: {},
                                estimatedSize: 20,
                                children: [
                                    {
                                        nodeType: 'text',
                                        textValue: 'Simple file',
                                        estimatedSize: 11,
                                    }
                                ],
                            },
                            {
                                nodeType: 'tag',
                                tagName: 'p',
                                attributes: {},
                                estimatedSize: 37,
                                children: [
                                    {
                                        nodeType: 'text',
                                        textValue: 'This is a simple HTML document',
                                        estimatedSize: 30,
                                    }
                                ],
                            },
                            {
                                nodeType: 'text',
                                textValue: 'Some other text',
                                estimatedSize: 15,
                            }
                        ],
                    }
                ]
            }
        });
    });
});
