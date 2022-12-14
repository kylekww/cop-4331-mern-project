const Confession = require('../models/confession');
const Votes = require('../models/votes');
const User = require('../models/user');
const _ = require('lodash');
const addConfessionValidator = require('../validators/addConfession');
const mongoose = require('mongoose');
const {dbSecretFields, confessionSecretFields} = require('../configs');

//add confession
exports.addConfession = async (req, res) => {
    const validationResult = addConfessionValidator(req.body);
    let ID = await User.findById(req.session.userId);
    if(validationResult !== true){
        return res.status(400).json({message: validationResult});
    }
    const voteObj = new Votes();
    voteObj.save();
    const confession = await Confession.create({...req.body, userID: ID, voteID: voteObj});

    return res.status(201)
    .json({
        message: "confession posted", 
        confession: _.omit(confession.toObject(), confessionSecretFields)
    });

    //_.omit(req.user.toObject(),dbSecretFields)
}

// delete confession 
exports.deleteConfession = async (req, res) => {
    confession = await Confession.findById(req.body.id);
    if(confession == null){
        return res.status(404).json({message: "Confession not found"});
    }
    user = await User.findById(req.session.userId);
    if(user == null){
        return res.status(404).json({message: "User not found"});
    }
    if(user.moderator){
        confession.deleted = -1;
        confession.save()
        return res.status(201).json({message: "This post was deleted by a moderator"});
    }
    else if(!user.moderator){
        confession.deleted = 1;
        confession.save()
        return res.status(201).json(
            {
                message: "This post was deleted successfully", 
            });
    }
}

//search confession
exports.searchConfession = async (req, res) => {

    let resultsPerPage = 15;
    let searchVar = req.body.searchVal;
    let oid = req.body.oid;
    
    // Input: cookie, confession._id "oid" and search criteria
    //if searchVar==1, sort by most recent 
    if (oid == "" && searchVar==1){
        var searchResults = await Confession.find({deleted : 0}).populate({
            path: "voteID",
        }).limit(resultsPerPage).sort({_id: -1}).lean();
    }
    else if(oid == "" && searchVar==2){
        var searchResults = await Confession.find({deleted : 0})
        .populate({
            path: "voteID",
        }).sort({netVotes: -1, _id: -1}).limit(resultsPerPage).lean();
    }
    else if(searchVar==1){
        var searchResults = await Confession.find({
            deleted : 0,
            _id : {$lt: oid}
            }).populate({
                path: "voteID",
            }).limit(resultsPerPage).sort({_id: -1}).lean();
    }
    //if searchVar==2, sort by most popular
    else if(searchVar==2){
        var oldHigh = await Confession.findById(oid);
        var searchResults = await Confession.find( {
            deleted : 0,
            $or : [ { netVotes : oldHigh.netVotes, _id : {$lt : oldHigh._id } },
                 { netVotes : {$lt : oldHigh.netVotes}
                }
            ]
        }).populate({
            path: "voteID",
        }).sort({netVotes: -1, _id: -1}).limit(resultsPerPage).lean();
    }
    else if(searchVar==3 && oid != ""){
        
         var searchResults = await Confession.find({deleted : 0, _id: oid}).populate({
            path: "voteID",
        }).limit(resultsPerPage).sort({_id: -1}).lean();
    }
    else {
        res.status(400).json({message : "Not a valid search type"});
        return;
    }
    
    //declare new temp unsaved fields 
    for(var i = 0; i < searchResults.length; i++){
        searchResults[i]["userInteracted"] = 0;
        searchResults[i]["userCreated"] = 0;
    }

    for (var i = 0; i < searchResults.length; i++) {
        let votes = searchResults[i].voteID;
        
        //check if logged in user created post
        
        if(searchResults[i].userID == req.session.userId){
            searchResults[i].userCreated = 1; 
        }

        //check if user has downvoted
        for(var j = 0; j < votes.downvoteList.length; j++){
            if(votes.downvoteList[j]==req.session.userId){
                searchResults[i].userInteracted = -1;
            }
        }
        //check if user has upvoted
        for(var j = 0; j < votes.upvoteList.length; j++){
            if(votes.upvoteList[j]==req.session.userId){
                searchResults[i].userInteracted = 1;
            }
        }
        delete searchResults[i].voteID.upvoteList;
        delete searchResults[i].voteID.downvoteList;
    }  

    let result = searchResults.map(({userID, ...rest}) => ({...rest}));
    result = result.map(({voteID, ...rest}) => ({...rest}));
    
    if(searchVar == 3) res.status(201).json(result[0]);
    else res.status(201).json(result);
}

//confession information
exports.information = async (req, res) => {
    // returns all of the information about the confession. 
    confession = await Confession.findById(req.body.id);
    return res.json({confession: confession.toObject()});
}

