const mongoose = require("mongoose");
const Card = require('./models/card.js');
const findCard = require('./utils/scrapper.js');
const express = require('express')
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

async function searchForCard(searchString) {
    console.log('Start searching for card')
    var card = await findCard(searchString);
    
    if(card == null) {
        return '404'
    } else {
        const cardDocument = new Card({
            name: card.name,
            description: card.description,
            imagePath: card.imagePath
        });

        var documentId = ''
        await cardDocument.save()
            .then((result) => {
                console.log('Found card:', result.name)
                documentId = result._id
            })
            .catch((err) => {
                console.log(err)
                documentId = '400'
            });
        return documentId
    }
}


mongoose.connect("mongodb://localhost:27017")
    .then((result) => console.log('connected to db'))
    .catch((err) => console.log(err));

const PORT = 4000
app.listen(PORT, () => console.log('Server is running on ', PORT));
app.post('/findCard', async (req, res) => {
    console.log('Received request to search for card name:', req.body.name)
    var response = await searchForCard(req.body.name)
    if(response == '404') {
        console.log('Could not find card from web')
        res.status(404).send('Could not find card from web')
    } else if(response == '200') {
        console.log('Error while handling request')
        res.status(400).send('Error while handling request')
    } else {
        console.log('Saved card to DB with id:', response)
        res.status(200).send(response)
    }
    
})

// mongoose.connection.close()
