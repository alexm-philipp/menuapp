Using React.js, Node.js, Express, TailwindCSS, SQLite3

Overview:
A menu application that allows you to create and edit menus. 
Add items with title, description and price or just titles.
Create menu that is run hosted at a unique URL.
Each unique URL has QR Code and download link. 
Sign up and Registration.

1. Must have database set up with these tables in SQLite3

    CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    password TEXT NOT NULL);

    CREATE TABLE menu_items (id INTEGER PRIMARY KEY, 
    email TEXT, menu_title TEXT, type TEXT, item_title TEXT, 
    description TEXT, price REAL, position INTEGER);

To add / improve:
1. Allow editing menu titles and menus
2. Make menu titles already used unavailable as menu title option
3. Deleted Menu Item can be restored / saved in db. 
4. Make more tailwindCSS for it.
5. Add options for currency / multiple currency's

Weaknesses: 
1. Not storing email by cookie but localStorage
2. Not using hash for passwords
3. Duplicate titles will cause database issues.


