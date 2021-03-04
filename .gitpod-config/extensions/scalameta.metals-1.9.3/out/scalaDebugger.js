"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugServerFromUri = exports.start = exports.initialize = void 0;
const vscode = __importStar(require("vscode"));
const metals_languageclient_1 = require("metals-languageclient");
const configurationType = "scala";
const launchRequestType = "launch";
function initialize(outputChannel) {
    outputChannel.appendLine("Initializing Scala Debugger");
    return [
        vscode.debug.registerDebugConfigurationProvider(configurationType, new ScalaConfigProvider()),
        vscode.debug.registerDebugAdapterDescriptorFactory(configurationType, new ScalaDebugServerFactory()),
    ];
}
exports.initialize = initialize;
function start(noDebug, ...parameters) {
    return __awaiter(this, void 0, void 0, function* () {
        return vscode.commands
            .executeCommand(metals_languageclient_1.ServerCommands.DebugAdapterStart, ...parameters)
            .then((response) => {
            if (response === undefined)
                return false;
            const port = debugServerFromUri(response.uri).port;
            const configuration = {
                type: configurationType,
                name: response.name,
                noDebug: noDebug,
                request: "launch",
                debugServer: port,
            };
            return vscode.debug.startDebugging(undefined, configuration);
        });
    });
}
exports.start = start;
class ScalaConfigProvider {
    provideDebugConfigurations() {
        const mainClassPick = "Main Class";
        const testClassPick = "Test Suite";
        return vscode.window
            .showQuickPick([mainClassPick, testClassPick], {
            placeHolder: "Pick the kind of the class to debug (Press 'Escape' to create 'launch.json' with no initial configuration)",
        })
            .then((result) => {
            switch (result) {
                case mainClassPick:
                    return this.provideDebugMainClassConfiguration().then((config) => [
                        config,
                    ]);
                case testClassPick:
                    return this.provideDebugTestClassConfiguration().then((config) => [
                        config,
                    ]);
                default:
                    return [];
            }
        })
            .then((result) => result, () => []);
    }
    resolveDebugConfiguration(_folder, debugConfiguration) {
        if (debugConfiguration.type === undefined)
            return null;
        return debugConfiguration;
    }
    provideDebugMainClassConfiguration() {
        return this.askForBuildTarget().then((buildTarget) => this.askForClassName().then((className) => this.askForConfigurationName(className).then((name) => {
            const result = {
                type: configurationType,
                name: name,
                request: launchRequestType,
                mainClass: className,
                buildTarget: buildTarget,
                args: [],
            };
            return result;
        })));
    }
    provideDebugTestClassConfiguration() {
        return this.askForBuildTarget().then((buildTarget) => this.askForClassName().then((className) => this.askForConfigurationName(className).then((name) => {
            const result = {
                type: configurationType,
                name: name,
                request: launchRequestType,
                testClass: className,
                buildTarget: buildTarget,
            };
            return result;
        })));
    }
    askForBuildTarget() {
        return vscode.window
            .showInputBox({
            prompt: "Enter the name of the build target",
            placeHolder: "Optional, you can leave it empty",
        })
            .then((buildTarget) => {
            if (buildTarget === undefined) {
                return Promise.reject();
            }
            else if (buildTarget === "") {
                return undefined;
            }
            else {
                return buildTarget;
            }
        });
    }
    askForClassName() {
        return vscode.window
            .showInputBox({
            prompt: "Enter the name of the class to debug",
            placeHolder: "<package>.<Class>",
        })
            .then((name) => name !== null && name !== void 0 ? name : Promise.reject());
    }
    askForConfigurationName(className) {
        return vscode.window
            .showInputBox({
            prompt: "Enter the name of the configuration",
            value: `Debug ${className}`,
        })
            .then((name) => name !== null && name !== void 0 ? name : Promise.reject());
    }
}
class ScalaDebugServerFactory {
    createDebugAdapterDescriptor(session) {
        if (session.configuration.mainClass !== undefined ||
            session.configuration.testClass !== undefined) {
            return vscode.commands
                .executeCommand(metals_languageclient_1.ServerCommands.DebugAdapterStart, session.configuration)
                .then((debugSession) => {
                if (debugSession === undefined)
                    return null;
                return debugServerFromUri(debugSession.uri);
            });
        }
        return null;
    }
}
function debugServerFromUri(uri) {
    const debugServer = vscode.Uri.parse(uri);
    const segments = debugServer.authority.split(":");
    const host = segments[0];
    const port = parseInt(segments[segments.length - 1]);
    return new vscode.DebugAdapterServer(port, host);
}
exports.debugServerFromUri = debugServerFromUri;
//# sourceMappingURL=scalaDebugger.js.map