//Use strict
"use strict";

//Create a constant to import(require) Express
const express = require('express');

//Create a constant to import(require) express Router
const router = express.Router();

//Create const of {model} to import(require) models.js
const {Blog} = require("./models");

//GET - ALL

//call router or app get from '/' with args request response =>
router.get('/', (req, res) =>  {
    
    //modelName find with no args
    Blog.find()
    
    //then with arg '<DB collectionName>' =>
    .then(blogposts  =>    {
        
        //respond with json object key/val pair, val is map of <DB collectionName>
        res.json({blogposts: blogposts.map(
        
        //New map (arrayName) => send arrayName through cleanUp method 
        (post)  =>  post.cleanUp()
        )}
    )

})


//ERROR CATCHER
//catch err =>
.catch(err => {
    
    //log error err to console
    console.error(err);
    
    //respond status 500 with json message stating error ocurred
    res.status(500).json({ message: "Internal server error" });
    });

});

//GET by ID

//call router or app get from '/:id' with args request response =>
router.get('/:id', (req, res)  =>  {
    
    //modelName findById with args request params id
    Blog.findById(req.params.id)
    
    //then dataName => respond with json with arg of 'send dataName through cleanUp method
        //where data name (ex. student or 'post') is the object being returned
    .then(post => res.json(post.cleanUp()))

//ERROR CATCHER
//catch err =>
.catch(err => {
    
    //log error err to console
    console.error(err);
    
    //respond status 500 with json message stating error ocurred
    res.status(500).json({ message: "Internal server error" });
    });
});

//GET by title or author
//trial - not part of reqs but issues with spaces that I need to figure out
/*
router.get('/', (req,res) =>  {

const filter = {};

const queryFields = ['title', 'author'];

queryFields.forEach(field =>    {
    if (req.query[field])   {
        filter[field] = req.query[field];
    }
})

Blog.find(filter)
    .then(blogposts => res.json({
        blogpost: blogposts.map(post => post.cleanUp())
    })
)
.catch(err => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
    });
});
*/

//POST

//call router or app post from '/' with args request response =>
router.post('/', (req, res) =>  {

    //create const array that specifies required fields
        //If required field has sub-fields they do not need to be specified here it would be specified 
        //in the POST request sent from postman
    const requiredFields = ['title','content','author'];

    //loop through requiredFields
    for (let i=0; i<requiredFields.length; i++) {

        //create const field to assign requiredField position i during loop
        const field = requiredFields[i];

        //IF field is not in the request body
        if (!(field in req.body))   {
            //create const for error message naming missing field from body
            const errMessage = `${field} is missing from request body!`;
            //log the error to console with arg errMessage
            console.error(errMessage);
            //return response status 400 and send errMessage
            return res.status(400).send(errMessage);
        }
    }

    //CREATE NEW DB OBJECT
    //modelName create {object}
    Blog.create({
        //Within object {key1: req.body.val1, ley2: req.body.val2}
        //If key/val has sub-key/val they do not need to be specified here it would be specified 
            //in the POST request sent from postman
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    })

    //then dataName => respond status 201 and json dataName send through cleanUp
        //where data name (ex. student or 'post') is the object being returned
        .then(post =>   res.status(201).json(post.cleanUp()))

        //ERROR CATCHER
        //catch err =>
        .catch(err => {
            
            //log error err to console
            console.error(err);
            
            //respond status 500 with json message stating error ocurred
            res.status(500).json({ message: "Internal server error" });
            });

    
});


//PUT

//call router or app put from '/:id' with args request response =>
router.put('/:id', (req, res)   =>  {

    //IF NOT request params id AND request body id AND request params id strict equal request body id 
    if(!(req.params.id && req.body.id && req.params.id === req.body.id))    {

        //create const for error message stating request params id AND request body id must match
        const errMessage = `Request path id: ${req.params.id} and request body id: ${req.body.id} must match!`;
        //log the error to console with arg errMessage
        console.error(errMessage);
        //return response status 400 and send errMessage
        return res.status(400).send(errMessage);
    }

    //create const of empty object for fields to update
    const makeUpdate = {};
    //create const array of fields that are allowed to be updated
    const canUpdate = ['title', 'content', 'author'];

    //for each canUpdate with arg dataArg =>
    canUpdate.forEach(field =>  {
        //if dataArg is in request body
        if(field in req.body)   {
            //assign the request body[dataArg] to makeUpdate[dataArg] object
            makeUpdate[field] = req.body[field];
        }
    });

    //modelName call findByAndUpdate with args request params id and object with $set/val pair where val is makeUpdate
    Blog.findByIdAndUpdate(req.params.id, {$set: makeUpdate})
    //then dataName => respond with json message naming id has been updated, status 204, and end
        //where data name (ex. student or 'post') is the object being returned
    .then(post => res.json({ message: `'${req.params.id}' has been updated`}).status(204).end())
    
    //ERROR CATCHER
    //catch err =>
    .catch(err => {
        
        //log error err to console
        console.error(err);
        
        //respond status 500 with json message stating error ocurred
        res.status(500).json({ message: "Internal server error" });
        });   

});


//DELETE

//call router or app delete from '/:id' with args request response =>
router.delete('/:id', (req, res) =>  {
//modelName findByIdAndRemove with arg request params id
Blog.findByIdAndRemove(req.params.id)
    //then dataName => respond with json message naming id has been removed, status 204, and end
        //where data name (ex. student or 'post') is the object being returned
    .then(post => res.json({ message: `'${req.params.id}' has been removed` }).status(204).end())

    //ERROR CATCHER
    //catch err =>
    .catch(err => {
        
        //log error err to console
        console.error(err);
        
        //respond status 500 with json message stating error ocurred
        res.status(500).json({ message: "Internal server error" });
        });   

})


//At bottom of file
//export module of router;
module.exports = router;
