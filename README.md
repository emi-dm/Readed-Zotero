# Readed - Zotero Plugin

A Zotero 7 plugin that adds a "Read" checkbox column to mark articles as read or unread.

## Features

- Adds a "Read" column to your Zotero library
- Click on the checkbox to mark/unmark articles as read
- Uses Zotero tags (`_read`) for persistence
- State is synced with your Zotero account

## Installation

1. Download the latest `.xpi` file from [Releases](../../releases)
2. Open Zotero 7
3. Go to **Tools → Add-ons**
4. Click the gear icon → **Install Add-on From File**
5. Select the downloaded `.xpi` file
6. Restart Zotero

## Usage

1. After installation, right-click on any column header in your library
2. Select **Show Columns**
3. Find and check **Read** in the list
4. Click on the checkbox in the "Read" column to toggle the read status

## Development

### Project Structure

```
Readed-Zotero/
├── manifest.json       # Zotero 7 plugin manifest
├── bootstrap.js        # Plugin bootstrap/entry point
├── read-column.js     # Main plugin logic
└── install.rdf        # Zotero 6 manifest (legacy)
```

### Building

```bash
# Create the .xpi package
zip -r Readed-Zotero.xpi manifest.json bootstrap.js read-column.js install.rdf
```

### Debugging

To view debug logs:
1. Go to **Help → Debug Output Logging → View Output**
2. Look for messages prefixed with "ReadColumn"

To open the Error Console:
- **Help → Developer → Error Console** (or `Ctrl+Shift+J` / `Cmd+Option+J`)

## Requirements

- Zotero 7.0 or later
- Zotero 7.1.x supported

## License

MIT
