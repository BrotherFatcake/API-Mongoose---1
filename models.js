//Use strict
"use strict";

//Create a constant to import(require) Mongoose
const mongoose = require("mongoose");

//Create const for SCHEMA
//schemaName is mongoose Schema ({schemaObject})
const blogSchema = mongoose.Schema({
  
  //Within schemaObject specify fieldName: {type: <type>, required: true/false/'do not include'}
  //Example: fieldName: {type: String, required: true}, fieldName2: {type: String}
  title:  {type: String, required: true},
  content:  {type: String, required: true},
  author: {
      firstName:  {type: String, required: true},
      lastName:  {type: String, required: true}
  }

});

//Create **VIRTUALS** to return more human readable sub-values
//Example personName may have sub-values of first and last
//schemaName virtual with arg 'virtualName' get function with no args

blogSchema.virtual("authorFull").get(function() {
  
  //return this.personName.first this.personName.last trim with no args
  return  `${this.author.firstName} ${this.author.lastName}`.trim();
});

//Create cleanUp function to specif what should be returned via the API
//schemaName methods methodName is function with no args
blogSchema.methods.cleanUp = function()  {
  
  //return {object}
  return{
    
    //Within object {key1: this.val1, key2: this.val2, key3: this.virtualName}
    id: this._id,
    title: this.title,
    content: this.content,
    author: this.authorFull,
    created: this.created
  };
};

//Create const modelName is mongoose model with args '<DB collectionName>' and schemaName
const Blog = mongoose.model("blogposts", blogSchema);

//export module modelName
module.exports = {Blog};