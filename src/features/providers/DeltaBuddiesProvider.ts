import { WebviewView, WebviewViewProvider, Uri } from 'vscode';
import { getNonce, escapeJsonCharacters } from '../helpers/helpers';

export class DeltaBuddiesProvider implements WebviewViewProvider {
    constructor(private readonly extensionUri: Uri) {}

    #localAssetsPaths(webviewView: WebviewView) {
        const mediaRoot = Uri.joinPath(this.extensionUri, 'media');
        const spritesPath = Uri.joinPath(mediaRoot, 'sprites');

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [mediaRoot]
        };

        const scriptUri = webviewView.webview.asWebviewUri(Uri.joinPath(mediaRoot, 'main.js'));
        const styleUri = webviewView.webview.asWebviewUri(Uri.joinPath(mediaRoot, 'main.css'));

        const charactersSpriteSheets = {
            krisUri: webviewView.webview.asWebviewUri(
                Uri.joinPath(spritesPath, 'kris.png')
            ).toString(),
        };

        return {charactersSpriteSheets, scriptUri, styleUri};
    }

    resolveWebviewView(webviewView: WebviewView): void {
        const assetsPaths = this.#localAssetsPaths(webviewView);
        const nonce = getNonce();

        webviewView.webview.html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}'; img-src https://*.vscode-cdn.net https://*.vscode-resource.vscode-cdn.net data:; style-src https://*.vscode-cdn.net https://*.vscode-resource.vscode-cdn.net 'nonce-${nonce}';">
            <link rel="stylesheet" href="${assetsPaths.styleUri}" nonce="${nonce}">
        </head>
        <body>
            <canvas id="aquarium" data-characters="${escapeJsonCharacters(JSON.stringify(assetsPaths.charactersSpriteSheets))}"></canvas>
            <script type="module" nonce="${nonce}" src="${assetsPaths.scriptUri}"></script>
        </body>
        </html>`;
    }
}