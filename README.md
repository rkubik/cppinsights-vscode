# cppinsights vscode extension

![cppinsights](/screenshots/cppinsights-file.png?raw=true "cppinsights")

## Getting Started

1. Compile [insights](https://github.com/andreasfertig/cppinsights).
2. Install this extension in vscode.

```
code --install-extension cppinsights-0.0.1.vsix
```

3. Configure the `insights` path.

```
"cppinsights.insightsPath": "/path/to/insights"
```

## How to use

### Commands

`cppinsights selection`: Run insights on the current selection

`cppinsights file`: Run insights on the current file

### Keybindings

`ctrl+shift+l`: selection command

`ctrl+shift+j`: file command