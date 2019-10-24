import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as fs from 'fs';
import * as tmp from 'tmp';
var he = require('he');

function escapeHTML(html: string) {
    return html
    	.replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function getPanelWebview(result: string) {
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
    <pre>${escapeHTML(result)}</pre>
</body>
</html>`;
}

function insightsCommand(command: string, path: string) {
	var args = [];
	let languageStandardVersion:string = vscode.workspace.getConfiguration('cppinsights').get('languageStandardVersion') || "";
    if (languageStandardVersion) {
		args.push('-std=' + languageStandardVersion);
	}
	let additionalArguments: string[] = vscode.workspace.getConfiguration('cppinsights').get('additionalArguments') || [];
	additionalArguments.forEach(function(argument: string) {
		args.push(argument);
	});
	return command + ' ' + path + ' -- ' + args.join(' ');
}

function displayInsights(type: string, code: string) {
    if (code.length == 0) {
        return;
    }
    let insightsPath:string = vscode.workspace.getConfiguration('cppinsights').get('insightsPath') || "";
    if (!insightsPath) {
		vscode.window.showWarningMessage('Missing value for insightsPath');
        return;
	}
    tmp.file({prefix: 'cppinsights-', postfix: '.cpp', keep: false}, function (err: string, path: string) {
        if (err) {
            vscode.window.showErrorMessage('Failed to create temporary file (' + err + ')');
            return;
        }
        fs.writeFileSync(path, code);
        cp.exec(insightsCommand(insightsPath, path), (err, stdout, stderr) => {
            if (err) {
                vscode.window.showErrorMessage('Failed to compile insight: ' + stderr);
                return;
            }
            const panel = vscode.window.createWebviewPanel(
                'cppinsights',
                'cppinsights: ' + type,
                vscode.ViewColumn.Beside,
                {}
            );
            panel.webview.html = getPanelWebview(stdout.toString());
        });
    });
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('cppinsights.line', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor !== undefined) {
            displayInsights('line', editor.document.lineAt(editor.selection.active.line).text);
        }
    }));

    context.subscriptions.push(vscode.commands.registerCommand('cppinsights.selection', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor !== undefined) {
            displayInsights('selection', editor.document.getText(editor.selection));
        }
    }));

    context.subscriptions.push(vscode.commands.registerCommand('cppinsights.file', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor !== undefined) {
            displayInsights('file', editor.document.getText());
        }
    }));
}

export function deactivate() {

}
