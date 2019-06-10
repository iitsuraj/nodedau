var router = require('express').Router();
var Category = require('../models/category');

router.post('/category', function(req,res,next){
    var category = new Category();
    category.name = req.body.category;
    category.save(function(err, category){
        if (err) next(err);
        res.json(category);
    })
})
module.exports =router;
