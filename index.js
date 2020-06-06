const express = require('express');
const bodyParser = require('body-parser');
const cors=require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
var multer  = require('multer');
var fs= require('fs');
const path=require('path');
const nodemailer=require('nodemailer');
const client=new MongoClient("mongodb://localhost:27017/tourism" , { useNewUrlParser:true});

let tourismdbclient;

var i=1;
 tempUsername="";
 tempType="";
tempothercategory="";
 var storage = multer.diskStorage(
    {
    destination: function (req, file, cb) {
      cb(null, './temp/')
    },
    filename: function (req, file, cb) {
      cb(null,"temp.jpg")
    }
  })
  var upload = multer({ storage: storage }) 

client.connect
(
    (err,db)=>
    {
        if(!err)
          {
              tourismdbclient=db;
          }
        else
        {
            console.log(err);
        }  
    }
)
let app=express();
app.use(cors());
app.use(express.static(path.join(__dirname,"temp")));

/* Signup */
app.post('/register',bodyParser.json() ,(req,res)=>{
      
    const collection = tourismdbclient.db('tourism').collection("userinfo");

    collection.insertOne(req.body, (err,r)=>{
        console.log("result of insert is -> " +r.ops[0]);
        console.log("result of insert is _id -> " +r.insertedId);
        if(!err)
       {
        res.send({msg:"sucessfully inserted", status:'OK', description:'all ok'});
       
       }
       else
       {
        res.send({msg:" not inserted", status:'Failed', description:'error in monogo db'});
       }

    });
    
})
/* Login */
app.post('/login',bodyParser.json() ,(req,res)=>{
    
    const collection = tourismdbclient.db('tourism').collection("userinfo");
    
    collection.findOne({'username':req.body.username, 'password':req.body.password}, (err,docs)=>{
        if(docs!=null)
        {
            console.log("no error, username and pwd found in database ");
            res.send({msg:"sucessfully Logged In", status:'OK', description:docs});
        }
        else
        {
            console.log("error , no such username and pwd in the database");
            res.send({msg:"Login failed", status:'NOT OK', description:docs});
        }
        
    });
    
    })
/* Form Data */
app.post('/formInfo',bodyParser.json() ,(req,res)=>{
    
    const collection = tourismdbclient.db('tourism').collection("formInfo");

    collection.insertOne(req.body, (err,r)=>{
        console.log("result of insert is -> " +r.ops[0]);
        console.log("result of insert is _id -> " +r.insertedId);
        if(!err)
        {
        res.send({msg:"sucessfully inserted", status:'OK', description:'all ok'});
        }
        else
        {
        res.send({msg:" not inserted", status:'Failed', description:'error in monogo db'});
        }

    });
    
})    
/* Getting data  */
 /* app.get('/formData',(req,res)=>{
   
    const collection = tourismdbclient.db('tourism').collection("courses");
    
    collection.find().toArray(function(err, docs) {
        console.log(docs);
        res.send(docs);
      });
    
    }) 
    */
   
    /* Getting file */
  app.post('/file',upload.single('myFile'),(req,res,next)=>
  {
if(req.body.username!=this.tempUsername || req.body.Type!=this.tempType ||req.body.count=="true" || req.body.othercategory!=this.tempothercategory)
{
    i=1;
}
console.log(req.body.username);
console.log(req.body.Type);
console.log(req.body.othercategory);
const collection=tourismdbclient.db('tourism').collection('formInfo');
collection.updateOne({'username':req.body.username},{$inc:{imgCount:1}},(err,r)=>
{
    if(!err)
    {
        if(req.body.othercategory==null){
            fs.renameSync('./temp/temp.jpg','./temp/'+req.body.username+req.body.Type+i+'.jpg');
        i++;
        this.tempUsername=req.body.username;
        this.tempType=req.body.Type;
        res.send({msg:"okay"});
        }
        else{
        fs.renameSync('./temp/temp.jpg','./temp/'+req.body.username+req.body.Type+req.body.othercategory+i+'.jpg');
        i++;
        this.tempUsername=req.body.username;
        this.tempothercategory=req.body.othercategory;
        this.tempType=req.body.Type;
        res.send({msg:"okay"});
        }
    }
    else
    {
        res.send({msg:"not okay"});
    }
})
  })  
  /* getting form data */
app.get('/getData',(req,res)=>
{
    const collection=tourismdbclient.db('tourism').collection('formInfo');
    collection.find().toArray(function(err, docs) {
        console.log(docs);
        res.send(docs);
    });
}
);
/* email */
app.post("/email" ,bodyParser.json() , (req , res)=>
{
    console.log("request came");
    console.log(req.body);
   let user=req.body;
   console.log(user);
   let transporter=nodemailer.createTransport
   (
    {
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth:
        {
            user:"info.tourism01@gmail.com",
            pass:"tourism@123"
        }

    }
  );
let mailOptions=
{
from:"info.tourism01@gmail.com",
to:user.email,
subject:'Welcome!',
html: `<h3>Hi ${user.name} </h3><br><h1>Thanks for subscribing!</h1>`
};
transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
   /*  sendMail( (user , info) => {
        console.log("mail has been sent");
        res.send(info);
    });  */
}
);

app.post('/u',bodyParser.json() ,(req,res)=>{

    
    const collection = tourismdbclient.db('tourism').collection("formInfo");
    console.log(req.body.username);
    console.log(req.body.updatename);
    
    collection.remove({username:req.body.username,PropertyType:req.body.updatename});
    collection.insertOne(req.body, (err,r)=>{
        console.log("result of insert is -> " +r.ops[0]);
        console.log("result of insert is _id -> " +r.insertedId);
        if(!err)
        {
        res.send({msg:"sucessfully inserted", status:'OK', description:'all ok'});
        }
        else
        {
        res.send({msg:" not inserted", status:'Failed', description:'error in monogo db'});
        }

    });
    
}) 
app.post('/delete',bodyParser.json() ,(req,res)=>{

    
    const collection = tourismdbclient.db('tourism').collection("formInfo");
    console.log(req.body.username);
    //console.log(req.body.updatename);
    
    collection.remove({username:req.body.username,PropertyType:req.body.currentPropertyType});
    
    
})
app.post('/password',bodyParser.json(),(req,res)=>{
    const collection=tourismdbclient.db('tourism').collection("userinfo");
    collection.findOne({username:req.body.currentUserId},(err,docs)=>{
        if(docs!=null){
            console.log("in password change api");
            console.log(docs);
            collection.updateOne({username:req.body.currentUserId},{$set:{password:req.body.newPassword}},(err,r)=>{
                if(!err){
                    console.log(req.body.newPassword);
                    res.send({msg:"Password successfully Updated"});
                }
                else{
                    res.send({msg:"something went wrong"});
                }
            })
        }
    })
})     

app.get('/getSignupData',(req,res)=>
{
    console.log("api");
    const collection=tourismdbclient.db('tourism').collection('userinfo');
    collection.find().toArray(function(err, docs) {
        console.log(docs);
        res.send(docs);
    });
}
);
    

app.listen(3000,()=>{console.log("listening 3000");
})
