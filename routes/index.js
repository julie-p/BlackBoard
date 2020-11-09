var express = require('express');
var router = express.Router();

var articleModel = require('../models/articles');
var orderModel = require('../models/orders');
var userModel = require('../models/users');

//Affichage homepage
router.get('/', async function(req, res, next) {

  var emptyStocks = await articleModel.find({stock:0}); //Trouve tous les articles avec un stock de 0

  var user = await userModel.findById('5c52e4efaa4beef85aad5e52'); //Trouve l'admin grâce à son id
  var messages = user.messages; //Msgs de l'admin
  
  var unreadMessages = 0;
  //Boucle sur les msgs
  for (let i = 0; i < messages.length; i++) {
    if (messages[i].read == false) { //Si msg non lu, 
      unreadMessages +=1
    }
  };

  var taches = user.tasks; //Tâches de l'admin
  var taskInprogress = 0

  //Boucle sur les tâches
  for (let i = 0; i < taches.length; i++) {
    if (taches[i].dateCloture == null) { //Si la tâche n'a pas de date de clôture
      taskInprogress +=1;
    }
  };

  res.render('index',{emptyStocks:emptyStocks.length, unreadMessages, taskInprogress});
});

/* GET tasks page. */
router.get('/tasks-page', async function(req, res, next) {

  var user = await userModel.findById('5c52e4efaa4beef85aad5e52'); //Trouve les tasks de l'admin grâce à son id

  res.render('tasks', {taches: user.tasks});
});

/* GET Messages page. */
router.get('/messages-page', async function(req, res, next) {

  var user = await userModel.findById('5c52e4efaa4beef85aad5e52'); //Trouve l'admin grâce à son id

  res.render('messages', {messages: user.messages});
});

/* GET Users page. */
router.get('/users-page', async function(req, res, next) {

  var users = await userModel.find({status: "customer"}); //Trouve tous les users avec statut de client

  res.render('users', {users});
});

//Affichage catalogue
router.get('/catalog-page', async function(req, res, next) {

  var articles = await articleModel.find(); //Trouve tous les articles en bdd

  res.render('catalog', {articles});
});

//Affichage commandes
router.get('/orders-list-page', async function(req, res, next) {

  var orders = await orderModel.find(); //Trouve toutes les commandes en bdd
  
  res.render('orders-list', {orders});
});

//Affichage détails commandes
router.get('/order-page', async function(req, res, next) {

  var order = await orderModel.findById(req.query.id) //Retrouve la commande cliquée
                              .populate('articles') //Récupère les infos de l'article
                              .exec()

  res.render('order', {order});
});

/* GET chart page. */
router.get('/charts', async function(req, res, next) {

  var users = await userModel.find(); //Retrouve tous les users

  var numMale = 0;
  var numFemale = 0;

  //Boucle sur users
  for (let i=0; i < users.length; i++) {
    if (users[i].gender == 'male') { //Si homme, numMale ++
      numMale++
    } else { //Si femme, numFemale ++
      numFemale++
    }
  };

  var user = await userModel.findById('5c52e4efaa4beef85aad5e52'); //Retrouve l'admin
  var messages = user.messages;
  
  var messNonLu = 0;
  var messLu = 0;

  //Boucle sur les msgs
  for (let i = 0; i < messages.length; i++) {
    if (messages[i].read == false) { //Si msg non lu, messNonLu +1
      messNonLu +=1
    } else {
      messLu +=1 //Sinon messLu +1
    }
  };

  var orders = await orderModel.find({status_payment:"validated"}); //Retrouve les commandes paiement validé

  var nbExp = 0;
  var nbNonExp = 0;

  //Boucle sur les commandes
  for (let i = 0; i < orders.length; i++) {
    if (orders[i].status_shipment == true) { //Si commande expédiée, nbExp ++
      nbExp++
    } else {
      nbNonExp++
    }
  };

  var aggr = orderModel.aggregate(); 

  //Filtre les documents pour ne transmettre que les documents qui correspondent aux conditions spécifiées à la prochaine étape du pipeline.
  aggr.match({status_payment:"validated"});//Récupère commandes paiement validée

  var aggr = aggr.group({ _id: {year: {$year:'$date_insert'}, month:{$month: '$date_insert'}}, CA:{$sum: '$total'}});//Fais le total du chiffre d'affaires sur une période donnée
  console.log(aggr);
  aggr.sort({ _id : 1}); //Trie tous les documents d'entrée et les renvoie au pipeline dans l'ordre trié ------ 1 == ordre croissant

  var totalCAByMonth = await aggr.exec();
  console.log(typeof totalCAByMonth);

  res.render('charts',{numMale, numFemale, messLu, messNonLu, nbExp, nbNonExp, totalCAByMonth});
});


module.exports = router;
