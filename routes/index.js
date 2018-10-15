var express = require('express');
var router = express.Router();

/* GET home page. */

var User = require('../server/models/Post').User;
var Post = require('../server/models/Post').Post;
var Pic = require('../server/models/Post').Pic;

const formidable = require('formidable');
const fs = require('fs-extra');
const path = require('path');
const config = require('../etc/config');

// Defined store route

router.get('/mypage', function(req, res, next) {
    if (req.session.user){
        User.findById(req.session.user,function(err,user){
            if (err) next(err);
            res.status(302);
            res.setHeader('Location','/user/'+encodeURI(user.name));
            res.end();
        })
    } else {
        res.render('index', { title: 'Express' , name: 'Гость' });
    }
});
// 
// router.get('/login', function(req, res, next) {
//     res.render('index');
// });

// upload 

router.post('/uploadavatar', function(req, res, next) {

    console.log('upload 1')

    if (req.session.own){

         console.log('upload 2')

        var namedir, currpath;

        User.findById(req.session.user,function(err,user){


            console.log('upload 3')

            console.log('cookie: ',user.name)

            var dir = config.upload;
            
            namedir = user.name+'';
            currpath = path.join(config.upload,namedir);

            console.log('currpath ',currpath)

            if (fs.existsSync(currpath)){
                fs.readdir(currpath,function(err,files){
                    for (const file of files){
                        fs.unlink(path.join(currpath,file),function(err){
                            // remove
                        })
                    }
                })
            }

            console.log('upload 4')

            fs.mkdirs(currpath,function(err){

                console.log('upload 5')

                var filename;

                let form = new formidable.IncomingForm();
                form.uploadDir = path.join(process.cwd(),currpath);

                // form.parse(req);

                form.parse(req,function(err,fields,file){

                    console.log('upload 6 '+file.file.name)

                    filename = file.file.name;

                    fs.rename(file.file.path,path.join(dir,namedir,file.file.name),function(err){
                        if (err) {
                            fs.unlink(path.join(dir, file.file.name)); 
                            fs.rename(file.file.path, file.file.name);
                        }
                    })

                    dir = dir.substr(dir.indexOf('/'));

                    Pic.findOne({owner: user._id},function(err,c){
                        if (c){
                            console.log('pic update')
                            Pic.update({owner: user._id},{$set: {picture: path.join(dir,namedir,file.file.name),
                             name: file.file.name, owner: user._id}},function(err,item){
                                if (err) console.log(err);
                            })
                        } else {
                            console.log('pic create')
                            Pic.create({
                                name: file.file.name,
                                owner: user._id, 
                                picture: path.join(dir,namedir,file.file.name)
                            },function(err,item){
                                if (err) console.log(err);
                            })
                        }
                    })

                })

                console.log('upload 7')

                res.send('success');

                // form.on('fileBegin', function (name, file){
                //     console.log('begin')
                //     file.path = path.join(dir,namedir,file.name);
                // });

                // form.on('progress', function(bytesReceived, bytesExpected) {
                //     var percent_complete = (bytesReceived / bytesExpected) * 100;
                //     console.log(percent_complete.toFixed(2));
                // });

                // form.on('file', function (name, file){

                //     filename = file.name;

                //     console.log('Uploaded ' + file.name);

                //     dir = dir.substr(dir.indexOf('/'));

                //     console.log('userid',user._id)

                //     Pic.findOne({owner: user._id},function(err,c){
                //         if (c){
                //             Pic.update({owner: user._id},{$set: {picture: path.join(dir,namedir,file.name), name: file.name, owner: user._id}},function(err,item){
                //                 if (err) console.log(err);
                //             })
                //         } else {
                //             Pic.create({
                //                 name: file.name,
                //                 owner: user._id, 
                //                 picture: path.join(dir,namedir,file.name)
                //             },function(err,item){
                //                 if (err) console.log(err);
                //             })
                //         }
                //     })

                // });

                // form.on('end', function() {
                //     res.send('success');
                // });

                // function fileSaved(){
                //     if (fs.existsSync(path.join(dir,namedir,filename))){
                //         console.log('file exists')
                //         res.send('success');
                //     } else {
                //         console.log('file does not exist'+path.join(dir,namedir,filename))
                //         setTimeout(function(){
                //             fileSaved()
                //         },500)
                //     }
                // }


                // form.parse(req,function(err,fields,file){

                // fs.rename(file.file.path,path.join(dir,namedir,file.file.name),function(err){
                //     if (err) {
                //         fs.unlink(path.join(dir, file.file.name)); 
                //         fs.rename(file.file.path, file.file.name);
                //     }

                //     dir = dir.substr(dir.indexOf('/'));

                //     Pic.findOne({owner: user._id},function(err,c){
                //         if (c){
                //             Pic.update({},{$set: {picture: path.join(dir,namedir,file.file.name), name: file.file.name}},function(err,item){
                //                 if (err) console.log(err);
                //             })
                //         } else {
                //             Pic.create({
                //                 name: file.file.name,
                //                 owner: user._id, 
                //                 picture: path.join(dir,namedir,file.file.name)
                //             },function(err,item){
                //                 if (err) console.log(err);
                //             })
                //         }
                //     })

                //     res.send('Picture saved');

                // });

                // })

            })

        })

    }

});

// register

router.post('/register', function(req, res, next) {

    console.log('register: ', req.body);

    var nick = req.body.name;
    var pass = req.body.password;

    User.create({name: nick, password: pass},function(err,user){
        if (err) {
            res.status(400).send("Sorry! Error");
        } else {
            // res.render('register', { title: 'Express', result: 'Вы успешно зарегистрировались!' });
            res.status(200).json(req.body);
        }
    })
});

// login

router.post('/login', function(req, res, next) {

  var nick = req.body.name;
  var pass = req.body.password;

  User.findOne({name: nick},function(err,user){
    if (err) console.log('error')
    if (user){
        if (user.checkPassword(pass)){

        req.session.name = user.name;
        req.session.user = user._id;

        console.log('logined',req.session.user)

        // Pic.findOne({owner: user._id},function(err,pic){
        //     if (pic){
        //         Object.assign(obj, {path: pic.picture});
        //         res.send({ value: 'Successfully', session: req.session.name})
        //     } else {

        //     }
        // })
        res.send({ value: 'Successfully', session: req.session.name})
    } else {
        res.send({ value: 'Failed', session: []})
        // next(e.setError(401));
    }
    } else {
      res.send({ value: 'Failed', session: []})
      // next(e.setError(401));
    }
  })
  
});

router.route('/session').get(function (req, res) {

    if (req.session.user){

        var obj = {
            name: req.session.name,
            pic: ''
        };

        var promise = new Promise(function(resolve,reject){
            Pic.findOne({owner: req.session.user},function(err,pic){
                console.log(pic)
                if (pic){
                    console.log(pic.picture)
                    Object.assign(obj, {pic: pic.picture.replace(/\\/g,'/')});
                    resolve();
                } else {
                    reject(obj);
                }
            })
        })

        promise.then(function(){
            res.send(obj);
        },function(){
            res.send(obj);
        })

    } else {
        res.send([]);
    }

});

router.route('/userinfo/:id').get(function (req, res) {
    
    User.findOne({name: req.param('id')},function(err,user){

    if (err) console.log(err);

        if (user){

            var obj = {
                pic: '',
                name: user.name,
                posts: [],
                owner: false
            };

            console.log('sessions: ----------', req.session.user,user._id)

            if (req.session.user == user._id){
                req.session.own = true;
                Object.assign(obj, {owner: true});
                console.log('own true')
            } else {
                req.session.own = false;
                console.log('own false')
            }

            var idd = user._id;

            Pic.findOne({owner: idd},function(err,pic){
                if (pic){
                    Object.assign(obj, {pic: pic.name, name: user.name});
                }
            }).then(function(){
                Post.find({owner: idd},function(err, posts){
                    if(err){
                        console.log(err);
                    }
                    else {
                        Object.assign(obj, {posts: posts});
                        res.send(obj)
                    }
                });
            })

        } else {
            res.send('no user');
        }
    })

});

router.route('/posts/add').post(function (req, res) {

    Post.find({owner: req.session.user},function(err,blog){

        var posts = blog.length;

        if (posts>4) {
            Post.remove({_id: blog[0]._id},function(err,blog){

            })
        }

        console.log('owner',req.session.user)

        Post.create({
                title: req.body.title,
                owner: req.session.user,
                body: req.body.body
            }
            ,function(err,item){
                if (err) console.log(err);
                res.json(item)
            }
        )

       

    });

});

// Defined get data(index or listing) route

router.route('/').get(function (req, res) {
    Post.find(function (err, posts){
    if(err){
      console.log(err);
    }
    else {
      // res.json(posts);
      res.render('index');
    }
  });
});

router.get('/exit', function(req, res, next) {
    if (req.session.user){
        User.findById(req.session.user,function(err,user){
            req.session.destroy();
            res.send([]);
        })
    } else {
        res.send([]);
    }
});

router.route('/posts/:id').get(function (req, res) {
    User.findOne({name: req.param('id')},function(err,user){
        Post.find({owner: user._id},function(err, posts){
            if(err){
                console.log(err);
            }
            else {
                res.json(posts);
            }
        });
    })
});

// Defined delete | remove | destroy route

router.route('/posts/delete/:id').get(function (req, res) {
  console.log(req.params.id)
    Post.findByIdAndRemove({_id: req.params.id}, function(err, post){
        if(err) res.json(err);
        else res.json(req.params.id);
    });
});

module.exports = router;
