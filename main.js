const e = require('express'); // Roy Wu, Web Development, 1/20/2023
const express = require('express');
const app = express();
app.use(express.json());

//shows homepage
app.get('/', (req,res)=>{
    res.send("This is Music App by Roy Wu");
});

//dictionary to show genre with songs in each, contains two default song
let genres = { 
    pop: [{id: 1, name: "Say So"}, {id: 2, name: "Montero"}],
    hipHop: [{id: 1, name: "Vamp Anthem"}, {id: 2, name: "@MEH"}], 
    rap: [{id: 1, name: "Sky"}, {id:2, name:"Shoota"}], 
    classical: [{id: 1, name: "Piano Concerto No 21"}, {id: 2, name: "Toccata and Fugue in D Minor"}], 
    rock: [{id: 1, name: "Something in the Way"}, {id: 2, name: "Smells Like Teen Spirit"}], 
    jazz: [{id: 1, name: "Fly Me To The Moon"}, {id: 2, name: "At Last"}], 
    blues: [{id: 1, name: "Cross Road Blues"}, {id: 2, name: "Sweet Home Chicago"}], 
    electronic: [{id: 1, name: "Nobody Seems to Care"}, {id: 2, name: "1998"}],
};

//shows all the genres with their songs
app.get('/genres', (req, res)=>{
    res.send(genres);
})

//checks to see if genre exist, if not returns 404, if yes returns all songs inside genre
app.get('/genres/:genre', (req, res)=>{
    if(req.params.genre in genres){
        res.send(genres[req.params.genre]);
    }else{
        res.status(404).send("The genre with the given name was not found");
        return
    }
})

//gets specific song from genre based on id
app.get('/genres/:genre/:id', (req,res)=>{
    if(req.params.genre in genres){
        const song = genres[req.params.genre].find(c=>c.id === parseInt(req.params.id));
        if(!song){
            res.status(404).send("The course with the given ID was not found");
            return
        }
        res.send(song);
    }else{
        res.status(404).send("The genre with the given name was not found");
        return
    }
})

//year, month filter
app.get('/:year/:month', (req, res)=>{
    let firstParam = req.params.year;
    let secondParam = req.params.month;
    if(firstParam.length == 4 && /^\d+$/.test(firstParam)){
        if(parseInt(secondParam) > 0 && parseInt(secondParam) < 13 && /^\d+$/.test(firstParam)){
            res.send({year: firstParam, month: new Date(firstParam, secondParam - 1).toLocaleString('default', { month: 'long' })});
        }else{
            res.status(404).send("Error 404: Check Month");
        }
    }else{
        res.status(404).send("Error 404: Check Year");
    }
})

//listener
app.listen(3000, () => {
    console.log('Listening on port 3000...');
})

//add new genre, checks to see if 20 > char > 1
app.post('/genres', (req,res) => {
    if(req.body.genre.length > 1 && req.body.genre.length < 21){
        const genre = req.body.genre;
        genres[genre] = [];
        res.send(genres);
    }
    else {
        res.status(404).send("Genre name should be greater than 1 characters and max 20 characters");
    }
})

//add new song to genre, checks to see if genre exists first
app.post('/genres/:genre/', (req, res)=>{
    if(req.params.genre in genres){
        if(req.body.name.length > 1 && req.body.name.length < 21){
        const song = {
            id: genres[req.params.genre].length + 1,
            name: req.body.name
        };
        genres[req.params.genre].push(song);
        res.send(song);
        }else{
            res.status(404).send("The song name should be greater than 1 character and max 20 characters");
        }
    }else{
        res.status(404).send("The genre with the given name was not found");
        return
    }
})

//rename song name if given id is found
app.put('/genres/:genre/', (req, res)=>{
    if(req.params.genre in genres){
        const song = genres[req.params.genre].find(c=>c.id === parseInt(req.body.id));
        if(!song){
            res.status(404).send("The song with the given ID was not found");
            return
        }
        if(!req.body.name){
            res.status(400).send("Name required to update");
            return
        } 
        if(req.body.name.length < 3){
            res.status(400).send("Name should be at least 3 characters long");
            return
        }   
        var indx = genres[req.params.genre].findIndex(x => x.id == song.id);
        genres[req.params.genre][indx] = {id: parseInt(req.body.id), name: req.body.name};
        res.send(genres[req.params.genre][indx]);
    }else{
        res.status(404).send("The genre with the given name was not found");
        return
    }
})

//deletes specific song from genre based on id. Checks param, body not needed
app.delete('/genres/:genre/:id', (req,res)=>{
    if(req.params.genre in genres){
        const song = genres[req.params.genre].find(c=>c.id === parseInt(req.params.id));
        if(!song){
            res.status(400).send("The song with the given ID was not found");
            return
        }
        var indx = genres[req.params.genre].findIndex(x => x.id == song.id);
        res.send(genres[req.params.genre].splice(indx, 1));
    }else{
        res.status(404).send("The genre with the given name was not found");
        return
    }
})

//copy a genre and adds it to genre 
app['copy']('/genres/:genre', (req, res)=>{
    if(req.params.genre in genres){
        genres[req.params.genre + "_COPY"] = genres[req.params.genre];
        res.send(genres[req.params.genre]);
    }else{
        res.status(404).send("The genre with the given name was not found");
        return
    }
})

/* Reflection:
    1. Postman(local client) sends requests to localhost:3000(server), we can give our server information, in this instance they are defined in the parameter and body. 
    The server then can take this information and decides what to do with it, eg. determining it is valid and saving it, or determining the information is invalid and returning an error message.
    2. I learned how to use Postman and learned the basics of Express framework. 
    3. It would be nice to see this program fully fledged out and have a more accessible design that can be used, instead of just barebones raw data.
*/
