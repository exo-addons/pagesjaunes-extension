PagesJaunes add-on
=====================

PagesJaunes : le portail de référence de la recherche de professionnels. Avec cette extension spécialement conçue pour les intranets, vous pourrez : 1) rechercher des professionnels autour de votre entreprise ou partout en France 2) partager les recherches dans les flux d'activité 3) discuter de vos trouvailles dans les forums 

Compatibilité : eXo Platform 4.0


Compiler à partir du code source 
==========================================

Prérequis : installation de  [Maven 3](http://maven.apache.org/download.html).

    git clone https://github.com/exo-addons/pagesjaunes-extension
    cd pagesjaunes-extension

compiler le projet avec maven :

    mvn clean install
    

Installation
===================== 

Prérequis : installation de [eXo Platform 4.0 Tomcat bundle](http://www.exoplatform.com/company/en/download-exo-platform)   

3 possibilités d'installation:

A partir d'une version fraichement compilée
---------------------------------------------

    cp config/target/pagesjaunes-component-services*.jar tomcat/lib
    cp config/target/pagesjaunes-extension-config*.jar tomcat/lib
    cp webapp/target/pagesjaunes-extension.war tomcat/webapp
    

A partir la version télécharger sur sourceforge (http:// )
----------------------------------------------------------

Dézipper le contenu dans le répertoire tomcat/extensions

Utiliser l'eXo Platform extension manager pour installer l'extension :

./extension.sh -i PagesJaunes ou ./extension.bat -i PagesJaunes

 # ===============================
 # eXo Platform Extensions Manager
 # ===============================

Installing PagesJaunes extension ...
     [copy] Copying 2 files to /Users/gregorysebert/eXo_install/tomcat/lib
     [copy] Copying /Users/gregorysebert/eXo_install/tomcat/extensions/PagesJaunes/lib/pagesjaunes-component-services-1.0.jar to /Users/gregorysebert/eXo_install/tomcat/lib/pagesjaunes-component-services-1.0.jar
     [copy] Copying /Users/gregorysebert/eXo_install/tomcat/extensions/PagesJaunes/lib/pagesjaunes-extension-config-1.0.jar to /Users/gregorysebert/eXo_install/tomcat/lib/pagesjaunes-extension-config-1.0.jar
     [copy] Copying 1 file to /Users/gregorysebert/eXo_install/tomcat/webapps
     [copy] Copying /Users/gregorysebert/eXo_install/tomcat/extensions/PagesJaunes/webapps/pagesjaunes-extension.war to /Users/gregorysebert/eXo_install/tomcat/webapps/pagesjaunes-extension.war
Done.

 # ===============================
 # Extension PagesJaunes installed.
 # ===============================



A partir de l'eXo Platform add-on manager
-----------------------------------------

Télécharger l'add-on manager (http://sourceforge.net/projects/exo/files/Addons/Add-ons%20Manager/addons-manager-1.0.0-alpha-2.zip/download) et l'extraire dans votre répertoire tomcat. 2 nouveaux scripts (addon.sh and addon.bat) et un nouveau répertoire contenant un jar (addons-manager.jar) sont créés.

Utiliser le script addon.sh ou addon.bat :

addon.sh -l permet de lister les add-on disponible

addon.sh -i exo-pagesjaunes permet d'installer l'add-on PagesJaunes



Configuration
===============

Ajouter les propriétés suivantes dans le fichier de configuration d'eXo Platform (tomcat/gatein/conf/configuration.properties):

#
# Add-on PagesJaunes
#

pagesjaunes.entreprise.address=mon adresse
pagesjaunes.category.id=forumCategoryAnnuaire
pagesjaunes.category.name=Annuaire
pagesjaunes.category.owner=root
pagesjaunes.category.description=Annuaire des pages jaunes

pagesjaunes.forum.id=forumPagesJaunes
pagesjaunes.forum.name=Pages Jaunes
pagesjaunes.forum.owner=root
pagesjaunes.forum.description=Pages Jaunes

pagesjaunes.entreprise.address défini l'adresse utilisée lors de la recherche autour de mon entreprise.
pagesjaunes.category.* permet de définir le nom, l'owner et la description de la gadget PagesJaunes dans le registre application
pagesjaunes.forum;* permet de configurer le forum utilisé lors de l'ouverture d'une discussion

 
Démarrage
===============

Utiliser le script de démarrage d'eXo :

    cd tomcat 
    ./start_eXo.sh

Ouvrir un navigateur et aller à (http://localhost:8080/portal/intranet/pagesjaunes) et authentifiez vous avec `john/gtn`

Désinstallation
===============

Utiliser le script d'arrêt d'eXo :
	cd tomcat 
    ./stop_eXo.sh

Si vous avez utilisé l'extension manager lors de l'installation :  ./extension.sh -u PagesJaunes

Si vous avez utilisé l'add-on manager lors de l'installation :  ./addon.sh -u exo-pagesjaunes  

Sinon supprimer manuellement l'add-on:

  	rm tomcat/lib/pagesjaunes-component-services*.jar
    rm tomcat/lib/pagesjaunes-extension-config*.jar
    rm tomcat/webapp/pagesjaunes-extension.war
