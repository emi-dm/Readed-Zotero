var ReadColumn;

function install() {}

async function startup({ id, version, rootURI }) {
  dump("Readed startup: " + rootURI + "\n");
  
  try {
    Services.scriptloader.loadSubScript(rootURI + "read-column.js");
    
    if (typeof ReadColumn === "undefined") {
      dump("ERROR: ReadColumn not loaded!\n");
      return;
    }
    
    dump("ReadColumn found, calling init...\n");
    await ReadColumn.init({ id, version, rootURI });
    dump("ReadColumn init called\n");
  } catch (e) {
    dump("Startup error: " + e.message + "\n" + e.stack + "\n");
  }
}

function onMainWindowLoad({ window }) {}
function onMainWindowUnload({ window }) {}

async function shutdown() {
  dump("Readed shutdown\n");
  if (ReadColumn && ReadColumn.removeFromAllWindows) {
    await ReadColumn.removeFromAllWindows();
  }
  ReadColumn = undefined;
}

function uninstall() {}
