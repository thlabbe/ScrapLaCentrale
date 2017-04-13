ScrapLaCentrale
===============
** this project is out of date : https://groups.google.com/forum/#!topic/phantomjs/9aI5d-LDuNE


* Problématique  
  Le site de [La Centrale](http://www.lacentrale.fr/lacote_origine.php) présente les cotes des voitures d'occasion.
  Mais l'interface necessite de choisir une marque, un modèle, un millésime et enfin une version pour connaitre la cote du de l'automobile.
  L'objectif est donc récupérer automatiquement ces cotes pour l'ensemble des modeles de l'ensemble des marques.  
  environ 120 constructeurs et 210.000 cotes. 

* Solution  
  Un fichier de commandes (.bat) qui va scrapper les cotes auto de La Cenrale à l'aide de [CasperJS](http://casperjs.org/ )


TODO List 
---------
* paralléliser le scapping ( > 6h30 pour obtenir les cotes en traitant les marques en séquentiel ! )
* refactoring du code ( le modele de données peut être déporté dans un/ou plusieurs fichiers.js séparrés )
* bugfixes sur les fichiers json obtenus
