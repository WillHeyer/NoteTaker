const express = require("express");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.static("public"));

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//  The below of routes to handle htl and api 
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);


// Listener at specified PORT to strat the server

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});