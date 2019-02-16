const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = express.Router();
const port = 4000;

let zylotech = require('./zylotech.model');
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/zylotech',{useNewUrlParser:true});
const connection = mongoose.connection

connection.once('open',function(){
    console.log('MongoDb connected successfully!!')
})

routes.route('/events').get(function(req, res){
    zylotech.find(function(err, zylotech){
        if(err){
            console.log(err);
        }
        else{
            res.json({
                zylotech
            })
        }
    })
})

routes.route('/events/add').post(function(req,res){
    let zylotec = new zylotech(req.body);
    zylotec.save()
            .then(zylotech =>{
                res.status(200).json({
                    zylotech
                })
                .catch(err => {
                    res.status(400).send('adding task failes');
                });
            });
})

routes.route('/events/:id').delete(function(req,res){
    const id =req.params.id;
    zylotech.remove({_id : id})
            .exec()
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.json({
                    'error' : err
                })
            })
    
})
app.use('/', routes);

app.listen(port, function(){
    console.log('server is ruuning on port:' + port);
});