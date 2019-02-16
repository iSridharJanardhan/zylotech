const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
let zylotech = new Schema({
    task_name:{
        type:String
    },
    task_desc:{
        type:String
    },
    date:{
        type:String
    },
    time:{
        type:Number
    }
})

module.exports = mongoose.model('zylotech', zylotech)