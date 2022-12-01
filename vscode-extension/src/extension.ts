import * as vscode from 'vscode';
import * as fs from 'fs';
import * as net from "net";
import { join } from 'path';

// This method is called when the extension is activated
export function activate(context: vscode.ExtensionContext) {

	console.log('Borescope activated');

	let disposable = vscode.commands.registerTextEditorCommand('borescope.inspectvar', async editor => {
		// Executed when hitting Ctrl+Alt+Q
		
		// Get the selected editor text
		const selectedVariable = editor.document.getText(editor.document.getWordRangeAtPosition(editor.selection.start));
		
		// Get the debug session so we can lookup if there is such a variable
		const session = vscode.debug.activeDebugSession;
		if (session === undefined) {
			return;
		}

		// Check if this variable is available in a scope
		let res = await session.customRequest('threads', {});
		let threads = res.threads;
		let variables : any[] = [];
		let targetVariable = undefined;
		let callStack = 0;

		end:
		for (const thread of threads) 
		{
			res = await session.customRequest('stackTrace', { threadId: thread.id });
			let stacks = res.stackFrames;
			for (let stack of stacks)
			{
				callStack = stack.id
				res = await session.customRequest('scopes', {frameId: callStack});
				let scopes = res.scopes;
				for (let scope of scopes)
				{
					res = await session.customRequest('variables', {variablesReference: scope.variablesReference});
					variables = res.variables;
					targetVariable = variables.find( v => v.name === selectedVariable);
					if (targetVariable !== undefined)
					{
						break end;
					}
				}
			}
		}

		if (targetVariable === undefined)
		{
			return;
		}
		
		// Now inject our borescope into the code to extract the variable
		let helperCode = fs.readFileSync(join(context.extensionPath, 'src', 'injected_code.py')).toString('base64');

		let expression = (
            `exec("from base64 import b64decode; decoded_code=b64decode('${helperCode}')") `
            + `or exec(decoded_code) or eval("__borescope_internal_handler(${selectedVariable})")`
        );

		let evalResult = await session.customRequest("evaluate", { expression: expression, frameId: 2, context:'hover' });

		console.log(`evaluate ${expression} result: ${evalResult.result}`);

		// Send the value to the Borescope GUI
		let client = new net.Socket();
		client.connect(8023, '127.0.0.1', function() {
			console.log("Borescope sending data.");
			client.write("BORESCOPE:" + evalResult.result);
			client.end();
			console.log("Borescope sent data.");
		});
		console.log("Done");
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
