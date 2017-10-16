const User = require('../models/user');//importing user schema
const Blog = require('../models/blog');
const jwt = require('jsonwebtoken');//maintains user login sess?? in login f(x)
const config = require('../config/database');

//express router

module.exports = (router) => { 

    router.post('/newBlog', (req, res) => {

        if(!req.body.title){
            res.json({success: false, message: 'Blog title is required'});
        } else{
            if(!req.body.body){
            res.json({success: false, message: 'Blog body is required'});                
            } else{
                if(!req.body.createdBy){
                    res.json({success: false, message: 'Blog creator is required'});
                } else{
                    const blog = new Blog({
                        title: req.body.title,
                        body: req.body.body,
                        createdBy: req.body.createdBy
                    });
                    blog.save((err) => {
                        if(err){
                            if(err.errors){
                                if(err.errors.title){
                                    res.json({success: false, message: err.errors.title.message});
                                } else{
                                    if(err.errors.body){
                                        res.json({success: false, message: err.errors.body.message});
                                    } else {
                                        res.json({success: false, message: err.errmsg});
                                    }
                                }
                            } else{
                            res.json({succes: false, message: err});
                            }
                        } else {
                            res.json({success: true, message: 'Blog saved!'});
                        }
                    });                    
                }
            }
        }

    });

    //Get all Blogs
    router.get('/allBlogs', (req, res) => {
        Blog.find({}, (err, blogs) => {
            if(err){
                res.json({success: false, message: err});
            } else {
                if(!blogs){
                    ({success: false, message: 'No blogs found.'});
                } else{                  //"name:value pair", blogsArr: blogs
                    res.json({success: true, blogs: blogs}); //no message, since success then pass in blogs
                }//assigns blogs DB collection to object blogs(obj may be called anything, must match in components), which is then sent as a response --> component grabs this as data.blogs
            }
        }).sort({ '_id': -1});//descending order, so newest to oldest
    });

    //for edit-blog
    router.get('/singleBlog/:id', (req, res) => {
        if(!req.params.id){
            res.json({success: false, message: 'No blog ID was provided'});
        }else {
            Blog.findOne({_id: req.params.id}, (err, blog) => {
                if(err){
                    res.json({success: false, message: 'Not a valid blog id'});
                } else{
                    if(!blog){
                        res.json({success: false, message: 'Blog not found'});
                    } else{

                        User.findOne({_id: req.decoded.userId}, (err, user) => {
                            if(err){
                                res.json({success: false, message: err});
                            } else{
                                if(!user){
                                    res.json({success: false, message: 'Unable to authenticate user'});
                                } else{
                                    if(user.username !== blog.createdBy){
                                        res.json({success: false, message: 'You are not authorized to edit this post'});
                                    } else{
                                        res.json({success: true, blog: blog}); // "anything":blog, anything can be "referenced" in service/component
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }
    });

    router.put('/updateBlog', (req, res) => {
        if(!req.body._id){
            res.json({success: false, message: 'No Blog Id provided'});
        } else {
            Blog.findOne({_id: req.body._id}, (err, blog) => {
                if(err){
                    res.json({success: false, message: 'Not a valid blog ID'});
                } else {
                    if(!blog){
                        res.json({success: false, message: 'Blog ID was not found'});
                    } else{
                        User.findOne({_id: req.decoded.userId}, (err, user) => {
                            if(err){
                                res.json({success: false, message: err});
                            } else{
                                if(!user){
                                    res.json({success: false, message: 'Unable to authenticate user'});
                                } else{
                                    if(user.username !== blog.createdBy){
                                        res.json({success: false, message: 'You are not authorized to edit this blog'});
                                    } else{
                                        blog.title = req.body.title;
                                        blog.body = req.body.body;
                                        blog.save((err) => {
                                            if(err){
                                                res.json({success: false, message: err});
                                            } else{
                                                res.json({success: true, message: 'Blog Updated!'});
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    }
                }
            });//_id different than params.id, the way its sent
        }
    });

    router.delete('/deleteBlog/:id', (req,res) => {
        if(!req.params.id){//ensuring params passed
            res.json({succes: false, message: 'No id was passed'});
        } else{
            Blog.findOne({_id: req.params.id}, (err, blog) => {
                if(err){
                    res.json({success: false, message: 'Invalid Id'});
                } else{
                    if(!blog){
                        res.json({success: false, message: 'Blog was not found'});
                    } else{
                        User.findOne({ _id: req.decoded.userId }, (err, user) => {
                            if(err){
                                res.json({success: false, message: err});
                            } else{
                                if(!user) {
                                    res.json({success: false, message: 'Unable to authenticate user'});
                                } else{
                                    if(user.username !== blog.createdBy){
                                        res.json({success: false, messge: 'You are not authorized to delete this blog'});
                                    } else{
                                        blog.remove((err) => {
                                            if(err) {
                                                res.json({success: false, message: err});
                                            } else{
                                                res.json({success: true, message: 'Blog Deleted Successfully' });
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }
    });

    //for likes/dislikes
    router.put('/likeBlog', (req, res) => {
        if(!req.body.id){
            res.json({success: false, message: 'No id was provided'});
        } else{
            Blog.findOne({ _id: req.body.id}, (err, blog) => {
                if(err){
                    res.json({ success: false, message: 'Invalid Blog id'});
                } else{
                    if(!blog){
                        res.json({success: false, message: 'That blog was not found'});
                    } else{//user == createdBy?
                        User.findOne({_id: req.decoded.userId}, (err, user) => {
                            if(err){
                                res.json({success: false, message: 'Some error occurred'});
                            } else{
                                if(!user){
                                    res.json({success: false, message: 'Could not authenticate user'});
                                } else{
                                    if(user.username === blog.createdBy){
                                        res.json({success: false, message: 'Cannot like your own post'});
                                    } else{//did user like this already, check array of users who liked
                                        //includes is a mongoose f(x)
                                        if(blog.likedBy.includes(user.username)){
                                            res.json({success: false, message: 'You already liked this post'});
                                        } else{//if prev disliked, remove from dislike to like
                                            if(blog.dislikedBy.includes(user.username)){
                                                blog.dislikes--;//decrement by 1
                                                //look for user in dislike array
                                                const arrayIndex = blog.dislikedBy.indexOf(user.username);
                                                blog.dislikedBy.splice(arrayIndex, 1);//removing a user at a time
                                                blog.likes++;
                                                blog.likedBy.push(user.username);
                                                blog.save((err) => {
                                                    if(err){
                                                        res.json({success: false, message: 'Something went wrong'});
                                                    } else{
                                                        res.json({success: true, message: 'Blog liked!'});
                                                    }
                                                });//end of liking, if person disliked previously///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                            } else{
                                                blog.likes++;
                                                blog.likedBy.push(user.username);
                                                blog.save((err) => {
                                                    if(err){
                                                        res.json({success: false, message: 'Something went wrong'});
                                                    } else{
                                                        res.json({success: true, message: 'Blog liked!'});
                                                    }
                                                });//end of liking, normal
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }
    });
//now dislike blog
        router.put('/dislikeBlog', (req, res) => {
        if(!req.body.id){
            res.json({success: false, message: 'No id was provided'});
        } else{
            Blog.findOne({ _id: req.body.id}, (err, blog) => {
                if(err){
                    res.json({ success: false, message: 'Invalid Blog id'});
                } else{
                    if(!blog){
                        res.json({success: false, message: 'That blog was not found'});
                    } else{//user == createdBy?
                        User.findOne({_id: req.decoded.userId}, (err, user) => {
                            if(err){
                                res.json({success: false, message: 'Some error occurred'});
                            } else{
                                if(!user){
                                    res.json({success: false, message: 'Could not authenticate user'});
                                } else{
                                    if(user.username === blog.createdBy){
                                        res.json({success: false, message: 'Cannot dislike your own post'});
                                    } else{//did user dislike this already, check array of users who disliked
                                        //includes is a mongoose f(x)
                                        if(blog.dislikedBy.includes(user.username)){
                                            res.json({success: false, message: 'You already disliked this post'});
                                        } else{//if prev liked, remove from like to dislike
                                            if(blog.likedBy.includes(user.username)){
                                                blog.likes--;//decrement by 1
                                                //look for user in like array
                                                const arrayIndex = blog.likedBy.indexOf(user.username);
                                                blog.likedBy.splice(arrayIndex, 1);//removing a user at a time
                                                blog.dislikes++;
                                                blog.dislikedBy.push(user.username);
                                                blog.save((err) => {
                                                    if(err){
                                                        res.json({success: false, message: 'Something went wrong'});
                                                    } else{
                                                        res.json({success: true, message: 'Blog disliked!'});
                                                    }
                                                });//end of disliking, if person liked previously///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                            } else{
                                                blog.dislikes++;
                                                blog.dislikedBy.push(user.username);
                                                blog.save((err) => {
                                                    if(err){
                                                        res.json({success: false, message: 'Something went wrong'});
                                                    } else{
                                                        res.json({success: true, message: 'Blog disliked!'});
                                                    }
                                                });//end of disliking, normal
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }
    });

    //Post comments on blogs
    router.post('/comment', (req, res) => {
        if(!req.body.comment){
            res.json({success: false, message: 'No comment provided'});
        } else{
            if(!req.body.id){
                res.json({success: false, message: 'No id was provided'});
            } else{
                Blog.findOne({ _id: req.body.id}, (err, blog) => {
                    if(err){
                        res.json({success: false, message: 'Invalid blog id'});
                    } else{
                        if(!blog){
                            res.json({success: false, message: 'Blog not found'});
                        } else{
                            User.findOne({_id: req.decoded.userId}, (err, user) => {
                                if(err){
                                    res.json({success: false, message: 'Something went wrong'});
                                } else{
                                    if(!user){
                                        res.json({success: false, message: 'User not found'});
                                    } else{
                                        blog.comments.push({//how to add to arrays in DB
                                            comment: req.body.comment,
                                            commentator: user.username    
                                        });
                                        blog.save((err) => {
                                            if(err){
                                                res.json({success: false, message: 'Something went wrong'});
                                            } else{
                                                res.json({success: true, message: 'Comment saved'});
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });

    return router;
};


//find{} blogs 
//blogsArr: blogs

//component is blogs Arr