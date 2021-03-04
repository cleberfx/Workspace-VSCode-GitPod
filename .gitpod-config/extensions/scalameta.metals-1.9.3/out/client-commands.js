"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientCommands = void 0;
// Metals expects clients to implement the following commands: https://scalameta.org/metals/docs/editors/new-editor.html#metals-client-commands
exports.ClientCommands = {
    toggleLogs: "metals-logs-toggle",
    focusDiagnostics: "metals-diagnostics-focus",
    runDoctor: "metals-doctor-run",
    startDebugSession: "metals-debug-session-start",
    startRunSession: "metals-run-session-start",
};
//# sourceMappingURL=client-commands.js.map