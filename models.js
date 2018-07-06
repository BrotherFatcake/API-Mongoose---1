"use strict";

//require mongoose
const mongoose = require("mongoose");

//Schema - const schemaName = mon.Schema({object info})

const blogSchema = mongoose.Schema({
  title:  { type: String, required: true},
  content:  { type: String, required: true},
  author: {
      firstName:  { type: String, required: true},
      lastName:  { type: String, required: true}
  }

});


//schemaName.virtual

blogSchema.virtual('authorFull').get(function() {
  return  `${this.author.firstName} ${this.author.lastName}`.trim()
});

//schemaName.methods.methodName

blogSchema.methods.authorDetail = function()  {
  return{
    id: this. _id,
    title: this.title,
    content: this.content,
    author: this.authorFull
  };
};


const Blog = mongoose.model("Blog", blogSchema);

module.exports = { Blog };