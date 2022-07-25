// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json

  const darkThemeConfig = "preferredDarkColorTheme";

  const lightThemeConfig = "preferredLightColorTheme";

  const themeConfig = "colorTheme";

  const savedThemeConfig = "saved-theme";

  const getConfiguration = () => vscode.workspace.getConfiguration("workbench");
  const getExtensionConfiguration = () =>
    vscode.workspace.getConfiguration("toggle-theme");

  const saveCurrentTheme = () => {
    const workspaceConfiguration = getConfiguration();
    const extensionConfiguration = getExtensionConfiguration();
    let currentTheme = workspaceConfiguration.get(themeConfig);
    let saved_theme = extensionConfiguration.get(savedThemeConfig);
    if (!saved_theme)
      extensionConfiguration.update(savedThemeConfig, currentTheme, true);
  };
  saveCurrentTheme();

  let selectAsDarkTheme = vscode.commands.registerCommand(
    "toggle-theme.select-dark",
    () => {
      const configuration = getConfiguration();
      let currentTheme = configuration.get(themeConfig);
      configuration.update(darkThemeConfig, currentTheme, true);
    }
  );

  let selectAsLightTheme = vscode.commands.registerCommand(
    "toggle-theme.select-light",
    () => {
      const configuration = getConfiguration();
      let currentTheme = configuration.get(themeConfig);
      configuration.update(lightThemeConfig, currentTheme, true);
    }
  );
  let sbItem;
  const createStatusBarButton = () => {
    sbItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      1
    );
    sbItem.text = "Toggle Theme";
    sbItem.tooltip = "Switch between dark and light theme";
    sbItem.command = "toggle-theme.toggle";
    sbItem.show();
  };

  const removeStatusBarButton = () => {
    if (sbItem) {
      sbItem.dispose().hide();
    }
  };

  const toggleStatusBarButton = () => {
    let extensionConfiguration = getExtensionConfiguration();
    const showStatusBar = extensionConfiguration.get("status-bar");
    if (showStatusBar !== true) {
      removeStatusBarButton();
      return;
    }
    createStatusBarButton();
  };

  toggleStatusBarButton();

  vscode.workspace.onDidChangeConfiguration((e) => {
    toggleStatusBarButton;
  });

  let toggleTheme = vscode.commands.registerCommand(
    "toggle-theme.toggle",
    function () {
      const configuration = getConfiguration();

      let currentTheme = configuration.get(themeConfig);
      let preferredDarkTheme = configuration.get(darkThemeConfig);
      let preferredLightTheme = configuration.get(lightThemeConfig);
      if (currentTheme === preferredDarkTheme) {
        configuration.update(themeConfig, preferredLightTheme, true);
      } else configuration.update(themeConfig, preferredDarkTheme, true);
    }
  );

  context.subscriptions.push(
    toggleTheme,
    selectAsDarkTheme,
    selectAsLightTheme
  );
}

// this method is called when your extension is deactivated
function deactivate() {
  let workspaceConfiguration = vscode.workspace.getConfiguration("workbench");
  let colorThemeConfiguration = workspaceConfiguration.get("colorTheme");
  let savedTheme = vscode.workspace
    .getConfiguration("toggle-theme")
    .get("saved-theme");
  workspaceConfiguration.update(colorThemeConfiguration, savedTheme, true);
}

module.exports = {
  activate,
  deactivate,
};
