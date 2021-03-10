const path = require("path");
const fs = require("fs");
const util = require("util");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

module.exports = (app) => {

    const pathToDBfile = path.join(__dirname, "..", "db", "db.json");


    app.get("/api/notes", (req, res) => {

        fs.readFile(pathToDBfile, (err, data) => {
            if (err) {
                throw err;
            }
            return res.json(JSON.parse(data));
        })
    });

    app.post("/api/notes", (req, res) => {
        let id = 0;
        readFileAsync("count.txt")
        .then(data => {
            id = parseInt(data) + 1;      
            req.body.id = id;
            let info = id;

            fs.writeFile("count.txt", info, function(err) {
                if (err) {
                    return console.log(err);
                }
                
                console.log("Success!");
            });
            res.json(addANewNote(req.body));
        });

    });
    app.delete("/api/notes/:id", (req, res) => {
        deleteANote(req.params.id);
        res.end("Deleted");
    });
    
    function addANewNote (newNote) {
    
        readFileAsync(pathToDBfile)
        .then ( data => {
            let arrayOfNotes = JSON.parse(data);
            let duplicate = false;
            for (let i=0; i<arrayOfNotes.length; i++) {
                if (arrayOfNotes[i].id === newNote.id) {
                    duplicate = true;
                }
            }
            if(!duplicate) {
                arrayOfNotes.push(newNote);
                writeFileAsync(pathToDBfile, JSON.stringify(arrayOfNotes, null, 2))
                .then ( ()=>{
                    console.log("Successfully wrote to db.json file");
                })
            }
        });
        return (JSON.stringify(newNote));
    };
    
    function deleteANote(id) {
        readFileAsync(pathToDBfile)
        .then ( data => {
            let arrayOfNotes = JSON.parse(data);
            for (let i=0; i<arrayOfNotes.length; i++) {
                if (arrayOfNotes[i].id === parseInt(id)) {
                    arrayOfNotes.splice(i, 1);
                }
            }

            writeFileAsync(pathToDBfile, JSON.stringify(arrayOfNotes, null, 2))
            .then ( ()=>{
                console.log("Successfully wrote to db.json file");
            })
        });
    };

};