var ReadColumn;

function install() {
  dump("ReadFlow: Install called\n");
}

async function startup(options) {
  var { id, version, rootURI, reason } = options;
  dump("ReadFlow: Starting plugin (id: " + id + ", version: " + version + ")\n");
  
  try {
    dump("ReadFlow: Loading script from " + rootURI + "read-column.js\n");
    Services.scriptloader.loadSubScript(rootURI + "read-column.js");
    
    if (typeof ReadColumn === "undefined") {
      dump("ReadFlow ERROR: ReadColumn not loaded!\n");
      return;
    }
    
    dump("ReadFlow: ReadColumn loaded\n");
    await ReadColumn.init({ id, version, rootURI });
    
    // Register column in all windows
    await ReadColumn.addToAllWindows();
    
    dump("ReadFlow: Startup complete\n");
  } catch (e) {
    dump("ReadFlow Startup error: " + e.message + "\n" + e.stack + "\n");
  }
}

function onMainWindowLoad({ window }) {
  dump("ReadFlow: Main window loaded\n");
  if (ReadColumn && ReadColumn.addToWindow) {
    ReadColumn.addToWindow(window);
  }
}

function onMainWindowUnload({ window }) {
  dump("ReadFlow: Main window unloaded\n");
}

async function shutdown() {
  dump("ReadFlow: Shutting down\n");
  if (ReadColumn && ReadColumn.removeFromAllWindows) {
    await ReadColumn.removeFromAllWindows();
  }
  ReadColumn = undefined;
}

function uninstall() {
  dump("ReadFlow: Uninstall called\n");
}
