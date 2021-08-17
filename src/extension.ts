import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext)
{
	let currentDocUriMovesLeft = new Map<vscode.Uri, number>();
	let closeDisposable = vscode.workspace.onDidCloseTextDocument((doc: vscode.TextDocument) => {
		if (currentDocUriMovesLeft.has(doc.uri))
			currentDocUriMovesLeft.delete(doc.uri);
	});
	context.subscriptions.push(closeDisposable);
	let openDisposable = vscode.window.onDidChangeVisibleTextEditors((editors: vscode.TextEditor[]) => {
		if (vscode.window.activeTextEditor)
		{
			const doc = vscode.window.activeTextEditor.document;
			if (doc.languageId === "search-result" && doc.version === 1)
			{
				let movesLeft = 2;
				if (currentDocUriMovesLeft.has(doc.uri))
					movesLeft = currentDocUriMovesLeft.get(doc.uri)!;
				if (movesLeft > 0)
				{
					const viewCol = vscode.window.activeTextEditor.viewColumn;
					// Move to first panel before moving down
					if (movesLeft === 2 && viewCol !== 1)
						vscode.commands.executeCommand("workbench.action.moveEditorToFirstGroup");
					else
					{
						if (movesLeft === 2)
						movesLeft--;
						vscode.commands.executeCommand("workbench.action.moveEditorToBelowGroup");
					}
					movesLeft--;
					currentDocUriMovesLeft.set(doc.uri, movesLeft);
				}
			}
		}
	});
	context.subscriptions.push(openDisposable);
}

export function deactivate() {}
