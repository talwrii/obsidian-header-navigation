import { Editor, MarkdownView, Plugin, EditorPosition } from 'obsidian';

import { remark } from 'remark';

interface RemarkPosition {
    line: number,
    column: number,
    offset: number,
}

const parseRemarkPos = (p: RemarkPosition) => {
    return { line: p.line - 1, ch: p.column }
}

export default class HeaderNavPlugin extends Plugin {
    async onload() {
        this.addCommand({
            id: 'header-navigation-back',
            name: 'Jump back to heading',
            editorCallback: (editor: Editor, view: MarkdownView) => {
                this.backToHeading(editor)
            }
        });

        this.addCommand({
            id: 'header-navigation-forward',
            name: 'Jump to next heading at the same level',
            editorCallback: (editor: Editor, view: MarkdownView) => {
                this.forwardHeading(editor)
            }
        });

        this.addCommand({
            id: 'header-navigation-toggle-fold',
            name: 'Toggle header folding',
            editorCallback: (editor: Editor, view: MarkdownView) => {
                this.toggleFold(editor)
            }
        });

        this.addCommand({
            id: 'header-navigation-backward',
            name: 'Jump to previous heading at the same level',
            editorCallback: (editor: Editor, view: MarkdownView) => {
                this.backwardHeading(editor)
            }
        });

        this.addCommand({
            id: 'header-navigation-parent',
            name: 'Jump to parent heading',
            editorCallback: (editor: Editor, view: MarkdownView) => {
                this.upHeading(editor)
            }
        })

        this.addCommand({
            id: 'header-navigation-child',
            name: 'Jump to the first child of current header',
            editorCallback: (editor: Editor, view: MarkdownView) => {
                this.firstChild(editor)
            }
        })
    }



    backToHeading(editor: Editor) {
        // Go back to a heading
        const tree = this.getTree(editor)
        const point = this.findHeadingBefore(editor, tree, editor.getCursor())
        if (point) {
            editor.setCursor(point)
        }
    }

    forwardHeading(editor: Editor) {
        // Go forward to the next heading of the same depth
        const depth = this.depth(editor, editor.getCursor().line)
        const tree = this.getTree(editor)
        const point = this.findHeadingAfter(editor, tree, editor.getCursor(), depth)
        if (point) {
            editor.setCursor(point)
        }
    }

    backwardHeading(editor: Editor) {
        //"Go backward to heading of the same depth
        const depth = this.depth(editor, editor.getCursor().line)
        const tree = this.getTree(editor)
        const point = this.findHeadingBefore(editor, tree, editor.getCursor(), depth)
        if (point) {
            editor.setCursor(point)
        }
    }

    upHeading(editor: Editor) {
        // Go up heading
        const depth = this.depth(editor, editor.getCursor().line)
        const tree = this.getTree(editor)
        const point = this.findHeadingBefore(editor, tree, editor.getCursor(), depth - 1)
        if (point) {
            editor.setCursor(point)
        }
    }

    findHeadingBefore(editor: Editor, tree: Object, position: EditorPosition, depth?: number): EditorPosition | undefined {
        // In a remark tree, find the header before this posiition
        let before: EditorPosition | undefined = undefined;
        const headings = this.flatHeadings(tree)
        headings.forEach((p) => {
            if (p.line < position.line) {
                const p_depth = this.depth(editor, p.line)

                if (depth === undefined || p_depth === depth) {
                    before = p
                }
            }
        });
        return before
    }

    findHeadingAfter(editor: Editor, tree: Object, position: EditorPosition, depth?: number) {
        // In a remark tree, find the header after this posiition
        // with an optional depth
        let after: any = undefined
        const headings = this.flatHeadings(tree)
        headings.forEach((p) => {
            if (p.line > position.line) {
                const p_depth = this.depth(editor, p.line)

                if (depth === undefined || p_depth === depth) {
                    after = after || p
                }
            }
        });
        return after
    }

    flatHeadings(tree: any): Array<EditorPosition> {
        let result = []
        if (tree.type == "heading") {
            result.push(parseRemarkPos(tree.position.start))
        }
        for (let i = 0; i < (tree.children || []).length; i++) {
            let child = tree.children[i]
            result.push(...this.flatHeadings(child))
        }
        return result
    }


    firstChild(editor: Editor) {
        //"Go backward to heading of the same depth
        const depth = this.depth(editor, editor.getCursor().line)
        const tree = this.getTree(editor)
        const point = this.findHeadingAfter(editor, tree, editor.getCursor())

        // @ts-ignore
        if (depth && point && (this.depth(editor, point.line) > depth)) {
            editor.setCursor(point)
        }
    }

    pointMax(editor: Editor): EditorPosition {
        const lastLine = editor.lastLine()
        const lastChar = editor.getLine(lastLine).length
        return { line: lastLine, ch: lastChar }
    }


    toggleFold(editor: Editor): void {
        const line = editor.getCursor().line
        if (this.lineFolded(editor, line)) {
            //@ts-ignore
            this.app.commands.executeCommandById("editor:fold-less")
        } else {
            //@ts-ignore
            this.app.commands.executeCommandById("editor:fold-more")
        }
    }

    lineFolded(editor: Editor, line: number): boolean {
        // This seems to be a "secret" api
        // @ts-ignore
        const offsets = editor.getFoldOffsets()

        for (const offset of offsets) {
            const pos = editor.offsetToPos(offset)
            if (pos.line == line) {
                return true
            }
        }
        return false
    }


    depth(editor: Editor, line: number): number | undefined {
        // Find the header depth of a line
        const content = editor.getLine(line)

        for (let i = 0; i < content.length; i++) {
            if (content[i] != "#") {
                break
            }
        }

        if (i === 0) {
            return undefined
        } else {
            return i;
        }
    }

    getTree(editor: Editor): Object {
        const body = editor.getRange({ line: 0, ch: 0 }, this.pointMax(editor))
        return remark.parse(body)
    }

}
