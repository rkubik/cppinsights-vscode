# cppinsights vscode extension

![cppinsights](/screenshots/cppinsights-file.png?raw=true "cppinsights")

## Getting Started

1. Compile [insights](https://github.com/andreasfertig/cppinsights).
2. Install this extension in vscode.

```
code --install-extension cppinsights-0.0.1.vsix
```

3. Configure `insights`.

```
"cppinsights.insightsPath": "/path/to/insights",
"cppinsights.languageStandardVersion": "c++17",
"cppinsights.additionalArguments":[
    "-isystem/usr/include",
    "-isystem/usr/include/x86_64-linux-gnu"
],
```

## How to use

### Commands

`cppinsights: line`: Run insights on the current line

`cppinsights: selection`: Run insights on the current selection

`cppinsights: file`: Run insights on the current file
