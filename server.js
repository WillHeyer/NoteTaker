const fs = require("fs")
const express = require("express")
const path = require("path")

var app = express();
var PORT = process.env.PORT||3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
  });

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
  });

app.post("/api/notes", function(req, res) {
    var postNote = req.body;
    var dbData = JSON.parse(fs.readFileSync(path.join(__dirname, "/db/db.json")));
    dbData.push(postNote)
    fs.writeFileSync(path.join(__dirname, "/db/db.json"), JSON.stringify(dbData));

    res.json(dbData)
});

app.delete("/api/notes/:id", function(req, res){
    var data = JSON.parse(fs.readFileSync("db/db.json"));
    var idToDelete = req.params.id;

    let newNotes = data.filter(note => note.id != idToDelete)
    fs.writeFileSync("db/db.json", JSON.stringify(newNotes), function (error){
        if (error)
        throw error
    })

    res.json(newNotes)

})


app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
  });



app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });