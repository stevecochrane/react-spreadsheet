const express = require("express");

//	Initialize Express
const app = express();

//	Default to port 3000
app.set("port", process.env.PORT || 3000);

//	Set /views as the default views directory
app.set("views", "./views");

//	Set Pug as the default template engine
app.set("view engine", "pug");

//	Set contents of /public to be served as static files with "/static/" URL prefix
app.use("/static", express.static(__dirname + "/public"));

//	Default app view
app.get("/", function(req, res) {
	res.render("index");
});

app.listen(app.get("port"), function() {
	console.log("Express started on http://localhost:" + app.get("port") + "; press Ctrl-C to terminate.");
});
