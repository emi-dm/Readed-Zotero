var ReadColumn = (function () {
  var _pluginID = "readflow@emi.dev";
  var _dataKey = "read-status";
  var _registered = false;

  function log(msg) {
    try {
      Zotero.debug("ReadFlow: " + msg);
    } catch (e) {
      dump("ReadFlow log: " + msg + "\n");
    }
  }

  async function setReadStatus(item, status) {
    try {
      await item.removeTag("_read");
      await item.removeTag("_reading");
      
      if (status === "read") {
        await item.addTag("_read", 1);
      } else if (status === "reading") {
        await item.addTag("_reading", 1);
      }
      
      await item.save();
      log("Set item " + item.id + " to " + status);
      return true;
    } catch (e) {
      log("Error setting status: " + e);
      return false;
    }
  }

  function getReadStatus(item) {
    if (item.hasTag("_read")) return "read";
    if (item.hasTag("_reading")) return "reading";
    return "not-read";
  }

  function renderCell(index, data, column, isFirstColumn, doc) {
    // data is item.id as string from dataProvider
    var itemId = parseInt(data);
    var item = Zotero.Items.get(itemId);
    var status = item ? getReadStatus(item) : "not-read";
    
    // Create container with flexbox for centering
    var cell = doc.createElement("div");
    cell.style.display = "flex";
    cell.style.justifyContent = "center";
    cell.style.alignItems = "center";
    cell.style.width = "100%";
    cell.style.height = "100%";
    cell.style.cursor = "pointer";
    cell.style.userSelect = "none";
    
    // Create content div
    var content = doc.createElement("div");
    content.style.fontSize = "16px";
    content.style.userSelect = "none";
    
    var statusSymbols = {
      "read": "●",
      "reading": "◐",
      "not-read": "○"
    };
    
    var symbol = statusSymbols[status] || "○";
    content.textContent = symbol;
    cell.title = "Click to change status";
    
    if (status === "read") {
      content.style.color = "#2E7D32";
    } else if (status === "reading") {
      content.style.color = "#E65100";
    } else {
      content.style.color = "#757575";
    }
    
    // Append content to cell
    cell.appendChild(content);
    
    if (!item) {
      return cell;
    }
    
    cell.dataset.itemId = item.id;
    
    cell.addEventListener("click", function(e) {
      e.stopPropagation();
      e.preventDefault();
      
      var target = e.currentTarget;
      var clickedItemId = parseInt(target.dataset.itemId);
      
      var clickedItem = Zotero.Items.get(clickedItemId);
      if (!clickedItem) {
        return;
      }
      
      var currentStatus = getReadStatus(clickedItem);
      var nextStatus;
      
      if (currentStatus === "not-read") {
        nextStatus = "reading";
      } else if (currentStatus === "reading") {
        nextStatus = "read";
      } else {
        nextStatus = "not-read";
      }
      
      // Update content immediately
      var contentDiv = target.querySelector('div');
      if (contentDiv) {
        contentDiv.textContent = statusSymbols[nextStatus] || "○";
        contentDiv.title = "Click to change status";
        
        if (nextStatus === "read") {
          contentDiv.style.color = "#2E7D32";
        } else if (nextStatus === "reading") {
          contentDiv.style.color = "#E65100";
        } else {
          contentDiv.style.color = "#757575";
        }
      }
      
      setReadStatus(clickedItem, nextStatus);
    });
    
    return cell;
  }

  async function registerColumn() {
    if (_registered) {
      log("Column already registered");
      return;
    }
    
    try {
      log("Registering column...");
      
      var columnConfig = {
        pluginID: _pluginID,
        dataKey: _dataKey,
        label: "Read",
        dataProvider: function (item, dataKey) {
          if (!item || !item.isRegularItem()) {
            return "";
          }
          return item.id.toString(); // Return just item ID for stable sorting
        },
        renderCell: renderCell,
        width: "50"
      };

      await Zotero.ItemTreeManager.registerColumns(columnConfig);
      log("Column registered successfully!");
      _registered = true;
    } catch (e) {
      log("Error registering column: " + e.message);
      dump("ReadFlow Error: " + e.message + "\n" + e.stack + "\n");
    }
  }

  return {
    init: async function (options) {
      log("Init start...");
      _registered = false;
    },

    addToWindow: async function (window) {
      log("addToWindow called");
      await new Promise(r => setTimeout(r, 1000));
      await registerColumn();
    },
    
    removeFromWindow: function (window) {},
    
    addToAllWindows: async function () {
      log("addToAllWindows called");
      await registerColumn();
    },
    
    removeFromAllWindows: async function () {}
  };
})();