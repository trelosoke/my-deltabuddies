import * as vscode from 'vscode';

export class MyProvider implements vscode.WebviewViewProvider {
    constructor(private readonly extensionUri: vscode.Uri) {}

    resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, token: vscode.CancellationToken): void {

        const mediaRoot = vscode.Uri.joinPath(this.extensionUri, 'media');

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [mediaRoot]
        };

        const scriptUri = webviewView.webview.asWebviewUri(vscode.Uri.joinPath(mediaRoot, 'main.js'));
        const nonce = getNonce();

        webviewView.webview.html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}';">
        </head>
        <body>
            <canvas id="aquarium" height="300"></canvas>
            <script nonce="${nonce}" src="${scriptUri}"></script>
        </body>
        </html>`;
    }
}

function getNonce(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < 32; i++) {
        text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return text;
}