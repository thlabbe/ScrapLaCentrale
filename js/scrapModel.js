// c:\Outils\casperjs-1.1-b3\batchbin\casperjs.bat visit3.js TOURAN cote-voitures-volkswagen-touran---.html

  var casper = require('casper').create({
    verbose: false,
    logLevel: 'debug',
    clientScripts: ["includes/jquery-2.1.0.min.js"] , // activer jQuery
    pageSettings: {
        loadImages:  false,        // The WebPage instance used by Casper will
        loadPlugins: true         // use these settings
    }
  });

  

 var Version = function(name, energy, power, transmission, doors, price){
    this.name = name;  
    this.energy = energy;
    this.power = power;
    this.transmission = transmission;
    this.doors = doors;
    this.price = price;
 }
 Version.prototype.setPrice = function(price) {
   this.price = price;
 };
 
 var Millesime = function(name, url) {
    this.name = name;
    this.url = url;
    this.versions = new Array();
 }
 Millesime.prototype.addVersion = function(version) {
   this.versions.push(version);
 };
  
 var Modele = function(name, url){
    this.id = name; 
    var dname = '/cote-voiture-'.length +1  ;
    var fname = url.indexOf('---') - 1 ;
    var dtype = fname + 4;
    var ftype = url.indexOf('.html') ;
    this.name = url.substring(dname,fname) ;
    this.type = url.substring(dtype,ftype) ;
   
    this.url = url;
    this.millesimes = new Array();
 };
 Modele.prototype.addMillesime = function(millesime) {
   this.millesimes.push(millesime);
 }; 

  var prefixUrl = 'http://www.lacentrale.fr';

  var arg1 = casper.cli.get(0) 
  var touran = new Modele(arg1.substring(15,arg1.length-5),  prefixUrl + arg1);
  var startUrl =  touran.url;

  var selectors = ['div.CoteListMillesime a','tr td'/* td.QuotMarque a'*/];
  var level = 0;

  var nodes;
  var liens;

  casper.start( startUrl, function(){
    console.log('location asked ' + startUrl  + ' location is ' + this.getCurrentUrl() );
  });

  casper.then( function(){

    this.evaluate( function() { // fonction jQuery : renum links
      $( "a" ).each(function(index) {
        $( this ).addClass("link_"+index);
      });
    });
  });

  casper.then(function(){

    nodes =  this.getElementsInfo(selectors[level]);
/*
  });

  casper.then(function(){
*/
    casper.each(nodes, function(self, node){
      this.then(function(){

        console.log("xxx " + node.text);
        millesime = new Millesime(node.text, node.attributes.href);
        touran.addMillesime(millesime);

        this.click('a.' + node.attributes.class);
        level++;
        
        this.then(function(){
          this.evaluate( function() { // fonction jQuery ( reactiver les commentaires)
            $('table tr').contents()   
              .filter(function(){return this.nodeType === 8;}) //get the comments
              .replaceWith(function(){return this.data;})
          });
        });



        this.then(function(){
          liens = this.getElementsInfo(selectors[level]);
        
          for (var i = 0 ; i < liens.length; i++){
            if(liens[i].attributes.class === 'spacer'){
              var vers = liens[++i].text.trim() ;
              var price = liens[++i].text.trim() ; 
              var energy = liens[++i].text.trim() ;
              var power = liens[++i].text.trim() ;
              var transmission = liens[++i].text.trim() ;
              var doors = liens[++i].text.trim() ;
              
              var version = new Version(vers, energy, power, transmission, doors, price);
              millesime.addVersion(version);

            }
          };
        });

        this.then(function(){
          this.back();
          level--;
        });

        this.then(function(){

          this.evaluate( function() { // fonction jQuery
            $( "a" ).each(function(index) {
              $( this ).addClass("link_"+index);
            });
          });
        });

      });
    });
  });


  fs = require('fs');
  
  casper.then(function(){
    var path = 'data/' + touran.id + '.json';
    var content = JSON.stringify(touran, null, '\t');
    fs.write(path,content,'w');
    console.log('done!');
  });


  casper.run();

