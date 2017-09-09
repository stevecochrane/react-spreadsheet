# react-spreadsheet

To get myself a little more up to speed with modern React, and Preact, this is
an example of a simple spreadsheet web application from the book
[React: Up & Running](http://shop.oreilly.com/product/0636920042266.do), but
expanded upon:

* Added a Babel + Webpack bundling workflow.
* Refactored to use ECMAScript 6 classes.
* Converted to Preact with preact-compat.

Here's how to get it running:

```bash
npm install
npm run build
npm start
```

In the app you can click the Search button and enter some text for a live
search, double-click table cells to edit their contents, and click on column
header cells to sort that column.
