const express = require('express')
const request = require('request');
var moment = require('moment');
const path = require('path');
const app = express()
var jwt = require('jsonwebtoken');
var auth = require('./lib/auth');
var companyId = "M202111580U";

//json 타입의 데이터 전송을 허용한다.
app.use(express.json());

//form 타입의 데이터 전송을 허용한다.
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));//to use static asset

// 뷰파일이 있는 디렉토리를 설정
app.set('views',__dirname+'/views');

// 뷰 엔진으로 ejs를 사용
app.set('view engine','ejs');

// DB 설정
var mysql      = require('mysql');
const { log } = require('console');
var connection = mysql.createConnection({
host     : 'localhost',
user     : 'root',
password : 'gustjr2924!',
database : 'fintech210222'
});

connection.connect();


// '/' or '/user' : 라우팅이라고 부름

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/signup',function(req,res){
  res.render('signup');
})

app.get('/authResult',function(req,res){
  var authCode = req.query.code;
  var option = {
      method : "POST",
      url : "https://testapi.openbanking.or.kr/oauth/2.0/token",
      header : {
          'Content-Type' : 'application/x-www-form-urlencoded'
      },
      form : {
        code : authCode,
        client_id : "3a9bbd90-813c-4f8f-9764-56521b741353",
        client_secret : "d671a05b-f9dd-4ff7-9ee2-440fd8d6ed2b",
        redirect_uri : "http://localhost:3000/authResult",
        grant_type : "authorization_code"
      }
  }
  request(option, function(err, response, body){
      if(err){
          console.error(err);
          throw err;
      }
      else {
          var accessRequestResult = JSON.parse(body);
          res.render('resultChild',{data : accessRequestResult});
      }
  })
})

app.post('/signup',function(req,res){
  var userName = req.body.userName;
  var userEmail = req.body.userEmail;
  var userPassword = req.body.userPassword;
  var userAccessToken = req.body.userAccessToken;
  var userRefreshToken = req.body.userRefreshToken;
  var userSeqNo = req.body.userSeqNo;

  var sql ="INSERT INTO user(name, email, password, accesstoken, refreshtoken, userseqno) VALUES (?,?,?,?,?,?)"

  connection.query(sql,[userName,userEmail,userPassword,userAccessToken,userRefreshToken,userSeqNo],function(error,results){

    if(error){
      console.error(error);
      throw error;
    }else{
      res.json(1);
    }
  })
})

app.get('/login',function(req,res){
  res.render('login');
})

app.post('/login',function(req,res){

    var userEmail = req.body.userEmail;
    var userPassword = req.body.userPassword;
    
    var sql = "SELECT * FROM user WHERE email = ?";

    connection.query(sql, [userEmail], function(err, result){
        if(err){
            console.error(err);
            res.json(0);
            throw err;
        }
        else {
            console.log(result);
            if(result.length == 0){
                res.json(3)
            }
            else {
                var dbPassword = result[0].password;
                if(dbPassword == userPassword){
                    var tokenKey = "f@i#n%tne#ckfhlafkd0102test!@#%"
                    jwt.sign(
                      {
                          userId : result[0].id,
                          userEmail : result[0].email
                      },
                      tokenKey,
                      {
                          expiresIn : '10d',
                          issuer : 'fintech.admin',
                          subject : 'user.login.info'
                      },
                      function(err, token){
                          res.json(token)
                      }
                    )            
                }
                else {
                    res.json(2);
                }
            }
        }
    })
})

app.get('/main',function(req,res){
  res.render('main');
})

app.get('/balance',function(req,res){
  res.render('balance');
})

app.get('/qrcode',function(req,res){
  res.render('qrcode');
})

app.get('/qrreader',function(req,res){
  res.render('qrreader');
})

app.post('/list', auth, function(req, res){

  var user = req.decoded;

  var sql = "SELECT * FROM user WHERE id = ?";
  connection.query(sql,[user.userId],function(err,result){

    if(err) throw err;
    else{
      var dbUserData = result[0];
      var option = {
        method : "GET",
        url : "https://testapi.openbanking.or.kr/v2.0/user/me",
        headers : {
          Authorization : "Bearer "+dbUserData.accesstoken
        },
        qs : {
          user_seq_no : +dbUserData.userseqno
        }
    }
    request(option, function(err, response, body){
        if(err){
            console.error(err);
            throw err;
        }
        else {
            var listRequestResult = JSON.parse(body);
            res.json(listRequestResult)
        }
    })
    }
  })
})

app.post('/balance',auth,function(req,res){

  var user = req.decoded;

  var countnum = Math.floor(Math.random() * 1000000000) + 1;
  var transId = companyId + countnum;
  var transdtime = moment(new Date()).format('YYYYMMDDhhmmss');

  var sql = "SELECT * from user WHERE id = ?";
  connection.query(sql,[user.userId],function(err,result){

    if(err) throw err;
    else{
      var dbUserData = result[0];

      var option = {
        method : "GET",
        url : "https://testapi.openbanking.or.kr/v2.0/account/balance/fin_num",
        headers : {
          Authorization : "Bearer "+dbUserData.accesstoken
        },
        qs : {
          bank_tran_id : transId,
          fintech_use_num : req.body.fin_use_num,
          tran_dtime : transdtime
        }
    }
    request(option, function(err, response, body){
      if(err){
          console.error(err);
          throw err;
      }
      else {
          var RequestResult = JSON.parse(body);
          res.json(RequestResult)
      }
  })
  }
})
})

app.post('/transactionList',auth,function(req,res){

  var user = req.decoded;

  var countnum = Math.floor(Math.random() * 1000000000) + 1;
  var transId = companyId + countnum;
  var transdtime = moment(new Date()).format('YYYYMMDDhhmmss');
  var sql = "SELECT * from user WHERE id = ?";
  connection.query(sql,[user.userId],function(err,result){

    if(err) throw err;
    else{
      var dbUserData = result[0];

      var option = {
        method : "GET",
        url : "https://testapi.openbanking.or.kr/v2.0/account/transaction_list/fin_num",
        headers : {
          Authorization : "Bearer "+dbUserData.accesstoken
        },
        qs : {
          bank_tran_id : transId,
          fintech_use_num : req.body.fin_use_num,
          inquiry_type : "A",
          inquiry_base : "D",
          from_date : "20160404",
          to_date : "20210225",
          sort_order : "D",
          tran_dtime : transdtime
        }
    }
    request(option, function(err, response, body){
      if(err){
          console.error(err);
          throw err;
      }
      else {
          var transactionListResult = JSON.parse(body);
          res.json(transactionListResult)
      }
    })
  }
})
})

app.post('/withdraw',auth,function(req,res){

  var user = req.decoded;
  console.log(user);
  var countnum = Math.floor(Math.random() * 1000000000) + 1;
  var transId = companyId + countnum;
  var transdtime = moment(new Date()).format('YYYYMMDDhhmmss');
  var sql = "SELECT * from user WHERE id = ?";

  connection.query(sql,[user.userId],function(err,result){
    
    if(err) throw err;
    else{
      var dbUserData = result[0];

      var option = {
        method : "POST",
        url : "https://testapi.openbanking.or.kr/v2.0/transfer/withdraw/fin_num",
        headers : {
          Authorization : "Bearer "+dbUserData.accesstoken
        },
        json : {
          bank_tran_id : transId,
          cntr_account_type : "N",
          cntr_account_num : "100000000001",
          dps_print_content :"쇼핑몰환불",
          fintech_use_num : req.body.fin_use_num,
          wd_print_content : "오픈뱅킹출금",
          tran_amt : req.body.amount,
          tran_dtime : transdtime,
          req_client_name : "홍길동",
          req_client_bank_code : "097",
          req_client_account_num : "200000000001",
          req_client_fintech_use : req.body.to_fin_use_num,
          req_client_num : "HONGGILDONG1234",
          transfer_purpose : "ST",
          recv_client_name : "김오픈",
          recv_client_bank_code : "097",
          recv_client_account_num : "100000000001"
        }
      }
      request(option, function(err, response, body){
        if(err){
            console.error(err);
            throw err;
        }
        else {

          if(body.rsp_code==="A0000"){

            countnum = Math.floor(Math.random() * 1000000000) + 1;
              transId = companyId + countnum;
              transdtime = moment(new Date()).format('YYYYMMDDhhmmss');

              var option = {
                method : "POST",
                url : "https://testapi.openbanking.or.kr/v2.0/transfer/deposit/fin_num",
                headers : {
                  Authorization : "Bearer "+"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJNMjAyMTExNTgwIiwic2NvcGUiOlsib29iIl0sImlzcyI6Imh0dHBzOi8vd3d3Lm9wZW5iYW5raW5nLm9yLmtyIiwiZXhwIjoxNjIyMDg1MTQ1LCJqdGkiOiJmZDE1NGI4MC0zY2NjLTQ3YmItYmU2NC03ZGViZTY3ZGRjZTQifQ.xK8yJewjFCz8ZDfinKQEcHwogsJYC6_FkMZFP8UEtp4"
                },
                json : {
                  cntr_account_type : "N",
                  cntr_account_num : "200000000001",
                  wd_pass_phrase : "NONE",
                  wd_print_content :"오픈뱅킹입금",
                  name_check_option : "on",
                  tran_dtime : transdtime,
                  req_cnt : "1",
                  req_list : [
                  {
                    tran_no :"1",
                    bank_tran_id: transId,
                    fintech_use_num: req.body.fin_use_num,
                    print_content : "쇼핑몰환불",
                    tran_amt: req.body.amount,
                    req_client_name : "김오픈",
                    req_client_bank_code : "097",
                    req_client_account_num : "100000000001",
                    req_client_fintech_use : req.body.to_fin_use_num,
                    req_client_num : "HONGGILDONG1234",
                    transfer_purpose : "ST",
                    recv_bank_tran_id : transId
                  }
                ]
                }
              }
              request(option, function(err, response, body){
                if(err){
                    console.error(err);
                    throw err;
                }
                else {
                  res.json(body)
                }
              })

          }
        }
      })
    }
})
})

app.listen(3000)