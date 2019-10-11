import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as fs from 'fs';
import * as tmp from 'tmp';

function get_panel_webview(result: string)
{
	return `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="Content-Security-Policy" content="default-src 'none';">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>cppinsights</title>
</head>
<body>
	<pre>${result}</pre>
</body>
</html>`;
}

function display_cppinsights(type: string, code: string) {
	if (code.length == 0) {
		return;
	}
	const insightsPath = vscode.workspace.getConfiguration('cppinsights').get('insightsPath');
	if (!insightsPath) {
		vscode.window.showWarningMessage('cppinsights: Missing value for insightsPath');
		return;
	}
	tmp.file({prefix: 'cppinsights-', postfix: '.cpp', keep: false}, function (err: string, path: string) {
		if (err) {
			vscode.window.showErrorMessage('cppinsights: failed to create temp file (' + err + ')');
			return;
		}
		fs.writeFileSync(path, code);
		var child = cp.spawn(insightsPath + '', [path]);
		child.stdout.on('data', function (data: string) {
			const panel = vscode.window.createWebviewPanel(
				'cppinsights',
				'cppinsights: ' + type,
				vscode.ViewColumn.Beside,
				{}
			);
			panel.webview.html = get_panel_webview(data);
		});
		child.on('error', (err: string) => {
			vscode.window.showErrorMessage('cppinsights: failed to compile');
		});
		child.stdin.end();
	});
}

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('cppinsights.selection', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor !== undefined) {
			display_cppinsights('selection', editor.document.getText(editor.selection));
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand('cppinsights.file', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor !== undefined) {
			display_cppinsights('file', editor.document.getText());
		}
	}));
}

export function deactivate() {

}
