// c:\Outils\casperjs-1.1-b3\batchbin\casperjs.bat visit3.js TOURAN cote-voitures-volkswagen-touran---.html
  var fs = require('fs');

  var casper = require('casper').create({
    verbose: false,
    logLevel: 'debug',
    clientScripts: ["includes/jquery-2.1.0.min.js"] , // activer jQuery
    pageSettings: {
        loadImages:  false,        // The WebPage instance used by Casper will
        loadPlugins: true         // use these settings
    }
  });

var Modele = function(name, url){
    this.id = name; 
    /* TODO : eclater l'id pour avoir le nom du modele et le type
      exemple "name": "citroen-2cv---citadine"
              => "name": "2cv", "type": "citadine"       */
    var dname = '/cote-voiture-'.length +1  ;
    var fname = url.indexOf('---') - 1 ;
    var dtype = fname + 4;
    var ftype = url.indexOf('.html') ;
    this.name = url.substring(dname,fname) ;
    this.type = url.substring(dtype,ftype) ;
    //console.log(JSON.stringify(arrayTmp));
    this.url = url;
//    this.millesimes = new Array();
};

var Constructor = function(id, url) {
    this.id = id ;
    this.url = url ;
    this.models = new Array() ;
}; 
Constructor.prototype.addModel = function(model){
    this.models.push(model) ; 
};

  var prefixUrl = 'http://www.lacentrale.fr';

  var arg1 = casper.cli.get(0) 
  var constructor = new Constructor(arg1.substring(15,arg1.length-5),  prefixUrl + arg1);
  var startUrl =  prefixUrl + arg1;

  var selectors = [/*'div.TabMarquModQuotTitle 'div.TabMarquModQuotTitle */'ul.TabMarquModQuotList>li>center>a'];
  var level = 0;
  var nodes;

  casper.start( startUrl, function(){

    console.log('location asked ' + startUrl  + ' location is ' + this.getCurrentUrl() );
  });

  casper.then(function(){
    console.log( arg1 + '\nlocation asked ' + startUrl  + ' location is ' + this.getCurrentUrl() );
    nodes =  this.getElementsInfo(selectors[level]) ;

    casper.each(nodes, function(self, node){
      this.then(function(){
        console.log("xxx " + JSON.stringify(node.text));

        modele = new Modele(node.text, node.attributes.href);
        constructor.addModel(modele);

      });
    });
  });
  
  casper.then(function(){
    var path = 'data/' + constructor.id + '.json';
    var content = JSON.stringify(constructor, null, '\t');
    fs.write(path,content,'w');
    console.log('JSON file : '+ path + ' done!');

    path = constructor.id + '.bat';
    content = 'echo off\n'
            + 'set CASPER_CMD=c:\\Outils\\casperjs-1.1-b3\\batchbin\\casperjs.bat\n'
            + 'echo %time%\n\n' ;
    for (var i = constructor.models.length - 1; i >= 0; i--) {
      content = content + 'call %CASPER_CMD% scrapModel.js ' + constructor.models[i].url + '\n' ;
    };
    content = content + 'echo %time%\n\n' ;
    fs.write(path,content,'w');
    console.log('Batch file : '+ path + ' done!');
    
  });


  casper.run();

