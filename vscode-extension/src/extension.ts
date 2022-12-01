// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import { join } from 'path';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "borescope" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerTextEditorCommand('borescope.inspectvar', async editor => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		//let path = await viewImageSvc.ViewImage(editor.document, editor.selection);
		
		const selectedVariable = editor.document.getText(editor.document.getWordRangeAtPosition(editor.selection.start));
		const session = vscode.debug.activeDebugSession;
		if (session === undefined) {
			return;
		}

		let pycodeSerialize = fs.readFileSync(context.extensionPath + '/src/serialize.py').toString('base64');

		//let res = await session.customRequest("evaluate", { expression: "exec(\"import numpy as np\") or eval(\"np.array([1.0, 1.2])\")", frameId: 2, context:'hover' });
		
		var expression = `exec(\"from base64 import b64decode\") or exec(b64decode(\"${pycodeSerialize}\")) or eval(\"np.array([1.0, 1.2])\")`;
		let res = await session.customRequest("evaluate", { expression: "", frameId: 2, context:'hover' });

		//vscode.commands.executeCommand("vscode.open", vscode.Uri.file(path), vscode.ViewColumn.Beside);
		vscode.window.showInformationMessage('Hello World from borescope!' + editor.selection);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
