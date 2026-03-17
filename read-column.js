var ReadColumn = (function () {
  var _pluginID = "readed-column@emi.dev";
  var _dataKey = "read-status";

  function log(msg) {
    try {
      Zotero.debug("ReadColumn: " + msg);
    } catch (e) {}
  }

  async function toggleReadStatus(item) {
    try {
      var hasReadTag = item.hasTag("_read");
      if (hasReadTag) {
        await item.removeTag("_read");
      } else {
        await item.addTag("_read", 1);
      }
      await item.save();
      log("Toggled item " + item.id + " to " + !hasReadTag);
      return !hasReadTag;
    } catch (e) {
      log("Error toggling: " + e);
      return null;
    }
  }

  function renderCell(index, data, column, isFirstColumn, doc) {
    var container = doc.createElement("div");
    container.style.display = "flex";
    container.style.justifyContent = "center";
    container.style.alignItems = "center";
    container.style.height = "100%";
    container.style.cursor = "pointer";
    
    var checkbox = doc.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = (data === "true");
    checkbox.style.pointerEvents = "none";
    checkbox.style.margin = "0";
    
    container.appendChild(checkbox);
    
    container.addEventListener("click", async function (e) {
      log("Container clicked, index: " + index);
      
      var item = null;
      
      // Try to get item from tree
      if (column.tree) {
        try {
          var tree = column.tree;
          
          // Method 1: getRowAtIndex
          var row = tree.getRowAtIndex(index);
          log("getRowAtIndex result: " + (row ? row.ref.id : "null"));
          if (row && row.ref) {
            item = row.ref;
          }
          
          // Method 2: get id from tree's ref
          if (!item) {
            try {
              var itemID = tree.getItemAtIndex(index);
              log("getItemAtIndex result: " + itemID);
              if (itemID) {
                item = await Zotero.Items.getAsync(itemID);
              }
            } catch (err2) {
              log("getItemAtIndex error: " + err2);
            }
          }
          
          // Method 3: visibleItems
          if (!item) {
            try {
              var visible = tree.visibleItems;
              log("visibleItems length: " + (visible ? visible.length : 0));
              if (visible && visible[index]) {
                item = visible[index].ref;
                log("Got from visibleItems: " + item.id);
              }
            } catch (err3) {
              log("visibleItems error: " + err3);
            }
          }
          
        } catch (err) {
          log("Tree error: " + err);
        }
      }
      
      // Fallback: try ZoteroPane
      if (!item) {
        try {
          var win = doc.defaultView;
          var zoteroPane = win.ZoteroPane;
          var items = zoteroPane.getSelectedItems();
          if (items && items.length > 0) {
            item = items[0];
            log("Got from ZoteroPane: " + item.id);
          }
        } catch (err) {
          log("ZoteroPane error: " + err);
        }
      }
      
      if (item) {
        log("Final item: " + item.id);
        var newStatus = await toggleReadStatus(item);
        if (newStatus !== null) {
          checkbox.checked = newStatus;
        }
      } else {
        log("Could not get item at all!");
      }
    });
    
    return container;
  }

  async function registerColumn() {
    try {
      await Zotero.ItemTreeManager.registerColumns({
        pluginID: _pluginID,
        dataKey: _dataKey,
        label: "Read",
        dataProvider: function (item, dataKey) {
          if (!item || !item.isRegularItem()) {
            return "";
          }
          return item.hasTag("_read") ? "true" : "false";
        },
        renderCell: renderCell,
        width: "40px"
      });
      
      log("Column registered!");
    } catch (e) {
      log("Error: " + e.message);
    }
  }

  return {
    init: async function (options) {
      await new Promise(r => setTimeout(r, 1000));
      await registerColumn();
    },

    addToWindow: function (window) {},
    removeFromWindow: function (window) {},
    addToAllWindows: async function () {},
    removeFromAllWindows: async function () {}
  };
})();
