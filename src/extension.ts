import * as vscode from 'vscode';
const cp = require('child_process');
const tmp = require('tmp');
const fs = require('fs');

function display_cppinsights(code: string) {
	if (code.length == 0) {
		return;
	}
	tmp.file({prefix: 'cppinsights-', postfix: '.cpp', keep: false}, function (err: string, path: string) {
		if (err) {
			vscode.window.showErrorMessage('cppinsights: failed to create temp file (' + err + ')');
			return;
		}
		fs.writeFileSync(path, code);
		var child = cp.spawn(vscode.workspace.getConfiguration().get('cppinsights.insightsPath'), [path]);
		child.stdout.on('data', function (data: string) {
			const panel = vscode.window.createWebviewPanel(
				'cppinsights',
				'cppinsights',
				vscode.ViewColumn.Beside,
				{}
			);
			panel.webview.html = '<pre>' + data + '</pre>';
		});
		child.on('error', (err: string) => {
			vscode.window.showErrorMessage('cppinsights: failed to compile');
		});
		child.stdin.end();
	});
}

export function activate(context: vscode.ExtensionContext) {
	let disposable1 = vscode.commands.registerCommand('cppinsights.selection', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor !== undefined) {
			display_cppinsights(editor.document.getText(editor.selection));
		}
	});

	let disposable2 = vscode.commands.registerCommand('cppinsights.file', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor !== undefined) {
			display_cppinsights(editor.document.getText());
		}
	});

	context.subscriptions.push(disposable1);
	context.subscriptions.push(disposable2);
}

export function deactivate() {

}
