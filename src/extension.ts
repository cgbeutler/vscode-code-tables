'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('decorator sample is activated');

	// create a decorator type that we use to decorate large numbers
	const tabDecorationType = vscode.window.createTextEditorDecorationType({
        letterSpacing: '-1em',
        opacity: '0'
	});

	let activeEditor = vscode.window.activeTextEditor;
	if (activeEditor) {
		triggerUpdateDecorations();
	}

	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	var timeout: NodeJS.Timer | null = null;
	function triggerUpdateDecorations() {
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(updateDecorations, 500);
	}

	function updateDecorations() {
		if (!activeEditor) {
			return;
        }
        const tabLineRegEx = /(?:.*\t.*(?:\r?\n|$))+/g;
		const text = activeEditor.document.getText();
        const tabLines: vscode.DecorationOptions[] = [];
        let match;
        while (match = tabLineRegEx.exec(text)) {
            var lineCols = match[0].replace(/\r/g, "").split("\n").filter(l => l.length > 0)
                .map(l => l.split("\t"));
            var colLines = lineCols[0].map((_, i) => lineCols.map(row => row[i]));
            var colSizes = colLines.map(col => col.reduce((p, c) => p.length > c.length ? p : c).length);

            const tabOrNewLineRegEx = /(?:(.*?)(\t|\n|\r\n))/g;
            let subMatch;
            let currentColumn = 0;
            while (subMatch = tabOrNewLineRegEx.exec(match[0])) {
                if (subMatch[2] === "\n" || subMatch[2] === "\r\n") {
                    currentColumn = 0;
                } else {
                    var padding = "_".repeat(colSizes[currentColumn] - subMatch[1].length);
                    var tabIndex = match.index + subMatch.index + subMatch[1].length;
                    var startPos = activeEditor.document.positionAt(tabIndex);
                    var endPos = activeEditor.document.positionAt(tabIndex + 1);
                    tabLines.push({
                        range: new vscode.Range(startPos, endPos),
                        renderOptions: {
                            after: {contentText: padding + "|", color: "rgba(127,127,127,0.0)"},
                        }
                    });
                    currentColumn++;
                }
            }
        }
		activeEditor.setDecorations(tabDecorationType, tabLines);
	}
}

// this method is called when your extension is deactivated
export function deactivate() {
}
