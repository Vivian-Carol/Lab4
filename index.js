const express = require("express");
const path = require("path");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "./public")));

const mustache = require('mustache-express');
app.engine('mustache', mustache());
app.set('view engine', 'mustache')

const nedb = require("gray-nedb");
const db = new nedb({ filename: 'emp.db', autoload: true });

console.log('db created');

//Display interface
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

db.insert({ name: 'Fred Flintstone' }, function (err, newDoc) {
    if (err) {
        console.log('error', err);
    } else {
        console.log('document inserted', newDoc);
    }
});


// Now add another three employees Jane Doe, Allan Grey and John Brown to the database
db.insert({ name: 'Jane Doe' }, function (err, newDoc) {
    if (err) {
        console.log('error', err);
    } else {
        console.log('Jane inserted', newDoc);
    }
});

db.insert({ name: 'Allan Grey' }, function (err, newDoc) {
    if (err) {
        console.log('error', err);
    } else {
        console.log('Allan inserted', newDoc);
    }
});

db.insert({ name: 'John Brown' }, function (err, newDoc) {
    if (err) {
        console.log('error', err);
    } else {
        console.log('John inserted', newDoc);
    }
});

db.find({ name: 'Fred Flintstone' }, function (err, docs) {
    if (err) {
        console.log('error');
    }
    else {
        console.log('documents retrieved: ', docs);
    }
})

db.update({ name: 'Fred Flintstone' }, {
    $set: { 'name': 'Wilma Flintstone' }
}, {}, function (err, docs) {
    if (err) {
        console.log('error updating documents', err);
    } else {
        console.log(docs, 'documents updated')
    }
})

db.remove({ name: 'Jane Doe' }, {}, function (err, docsRem) {
    if (err) {
        console.log('error deleting document');
    } else {
        console.log(docsRem, 'document removed from database')
    }
})

//view
app.post("/view", function (req, res) {
    db.find({ name: req.body.name }, function (err, docs) {
        if (err) {
            console.log("error", err);
        } else {
            console.log("document retrieved: ", docs);
            res.render('employeeData', {
                'employee': docs
            });
        }
    });
});

//add
app.post("/add", function (req, res) {
    db.insert({ name: req.body.name }, function (err, newDoc) {
        if (err) {
            console.log("error", err);
        } else {
            console.log("document inserted", newDoc);  // Terminal
            res.render('employeeData', {
                'employee': newDoc
                }); // FE
        }
    });
});

//update
app.post("/update", function (req, res) {
    db.update({ name: req.body.id }, {
        $set: { 'name': req.body.name }
    }, {}, function (err, docs) {
        if (err) {
            console.log("error", err);
        } else {
            console.log(req.body.id + " updated to " + req.body.name);
            res.json(req.body.id + " updated to " + req.body.name);
            res.render('employeeData', {
                'employee': docs
                });
        }
    });
});

//delete
app.post("/delete", function (req, res) {
    db.remove({ name: req.body.id }, {}, function (err, docsRem) {
        if (err) {
            console.log('error deleting document');
        } else {
            console.log(req.body.id, 'document removed from database')
            res.json(req.body.id, 'document removed from database');
            res.render('employeeData', {
                'employee': docsRem
                });
        }
    })
});

db.find({ name: 'John Brown' }, function (err, docs) {
    if (err) {
        console.log('error');
    }
    else {
        console.log('document is here: ', docs);
    }
})

//showAll
app.post("/showAll", function (req, res) {
    db.find({}, function (err, newDoc) { // Here we use find method to fetch all records
        if (err) {
            console.log("error", err);
        } else {
            console.log("document inserted", newDoc);  // Terminal
            res.render('employeeData', {
                'employees': newDoc
                }); // Send the data to Front-end
        }
    });
});

app.listen(3000, () => {
    console.log("Server listening on port: 3000");
});
