// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, window } from 'vscode';
import { DeltaBuddiesProvider } from './features/providers/DeltaBuddiesProvider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "mydeltabuddies" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

    const provider = new DeltaBuddiesProvider(context.extensionUri);

    const providerDisposable = window.registerWebviewViewProvider(
        'mydeltabuddies.aquarium',
        provider
    );

    context.subscriptions.push(providerDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
