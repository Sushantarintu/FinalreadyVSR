const mongoose= require('mongoose')

const imageDetailSchema= mongoose.Schema({
    imagePath:String
},
{
    collection:'ImageDetails',
});

mongoose.model("ImageDetails",imageDetailSchema)