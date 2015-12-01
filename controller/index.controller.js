
var mysql = require('../config/db').pool;
var nodemailer = require('nodemailer');
var userManager = require('../models/userModel');
var crypto = require('crypto');
algorithm = 'aes-256-ctr', //Algorithm used for encrytion
 password = 'd6F3Efeq'; //Encryption password

function encrypt(text){
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text){
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}


function getDate(val) {
    var d = new Date(val);
    var dt = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    var selectdate = Pad("0", dt, 2) + '/' + Pad("0", month, 2)  + '/' + year;
    return selectdate;
}

function getTime(val) {
    var d = new Date(val);
    var minite = d.getMinutes();
    var hour = d.getHours();
    var second = d.getSeconds();
    var selectdate = Pad("0", hour, 2) + ':' + Pad("0", minite, 2) + ':' + Pad("0", second, 2);
    return selectdate;
}
function Pad(padString, value, length) {
    var str = value.toString();
    while (str.length < length)
        str = padString + str;

    return str;
}

/**
 * @function pages
 * @param req
 * @param res
 * @param next
 * @description get list of menus with related pages
 */
exports.pages = function (req, res, next) {
    var role;

    var pagesjson = [
        { 'pagename': 'Add Page', 'href': 'add-page', 'id': 'add-page', 'class': 'fa fa-briefcase', 'submenuflag': '0', 'sub': [] },
        { 'pagename': 'Page Listing', 'href': 'page-listing', 'id': 'page-listing', 'class': 'fa fa-align-left', 'submenuflag': '0', 'sub': [] },
        { 'pagename': 'Change Password', 'href': 'changepassword', 'id': 'changepassword', 'class': 'fa fa-align-left', 'submenuflag': '0', 'sub': [] }
    ];

    if (req.session) {
        if (req.session.publish_UserName) {
            if (req.session.publish_StoreId) {
                role = req.session.publish_UserRole;
                var pageData = getPages(role);
                //res.render('index', { title: 'Express', username: req.session.publish_UserName, Pages: pageData, userrole: req.session.publish_UserRole });
                res.render('index', { title: 'Express', username: req.session.publish_FullName, Pages: pageData, userrole: req.session.publish_UserType, lastlogin: " " + getDate(req.session.publish_lastlogin) + " " + getTime(req.session.publish_lastlogin) });
            }
            else {
                res.redirect('/accountlogin');
            }
        }
        else {
            res.redirect('/accountlogin');
        }
    }
    else {
        res.redirect('/accountlogin');
    }
}

/**
 * @function login
 * @param req
 * @param res
 * @param next
 * @description user can login
 */
//exports.login = function (req, res, next) {
//    if (req.session) {
//        if (req.session.publish_UserName) {
//            if (req.session.publish_StoreId) {
//                res.redirect("/add-page");
//            }
//            else {
//                res.redirect("/accountlogin");
//            }
//        }
//        else {
//            res.render('account-login', { error: '' });
//        }
//    }
//    else {
//        res.render('account-login', { error: '' });
//    }
//}
exports.login = function (req, res, next) {
    if(req.cookies.publish_remember == 1 && req.cookies.publish_username != '' ){
        mysql.getConnection('CMS', function (err, connection_ikon_cms) {
            userManager.getUserDetails( connection_ikon_cms, decrypt(req.cookies.publish_username), decrypt(req.cookies.publish_password), function( err, userDetails ){
                if (err) {
                    res.render('account-login', { error: 'Error in database connection' });
                } else {
                    if (userDetails.length > 0) {
                        if (userDetails[0].ld_active == 1) {
                            if(userDetails[0].ld_role == 'Store Manager') {
                                connection_ikon_cms.release();
                                var session = req.session;
                                session.publish_UserId = userDetails[0].ld_id;
                                session.publish_UserRole = userDetails[0].ld_role;
                                session.publish_UserName = userDetails[0].ld_user_name;
                                session.publish_Password = userDetails[0].ld_user_pwd;
                                session.publish_Email = userDetails[0].ld_email_id;
                                session.publish_FullName = userDetails[0].ld_display_name;
                                session.publish_lastlogin = userDetails[0].ld_last_login;
                                session.publish_UserType = userDetails[0].ld_user_type;
                                session.publish_StoreId = userDetails[0].su_st_id;
                                if (req.session) {
                                    if (req.session.publish_UserName) {
                                        if (req.session.publish_StoreId) {
                                            res.redirect("/");
                                        }
                                        else {
                                            res.redirect("/accountlogin");
                                        }
                                    }
                                    else {
                                        res.render('account-login', { error: '' });
                                    }
                                }
                                else {
                                    res.render('account-login', { error: '' });
                                }
                            }
                        }
                    }
                }
            });
        });
    }else if (req.session) {
        if (req.session.publish_UserName) {
            if (req.session.publish_StoreId) {
                res.redirect("/add-page");
            }
            else {
                res.redirect("/accountlogin");
            }
        }
        else {
            res.render('account-login', { error: '' });
        }
    }
    else {
        res.render('account-login', { error: '' });
    }
}
/**
 * @function logout
 * @param req
 * @param res
 * @param next
 * @description user can logout
 */
exports.logout = function (req, res, next) {
    try {
        if (req.session) {
            if (req.session.publish_UserName) {
                if (req.session.publish_StoreId) {
                    // req.session = null;
                     var session = req.session;
                    session.publish_UserId = null;
                    session.publish_UserRole = null;
                    session.publish_UserName = null;
                    session.publish_Password = null;
                    session.publish_Email = null;
                    session.publish_FullName = null;
                    session.publish_lastlogin = null;
                    session.publish_UserType = null;
                    session.publish_StoreId = null;
                    res.clearCookie('publish_remember');
                    res.clearCookie('publish_username');
                    res.clearCookie('publish_password');

                    res.redirect('/accountlogin');
                }
                else {
                    res.redirect('/accountlogin');
                }
            }else{
                res.redirect('/accountlogin');
            }
        }
        else {
            res.redirect('/accountlogin');
        }
    }
    catch (error) {
        res.render('account-login', { error: error.message });
    }
}
/**
 * @function authenticate
 * @param req
 * @param res
 * @param next
 * @description user is authenticated
 */
exports.authenticate = function (req, res, next) {
    try {
        mysql.getConnection('CMS', function (err, connection_ikon_cms) {
            if(req.body.rememberMe){
                var minute = 10080 * 60 * 1000;
                res.cookie('publish_remember', 1, { maxAge: minute });
                res.cookie('publish_username', encrypt(req.body.username), { maxAge: minute });
                res.cookie('publish_password', encrypt(req.body.password), { maxAge: minute });
            }
            userAuthDetails(connection_ikon_cms,req.body.username,req.body.password,req,res);
        });
    }
    catch (error) {
        res.render('account-login', { error: 'Error in database connection' });
    }
}
function userAuthDetails(dbConnection, username,password,req,res){
    userManager.getUserDetails( dbConnection, username, password, function( err, userDetails ){
        if (err) {
            res.render('account-login', { error: 'Error in database connection' });
        } else {
            if (userDetails.length > 0) {
                if (userDetails[0].ld_active == 1) {
                    if(userDetails[0].ld_role == 'Store Manager') {
                        var session = req.session;
                        session.publish_UserId = userDetails[0].ld_id;
                        session.publish_UserRole = userDetails[0].ld_role;
                        session.publish_UserName = userDetails[0].ld_user_name;
                        session.publish_Password = userDetails[0].ld_user_pwd;
                        session.publish_Email = userDetails[0].ld_email_id;
                        session.publish_FullName = userDetails[0].ld_display_name;
                        session.publish_lastlogin = userDetails[0].ld_last_login;
                        session.publish_UserType = userDetails[0].ld_user_type;
                        session.publish_StoreId = userDetails[0].su_st_id;//coming from new store's user table.
                        userManager.updateLastLoggedIn( dbConnection, userDetails[0].ld_id ,function(err,response){
                            if(err){
                                dbConnection.release();
                            }else{
                                dbConnection.release();
                                res.redirect('/');
                            }
                        })
                    } else {
                        dbConnection.release();
                        res.render('account-login', { error: 'Only Store Admin/Manager are allowed to login' });
                    }
                }
                else {
                    dbConnection.release();
                    res.render('account-login', { error: 'Your account has been disable' });
                }
            } else {
                dbConnection.release();
                if( req.body.username != undefined && req.body.username.length == 0  &&  req.body.password.length == 0 ) {
                    res.render('account-login', {error: 'Please enter username and password'});
                }else if(req.body.username != undefined && req.body.username.length != 0  &&  req.body.password.length == 0 ){
                    res.render('account-login', {error: 'Please enter password'});
                }
                else if(req.body.username != undefined && req.body.username.length == 0  &&  req.body.password.length != 0){
                    res.render('account-login', {error: 'Please enter username'});
                }
                else {
                    res.render('account-login', {error: 'Invalid Username / Password'});
                }
            }
        }
    });
}
//    try {
//        mysql.getConnection('CMS', function (err, connection_central) {
//            var query = connection_central.query('SELECT * FROM icn_login_detail AS user JOIN icn_store_user AS store_user ON user.ld_id = store_user.su_ld_id where BINARY ld_user_id= ? and BINARY ld_user_pwd = ? ', [req.body.username, req.body.password], function (err, row, fields) {
//                if (err) {
//                    res.render('account-login', { error: 'Error in database connection.' });
//                } else {
//                    if (row.length > 0) {
//                        if (row[0].ld_active == 1) {
//                            if(row[0].ld_role == 'Store Manager') {
//
//                                var session = req.session;
//                                session.publish_UserId = row[0].ld_id;
//                                session.publish_UserRole = row[0].ld_role;
//                                session.publish_UserName = req.body.username;
//                                session.publish_Password = req.body.password;
//                                session.publish_Email = row[0].ld_email_id;
//                                session.publish_FullName = row[0].ld_display_name;
//                                session.publish_lastlogin = row[0].ld_last_login;
//                                session.publish_UserType = row[0].ld_user_type;
//                                session.publish_StoreId = row[0].su_st_id;//coming from new store's user table.
//
//                                var query = connection_central.query('UPDATE icn_login_detail '+
//                            '               SET ld_last_login=NOW() WHERE ld_id=? ', [row[0].ld_id], function (err, row, fields) {
//                                if (err) {
//                                    res.render('account-login', { error: 'Error in database connection.' });
//                                } else {
//                                    connection_central.release();
//                                    res.redirect('/');
//                                }
//                            });
//
//
//                            } else {
//                                connection_central.release();
//                                res.render('account-login', { error: 'Only Store Admin/Manager are allowed to login.' });
//                            }
//                        }
//                        else {
//                            connection_central.release();
//                            res.render('account-login', { error: 'Your account has been disable.' });
//                        }
//                    } else {
//                        connection_central.release();
//
//
//                        if( req.body.username.length == 0  &&  req.body.password.length == 0 ) {
//                            res.render('account-login', {error: 'Please enter username and password'});
//                        }else if(req.body.username.length != 0  &&  req.body.password.length == 0 ){
//                            res.render('account-login', {error: 'Please enter password'});
//                        }
//                        else if(req.body.username.length == 0  &&  req.body.password.length != 0){
//                            res.render('account-login', {error: 'Please enter username'});
//                        }
//                        else {
//                            res.render('account-login', {error: 'Invalid Username / Password'});
//                        }
//
//                    }
//                }
//            });
//        })
//    }
//    catch (error) {
//        res.render('account-login', { error: 'Error in database connection.' });
//    }
//}
/**
 * #function getPages
 * @param role
 * @returns json array
 * @description get list of pages allowed as per user-role
 */
function getPages(role) {
    if (role == "Super Admin" || role == "Store Manager") {

        var pagesjson = [
            { 'pagename': 'Add Page', 'href': 'add-page', 'id': 'add-page', 'class': 'fa fa-briefcase', 'submenuflag': '0', 'sub': [] },
            { 'pagename': 'Page Listing', 'href': 'page-listing', 'id': 'page-listing', 'class': 'fa fa-align-left', 'submenuflag': '0', 'sub': [] },
            { 'pagename': 'Change Password', 'href': 'changepassword', 'id': 'changepassword', 'class': 'fa fa-align-left', 'submenuflag': '0', 'sub': [] }
        ];
        return pagesjson;
    }
}
/**
 * @function viewForgotPassword
 * @param req
 * @param res
 * @param next
 * @description display forgot password page
 */
exports.viewForgotPassword = function (req, res, next) {
    // req.session = null;
     var session = req.session;
    session.publish_UserId = null;
    session.publish_UserRole = null;
    session.publish_UserName = null;
    session.publish_Password = null;
    session.publish_Email = null;
    session.publish_FullName = null;
    session.publish_lastlogin = null;
    session.publish_UserType = null;
    session.publish_StoreId = null;
    res.render('account-forgot', { error: '', msg: '' });
}
/**
 * @function forgotPassword
 * @param req
 * @param res
 * @param next
 * @description get forgot password for user
 */
exports.forgotPassword = function (req, res, next) {
    try {
        mysql.getConnection('CMS', function (err, connection_central) {
            var query = connection_central.query('SELECT * FROM icn_login_detail where BINARY ld_user_id= ? and BINARY ld_email_id = ? ', [req.body.userid, req.body.emailid], function (err, row, fields) {
                if (err) {
                    res.render('account-forgot', { error: 'Error in database connection.', msg: '' });
                }
                else {
                    if (row.length > 0) {

                        var smtpTransport = nodemailer.createTransport({
                            service: "Gmail",
                            auth: {
                                user: "jetsynthesis@gmail.com",
                                pass: "j3tsynthes1s"
                            }
                        });
                        var mailOptions = {
                            to: session.Email,//'sujata.patne@jetsynthesys.com',
                            subject: 'Forgot Password',
                            html: "<p>Hi, " + row[0].ld_user_id + " <br />This is your password: " + row[0].ld_user_pwd + "</p>"
                        }
                        smtpTransport.sendMail(mailOptions, function (error, response) {
                            if (error) {
                                console.log(error);
                                res.end("error");
                            } else {
                                connection_central.release();
                                res.render('account-forgot', { error: '', msg: 'Password successfully sent to your email. Please Check.' });
                                res.end("sent");
                            }
                        });
                    }
                    else {
                        connection_central.release();
                        res.render('account-forgot', { error: 'Invalid UserId / EmailId.', msg: '' });
                    }
                }
            });
        });
    }
    catch (err) {
        connection_central.end();
        res.render('account-forgot', { error: 'Error in database connection.' });
    }
}
/**
 * @function viewChangePassword
 * @param req
 * @param res
 * @param next
 * @description displays change password page
 */
exports.viewChangePassword = function (req, res, next) {
    // req.session = null;
        var session = req.session;
        session.publish_UserId = null;
        session.publish_UserRole = null;
        session.publish_UserName = null;
        session.publish_Password = null;
        session.publish_Email = null;
        session.publish_FullName = null;
        session.publish_lastlogin = null;
        session.publish_UserType = null;
        session.publish_StoreId = null;
    res.render('account-changepassword', { error: '' });
}
/**
 * @function changePassword
 * @param req
 * @param res
 * @description process change password request
 */
exports.changePassword = function (req, res) {
    try {
        if (req.session) {
            if (req.session.publish_UserName) {
                var session = req.session;
                mysql.getConnection('CMS', function (err, connection_central) {
                    if (req.body.oldpassword == session.Password) {
                        var query = connection_central.query('UPDATE icn_login_detail SET ld_user_pwd=?, ld_modified_on=? WHERE ld_id=?', [req.body.newpassword, new Date(), session.UserId], function (err, result) {
                            if (err) {
                                connection_central.release();
                                res.status(500).json(err.message);
                            }
                            else {
                                session.Password = req.body.newpassword;
                                var smtpTransport = nodemailer.createTransport({
                                    service: "Gmail",
                                    auth: {
                                        user: "jetsynthesis@gmail.com",
                                        pass: "j3tsynthes1s"
                                    }
                                });
                                var mailOptions = {
                                    to: session.Email,
                                    subject: 'Change Password',
                                    html: "<p>Hi, " + session.UserName + " <br />This is your password: " + req.body.newpassword + "</p>"
                                }
                                smtpTransport.sendMail(mailOptions, function (error, response) {
                                    if (error) {
                                        connection_central.release();
                                        console.log(error);
                                        res.end("error");
                                    } else {
                                        connection_central.release();
                                        res.send({ success: true, message: 'Password updated successfully. Please check your mail.' });

                                        //res.render('changepassword', { success: true, message: 'Password updated successfully. Please check your mail.' });
                                        //res.end("sent");
                                    }
                                });
                            }
                        });
                    }
                    else {
                        connection_central.release();
                        res.send({ success: false, message: 'Old Password does not match.' });
                    }
                })
            }
            else {
                res.redirect('/accountlogin');
            }
        }
        else {
            res.redirect('/accountlogin');
        }
    }
    catch (err) {
        res.status(500).json(err.message);
    }
};
