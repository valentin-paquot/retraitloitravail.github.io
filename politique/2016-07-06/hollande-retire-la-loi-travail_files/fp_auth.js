/**
 * @file
 * L'Api fpAuth met a disposition :
 *  - Commentaires (formulaires et listes).
 *  - Boutons d'actions
 * Herites de l'api fpApp et s'appuyant dorenavant sur l'api fpAuth :
 *  - Les boutons recommander
 *  - Les boutons suivre.
 *
 * @version version 1.0 - Non compressee.
 *
 */

/**
 * fp_authentificator.
 */
var fpauthentificator = function() {
  // Taille d'ecran minimum pour le comportement popup.
  this.screenThresholdWidth = 768;
  this.responsiveRun = window.innerWidth < this.screenThresholdWidth;

  // Contiennent les elements en cours de traitement.
  // Suite a une action de l'utilisateur ces valeurs sont mises a jour.
  this.everInitialized = false;
  this.currentElementOperation = false;
  this.currentElementType = false;
  this.currentElementCallback = false;
  this.currentActionPremium = false;
  this.currentFormButton = null;

  // Key de l'operation en cours.
  this.recocurrentOperationKey = null;
  this.recocurrentOperationType = null;

  // Declaration des variables utiles a l'objet.
  this.user = false;
  this.passport = false;
  this.urlRegexp = '((http|https):((//)|(\\\\))+[\w\d:#@%/;$()~_?\+-=\\\.&]*)';

  // Mise en place du passport par defaut.
  // Donnees qui seront ecrasees par la suite.
  if (typeof fpAuthPassport != 'undefined') {
    this.setPassport(fpAuthPassport);
  }
  else {
    this.setPassport({
      'appId'  : '81325031242245596367369127435013',
      'defautlFormValues' : {
        'data-formlevel' : 'middle',
        'data-public'   : '1',
        'data-update' : '0'
      }
    });
  }

  this.divs = [];
  this.links = [];
  this.elementsToGetClassName = 'fpAuth';
  this.knownElements = [];
  this.knownElements['forms'] = [];
  this.knownElements['links'] = [];
  this.knownElementsClassName = 'fp-auth-known-elements';
  // Url par defaut (prod de premium).
  this.defaultPremiumHost = 'plus.lefigaro.fr';
  // Determine le host
  // Selon si la variable premiumServicesHost est ete definie
  // Et qu'elle correspond a une url de page.
  if (typeof premiumServicesHost != 'undefined' && premiumServicesHost.match(this.urlRegexp)) {
    this.premiumHost = premiumServicesHost;
  }
  else {
    // Sinon on pointe vers plus.lefigaro.fr url de prod et par defaut.
    this.premiumHost = document.location.protocol +'//' + this.defaultPremiumHost;
  }

  // Ajout des css propres a fpAuth.js.
  var cssUrls = [
    '/sites/default/modules/fp/fp_com_action/themes/css/fp_com_action.css',
    '/sites/default/modules/fp/fp_user_services/themes/css/fp_auth_api.css'
  ];

  for (var css in cssUrls) {
    if (cssUrls.hasOwnProperty(css)) {
      var cssDomObj = {
        'type' : 'link',
        'attributes' : {
          'type': 'text/css',
          'rel': 'stylesheet',
          'media': 'all',
          'href': this.premiumHost + cssUrls[css]
        }
      };
      this.insertDomElement(cssDomObj);
    }
  }

  // Donnees specifique aux formulaires de commentaire.
  this.mainCommentAlreadySent = [];
  this.commentFormcontainer = [];
  this.commentFormTextarea = [];
  this.commentLengthcounter = false;
  this.definedCommentValue = false;
  this.maxCommentLength = 1500;

  // Verifie si on a un user connu en cours de session.
  this.checkUserCookie(false);

  // Les differents type de liens pris en charge.
  this.recolinksType = ['recommander', 'suivre', 'suivretag', 'selectionner'];
  // ClassName des container des liens.
  this.recolinksContainerClasses = ['recommander-container', 'fpApp-suivre-container', 'fpApp-suivretag-container', 'selectionner-container'];
  // Tableaux de cache des container, liens et infos (json).
  this.recolinks = [];
  this.recolinksInfos = [];
  this.recogetInfos = [];
  this.recoqueries = [];
  this.recolinksDatas = [];
  this.recolinksContainer = [];
  this.recocontainerClassName = [];
  for(var i=0;i<this.recolinksType.length;i++) {
    this.recolinks[this.recolinksType[i]] = [];
    this.recolinksInfos[this.recolinksType[i]] = [];
    this.recolinksDatas[this.recolinksType[i]] = [];
    this.recolinksContainer[this.recolinksType[i]] = [];
    this.recocontainerClassName[this.recolinksType[i]] = this.recolinksContainerClasses[i];
  }
  // Specifique aux liens recommander.
  this.recorecommanderLinksCountClassName = 'recommander-count';

  // Initialisation de l'objet
  this.attachMessageListener();
  // Initialisation de l'objet
  this.onload();
};


/**
 * Preprocess de chargement des bouton et iframes.
 */
fpauthentificator.prototype.init = function() {
  var myObj = this;

  // Depuis l'iframe au chargement de la page on empeche les process.
  if (myObj.blocked) {
    return false;
  }

  myObj.everInitialized = true;
  // A ce stade si pas de passport on coupe.
  if (!myObj.passport) {
    // Pas de passport : interruption des scripts.
    if (typeof console != 'undefined' && typeof console.log != 'undefined') {
      console.log('Erreur fpAuth : Probleme de definition du passport cf. http://dev.tatiana.lefigaro.fr/node/166');
    }
    return false;
  }

  // Ouverture d'iframe si on a le cookie figaro_pwd.
  if (!myObj.openFpPwdDialogBox()) {
    myObj.postInit();
  }
};

/**
 * Initialisation des bouton et iframe.
 */
fpauthentificator.prototype.postInit = function() {
  var myObj = this;
  // Lance un scan de la page
  // Pour trouver les elements a traiter
  myObj.scanPageForNewElements();

  // Lance le ping a Fidji.
  myObj.pingFidji();

  // Regarde si on est en parcours responsive et
  // qu'on a des taches en attentes si oui les execute.
  if (myObj.responsiveRun) {
    var tmpCookie = myObj.getCookie('fp-auth-data');
    // Reset le cookie Si il existait.
    myObj.setCookie('fp-auth-data', '', -1);
    if (tmpCookie) {
      cookieJson = eval("(" + tmpCookie + ")");
      myObj.recocurrentOperationKey = cookieJson.recocurrentOperationKey;
      myObj.recocurrentOperationType = cookieJson.recocurrentOperationType;
      myObj.currentElementCallback = cookieJson.currentElementCallback;
      myObj.currentActionPremium = cookieJson.currentActionPremium;

      myObj.currentElementOperation = myObj.knownElements[myObj.recocurrentOperationType][myObj.recocurrentOperationKey];
      if (typeof eval(myObj.currentElementCallback) == 'function') {
        // On execute la fonction de callback fournie par l'url.
        if (myObj.currentElementOperation.hasAttribute('data-arg')) {
          eval(myObj.currentElementCallback + '('+ myObj.currentElementOperation.getAttribute('data-arg') +')');
        }
        else {
          eval(myObj.currentElementCallback + '()');
        }
      }
    }
  }
};

/**
 * Scan et regenere les elements de la page
 */
fpauthentificator.prototype.scanPageForNewElements = function() {
  var myObj = this;
  // myObj.fpApp.initRecommanderFlag();
  myObj.searchNewRecoLinks();
  // Recupere les nouveaux elements potentiels.
  myObj.getNewElements();
  // Charge les formulaires demandes.
  myObj.setForms();
  // Charge les bouttons presents dans la page.
  myObj.setButtons();
};

/**
 * Parse les elements html pour retrouver les div et les lien pris en charge par fpAuth.
 * Ces elements ont les class "fpAuth" et "fp-auth-known-elements".
 */
fpauthentificator.prototype.getNewElements = function() {
  var myObj = this;
  var i;
  // Pour toutes les div de la page
  myObj.divs = document.getElementsByTagName('div');
  for (i = 0; i < myObj.divs.length; i++) {
    // Si la div porte la class fpAuth et qu'on ne le connais pas deja.
    if (myObj.divs[i].hasAttribute('class') && myObj.divs[i].getAttribute('class').match(myObj.elementsToGetClassName)
        && !myObj.divs[i].className.match(myObj.knownElementsClassName)) {
      // On l'ajoute dans le tableau des liens que l'on connait
      myObj.knownElements['forms'][myObj.knownElements['forms'].length] = myObj.divs[i];
    }
  }

  // Pour tous les liens de la page
  myObj.links = document.getElementsByTagName('a');
  for (i = 0; i < myObj.links.length; i++) {
    // Si le lien porte la class fpAuth et qu'on ne le connais pas deja.
    if (myObj.links[i].hasAttribute('class') && myObj.links[i].getAttribute('class').match(myObj.elementsToGetClassName)
        && !myObj.links[i].className.match(myObj.knownElementsClassName)) {
      // On l'ajoute dans le tableau des liens que l'on connait
      myObj.knownElements['links'][myObj.knownElements['links'].length] = myObj.links[i];
      // On lui ajoutte une class pour qu'il ne soit plus considere comme
      // nouveau.
      myObj.links[i].className += ' ' + myObj.knownElementsClassName;
    }
  }
};

/**
 * Met en place les formulaires SSO assistés par API.
 * Permet de mettre plusieurs formulaires dans une seule page.
 */
fpauthentificator.prototype.setForms = function() {
  var myObj = this;
  var iframe, iframeSrc;
  // Si on a reconnu au moins un formulaire dans la page.
  if (myObj.knownElements['forms'].length > 0) {
    // pour tous les formulaires reconnus.
    for ( var i = 0; i < myObj.knownElements['forms'].length; i++) {
      if (!myObj.knownElements['forms'][i].className.match(myObj.knownElementsClassName)) {
        // On lui ajoute une class pour qu'il ne soit plus considere comme
        // nouvelle.
        myObj.knownElements['forms'][i].className += ' ' + myObj.knownElementsClassName;
        var formType = myObj.knownElements['forms'][i].getAttribute("data-type");
        switch (formType) {
          case 'form':
            // Determine si Actionpremium ou non.
            var actionpremium = myObj.knownElements['forms'][i].getAttribute("data-actionpremium") ? true : false;
            // Calcule l'url selon la configuration de l'element.
            var generatedPath = myObj.buildParcoursPath(
              myObj.knownElements['forms'][i], 'login',
              myObj.knownElements['forms'][i].getAttribute("data-goto"), actionpremium);
            // Fabrication de la string de l'url de l'iframe.
            iframeSrc = generatedPath['main'] + generatedPath['goto'];
            // Creation de l'iframe.
            iframe = document.createElement('iframe');
            // Ajout de son src.
            iframe.src = iframeSrc;
            // Ajout de la classe qui signifie que l'element a deja ete parse.
            iframe.className = 'fp-auth-iframe-form';
            // Ajout dans le container de l'iframe.
            myObj.knownElements['forms'][i].appendChild(iframe);
            break;
          case 'comment-form':
            var formContainer = myObj.knownElements['forms'][i];
            if (formContainer.getAttribute('data-nodenid')) {
              // Preparation du html du formulaire
              var keyContainer = myObj.commentFormcontainer.length;
              myObj.commentFormcontainer[keyContainer] = formContainer;
              myObj.buildMainCommentForm(keyContainer);
            }
            break;
          case 'comment-list':
            // On autorisera une seule liste de commentaire sur une page.
            myObj.commentsListContainer = myObj.knownElements['forms'][i];
            myObj.commentsList = [];
            myObj.commentsList.pages = [];
            myObj.commentsList.currentPage = 1;
            // On construit la premiere page de la liste des commentaires
            var pageNum = 0;
            myObj.requestCommentListPage(pageNum);
            break;
        }
      }
    }
  }
};

/**
 * Fonction permet de retrouver le parendNode plusieurs niveaux au dessus..
 *
 * @param elem
 * @param parentClass
 * @returns {*}
 */
fpauthentificator.prototype.getParentByClassName = function(elem, parentClass) {
  var parent = null;

  var p = elem.parentNode;
  while (p !== null) {
    if (p.className && p.className != '') {
      var classes = p.className.split(' ');
      for (var cl in classes) {
        if (classes[cl] == parentClass) {
          parent = p;
          break;
        }
      }
    }
    var o = p;
    p = o.parentNode;
  }

  return parent;
};

/**
 * Fonction de mise en écoute des messages.
 */
fpauthentificator.prototype.attachMessageListener = function() {

  if (window.addEventListener) {
    // Listener de l'iframe du parcours utilisateur. Interception du clic sur
    // le lien "changer mon mot de passe".
    addEventListener("message", fpAuthentificatorMessageDispatcher, false);
  }
  else {
    // Ajout des listener pour les navigateurs ne supportant pas
    // addEventListener.
    attachEvent("onmessage", fpAuthentificatorMessageDispatcher);
  }
};

/**
 * Ouverture de la dialogBox pour le reset de mot de passe.
 */
fpauthentificator.prototype.openFpPwdDialogBox = function(event) {
  var myObj = this;

  // Recuperation du cookie.
  var fpCookie = myObj.getCookie('figaro_pwd');

  if (fpCookie) {
    myObj.resetPwd = true;
    // Selon la value du cookie on ouvre pas la même iframe.
    if (fpCookie == 1) {
      myObj.openFpUserDialogBox(myObj.premiumHost + '/fpservice/password_reset');
      return true;
    }
    // Retour sur les messages d'erreur.
    else if (fpCookie.substring(0, 5) == 'error') {
      var gotoUrl = document.location.hostname + document.location.pathname;
      myObj.openFpUserDialogBox(myObj.premiumHost + '/fpservice/password?goto_url=' + encodeURIComponent(gotoUrl) + '&error=' + fpCookie);
      return true;
    }
  }

  return false;
};

/**
 * Fonction de dispatch des messages reçus.
 */
var fpAuthentificatorMessageDispatcher = function(event) {
  // event.origin;
  // event.data;
  var myObj = fpAuth;

  if (!event || !event.data || typeof event.data != 'string') {
    return;
  }

  var es = event.data.split('__');
  switch(es[0]) {
    case 'iframe':
      switch (es[1]) {
        case 'goto':
          if (es[2] == 'lostpassword') {
            var gotoUrl = myObj.premiumHost + '/fpservice/password?goto_url=' + encodeURIComponent((document.location.hostname + document.location.pathname));
            myObj.openFpUserDialogBox(gotoUrl);
          }
          break;

        case 'closeframe':
          myObj.closeFpUserDialogBox();
          return false;
          break;

        case 'resize':
          myObj.resizeIframe(es[2]);
          break;

        case 'refresh_popup':
          myObj.refreshIFrame();
          break;

        case 'execute_callback':
          var callback = decodeURIComponent(es[2]);
          myObj.checkUserCookie(false);
          myObj.hideFrames();
          if (callback.match(myObj.urlRegexp)) {
            window.location.href = callback;
          }
          else if (typeof callback == 'function' || typeof eval(callback) == 'function') {
            if (myObj.currentElementOperation && myObj.currentElementOperation.hasAttribute('data-arg')) {
              eval(callback + '('+ myObj.currentElementOperation.getAttribute('data-arg') +')');
            }
            else {
              eval(callback + '()');
            }
          }
          else {
            refresh_parent_page();
          }
          break;
      }
      break;
  }
};

/**
 * Fonction de refresh de l'iframe après connexion sociale.
 */
fpauthentificator.prototype.refreshIFrame = function() {
  var Iframe = document.getElementById('fp-dialog-iframe');
  if (Iframe) {
    // Gestion de la popup de connexion des actions transverses.
    Iframe.src += '&socially_logged=1';
  }
  else {
    // Gestion des formulaire de connexion des parcours verticales.
    var iframes = document.getElementsByTagName('iframe');
    for (var i in iframes) {
      if (typeof iframes[i] == 'object' && iframes[i].hasAttribute('class') && iframes[i].className.match('fp-auth-iframe-form')) {
        iframes[i].src += '&socially_logged=1';
      }
    }
  }
}

/**
 * Fonction de fermeture de toutes les frames du parcours avant appel callback.
 */
fpauthentificator.prototype.hideFrames = function() {
  var myObj = this;

  if (myObj.currentActionPremium) {
    myObj.closeFpUserDialogBox();
  }
  else {
    var iframes = document.getElementsByTagName('iframe');
    for (var i in iframes) {
      if (typeof iframes[i] == 'object' && iframes[i].hasAttribute('class') && iframes[i].className.match('fp-auth-iframe-form')) {
        iframes[i].style.display = 'none';
      }
    }
  }
};

/**
 * Construction du formulaire principal de la page.
 */
fpauthentificator.prototype.buildMainCommentForm = function(formContainerKey) {
  var myObj = this;
  var keyContainer;

  if (typeof formContainerKey != 'undefined') {
    keyContainer = formContainerKey;
    if (!myObj.commentFormcontainer[formContainerKey].hasAttribute('data-cfiid')) {
      myObj.commentFormcontainer[formContainerKey].setAttribute('data-cfiid', formContainerKey);
    }
  }
  else if (myObj.currentElementOperation) {
    keyContainer = myObj.currentElementOperation.getAttribute('data-cfiid');
  }
  myObj.buildCommentForm(myObj.commentFormcontainer[keyContainer], 'fpAuth.buildMainCommentForm', 'fpAuth.sendMainComment');
};

/**
 * Construction de formulaire de reponse a un commentaire.
 */
fpauthentificator.prototype.buildAnswerCommentForm = function() {
  var myObj = this;

  if (myObj.passport.commentReplyContainerClass == 'null') {
    if (typeof window.parent.console != 'undefined' && typeof window.parent.console.log == 'function') {
      window.parent.console.log('fpAuth::Debug::Unknown comment class separator.');
    }
    myObj.currentElementOperation.style.display = 'none';
    return;
  }

  var idContainer = 'fpAuthcommentReplyForm-' + myObj.currentElementOperation.getAttribute('data-cid');
  var CommentFormContainer = document.getElementById(idContainer);

  if (!CommentFormContainer) {
    myObj.currentElementOperation.style.display = 'none';
    // Determiner la position du container du formulaire.
    var parentContainer = myObj.getParentByClassName(myObj.currentElementOperation, myObj.passport.commentReplyContainerClass);
    if (parentContainer == null) {
      if (typeof window.parent.console != 'undefined' && typeof window.parent.console.log == 'function') {
        window.parent.console.log('fpAuth::Debug::There is no way this parent exists.');
      }

      myObj.currentElementOperation.style.display = 'none';
      return;
    }

    // Y creer un container.
    CommentFormContainer = document.createElement('div');
    CommentFormContainer.id = idContainer;
    CommentFormContainer.className = 'fpAuth comment-reply';
    CommentFormContainer.setAttribute('data-type', 'comment-form');
    CommentFormContainer.setAttribute('data-nodenid', myObj.currentElementOperation.getAttribute('data-nid'));
    CommentFormContainer.setAttribute('data-cid', myObj.currentElementOperation.getAttribute('data-cid'));

    var url = myObj.currentElementOperation.getAttribute('data-url');
    if (url && url.match(myObj.urlRegexp)) {
      CommentFormContainer.setAttribute('data-url', url);
    }

    // Inserer le container.
    parentContainer.parentNode.insertBefore(CommentFormContainer, parentContainer.nextSibling);
  }

  myObj.buildCommentForm(CommentFormContainer, 'fpAUth.buildAnswerCommentForm', 'fpAuth.sendReplyComment');
};

/**
 * Construit le HTML du formulaire de post des commentaires.
 *
 * @param container.
 * @param buildCallback.
 * @param sendCallback.
 */
fpauthentificator.prototype.buildCommentForm = function(container, buildCallback, sendCallback) {
  var myObj = this;

  // Si on tente de definir un commentaire a envoyer
  // ce commentaire serait dans la value de l'element html d'identifiant :
  // "fpAuth-comment-form-value"
  if (document.getElementById('fpAuth-comment-form-value') && document.getElementById('fpAuth-comment-form-value').value != '') {
    myObj.definedCommentValue = decodeURIComponent(document.getElementById('fpAuth-comment-form-value').value.replace(/\+/g, ' '));
  }

  // Si utilisateur non connecte
  if (!myObj.user) {
    // Affichage de l'invitation a la connexion.
    myObj.loadUnloggedCommentFormHtml(container, buildCallback);
  } else if (!myObj.availableUserForPost) {
    // Ou si utilisateur n'a pas de compte publique
    // Affichage du template avec invitation a l'enrichissement de compte
    myObj.loadUnPublicCommentFormHtml(container, buildCallback);
  } else {
    // Sinon affichage du formulaire
    myObj.loadCommentFormHtml(container, sendCallback);
  }
};

/**
 * Construction html du formulaire de commentaires quand utilisateur non
 * connecte.
 */
fpauthentificator.prototype.loadUnloggedCommentFormHtml = function(container, callBack) {
  var myObj = this;
  var messageBox, button, titre;
  // Reinitialise le contenu du container du formulaire de commentaires
  container.innerHTML = '';
  // Contiend le message affiche aux utilisateur non connectes
  messageBox = document.createElement('p');
  messageBox.className = 'unlogged';

  titre = document.createElement('h6');
  titre.innerHTML = 'Pour commenter cet article, veuillez vous connecter avec votre compte Mon Figaro.';

  container.appendChild(messageBox);
  messageBox.appendChild(titre);

  // Affichage du bouton de connexion
  button = document.createElement('a');
  button.className = 'fpAuth fpAuth-button bleu';
  button.href = '#';
  // Attributs interprete par fpAuth
  button.setAttribute('data-type', 'action');
  button.setAttribute('data-action', callBack);
  button.setAttribute('data-arg', container.getAttribute('data-cfiid'));
  // Action premium pour tous les bouton de connexion lie aux commentaires
  button.setAttribute('data-actionpremium', 'true');
  button.setAttribute('data-public', '1');
  button.setAttribute('data-update', '0');
  button.setAttribute('data-formlevel', 'middle');
  button.innerHTML = 'Connexion';
  // Container pour le bouton
  //var span = document.createElement('span');
  messageBox.appendChild(button);
  // span.appendChild(button);
  // Recre les boutons
  myObj.getNewElements();
};

/**
 * Construction html du formulaire de commentaires quand utilisateur connecte
 * mais non public
 */
fpauthentificator.prototype.loadUnPublicCommentFormHtml = function(container, callBack) {
  var myObj = this;
  var messageBox, button, titre, text, ul, li1, li2;
  // Reinitialise le contenu du container du formulaire de commentaires
  container.innerHTML = '';
  // Contiend le message affiche aux utilisateur non connectes
  messageBox = document.createElement('p');
  messageBox.className = 'unlogged';

  titre = document.createElement('h6');
  titre.innerHTML = 'Pour commenter cet article, complétez votre profil public.';

  container.appendChild(messageBox);
  messageBox.appendChild(titre);

  text = document.createElement('span');
  text.innerHTML = 'Il vous permet de :';
  messageBox.appendChild(text);

  ul = document.createElement('ul');
  li1 = document.createElement('li');
  li2 = document.createElement('li');

  messageBox.appendChild(ul);
  li1.innerHTML = 'commenter et recommander les articles';
  li2.innerHTML = 'suivre les journalistes et thématiques qui vous intéressent';
  ul.appendChild(li1);
  ul.appendChild(li2);

  // Affichage du bouton de connexion
  button = document.createElement('a');
  button.className = 'fpAuth fpAuth-button bleu';
  button.href = '#';
  // Attributs interprete par fpAuth
  button.setAttribute('data-type', 'action');
  button.setAttribute('data-action', callBack);
  button.setAttribute('data-arg', container.getAttribute('data-cfiid'));
  // Action premium pour tous les bouton de connexion lie aux commentaires
  button.setAttribute('data-actionpremium', 'true');
  button.setAttribute('data-public', '1');
  button.setAttribute('data-update', '0');
  button.setAttribute('data-formlevel', 'middle');
  button.innerHTML = 'activer mon profil public';
  // Container pour le bouton
  var span = document.createElement('span');
  messageBox.appendChild(span);
  span.appendChild(button);
  // Recre les boutons
  myObj.getNewElements();
};

/**
 * Construction html du formulaire de commentaires quand utilisateur connecte et
 * publique
 */
fpauthentificator.prototype.loadCommentFormHtml = function(container, callBack) {
  var myObj = this;
  var identite, userPicture, userName, userLink, form, messageBox, textarea, description, button, commentLengthcounter;
  var containerKey = container.getAttribute('data-cfiid');

  // Reinitialise le contenu du container du formulaire de commentaires
  container.innerHTML = '';
  // Contiendra les messages d'erreur et de status.
  messageBox = document.createElement('p');
  messageBox.style.display = 'none';
  container.appendChild(messageBox);
  // Creation du formulaire.
  form = document.createElement('form');
  form.className = 'fpAuth-comment-form';
  container.appendChild(form);
  // Container des images et nom de l'utilisateur
  identite = document.createElement('div');
  identite.className = 'avatar-wrapper';

  // Contruction url vers page utilisateur
  // Dans certain cas l'url dans le cookie ne contient pas
  // le vrai chemin vers la page de l'utilisateur
  // Dans ce cas on utilise le path par defaut /page/uid/[uid]
  var userPagePath = '';
  if (myObj.user.url.toString().match('/page/')) {
    userPagePath = myObj.user.url.toString();
  }
  else {
    userPagePath = myObj.premiumHost +'/page/uid/'+ myObj.user.uid.toString();
  }

  // Creation du lien pour l'avatar.
  var userPictureLink = document.createElement('a');
  userPictureLink.href = userPagePath;
  userPictureLink.className = 'avatar';

  // Avatar
  userPicture = document.createElement('img');
  userPicture.src = myObj.premiumHost + '/sites/default/files/' + myObj.user.picture.toString();
  userPicture.alt = 'Avatar de : ' + decodeURIComponent(myObj.user.name.toString().replace(/\+/g, ' '));

  // Ajout de l'avatar dans le lien.
  userPictureLink.appendChild(userPicture);
  // Ajout la balise <b>
  var avatarArrow = document.createElement('b');
  avatarArrow.className = 'arrow';
  userPictureLink.appendChild(avatarArrow);
  // Ajout du lien dans son container.
  identite.appendChild(userPictureLink);

   // User link
  userLink = document.createElement('a');
  userLink.href = userPagePath;
  userLink.innerHTML = decodeURIComponent(myObj.user.name.toString().replace(/\+/g, ' '));
  userLink.title = 'Aller sur ma page';
  // User Name
  userName = document.createElement('p');
  userName.className = 'username';
  userName.appendChild(userLink);
  identite.appendChild(userName);
  form.appendChild(identite);
  // Creation du textarea qui recevra le commentaire.
  textarea = document.createElement('textarea');
  //textarea.rows = '10';
  //textarea.cols = '50';
  textarea.placeholder = "Ecrivez votre commentaire ...";
  textarea.className = "fpAuth-comment-textarea";
  // Si valeur de commentaire prefenit
  if (myObj.definedCommentValue) {
    textarea.value = myObj.definedCommentValue;
  }
  // Stockage dans l'objet general du textarea
  myObj.commentFormTextarea[containerKey] = textarea;
  form.appendChild(textarea);
  // Description
  description = document.createElement('div');
  description.innerHTML = 'Les commentaires sont limit&eacute;s à '+ myObj.maxCommentLength + ' caract&egrave;res';
  description.className = "fpAuth-comment-form-description";
  form.appendChild(description);
  // Compteur de caracteres restants
  commentLengthcounter = document.createElement('span');
  commentLengthcounter.className = 'comment-lentgh-counter';
  commentLengthcounter.innerHTML = '0/' + myObj.maxCommentLength;
  myObj.commentLengthcounter = commentLengthcounter;
  description.appendChild(commentLengthcounter);
  // Creation du bouton submit.
  button = document.createElement('button');
  button.className = 'fpAuth-button bleu';
  button.innerHTML = 'Valider';
  form.appendChild(button);

  // Compteur de caracteres
  textarea.onkeyup = function() {
    // Limite le nombre de caractere dasn le textarea
    if (this.value.length >= myObj.maxCommentLength) {
      this.value = this.value.substr(0, myObj.maxCommentLength);
    }
    // Affiche le nombre de caractere deja entre dans le textarea.
    myObj.commentLengthcounter.innerHTML = this.value.length + '/' + myObj.maxCommentLength;
  };

  // Assignation de l'action au submit du formulaire
  // Calcule l'url selon la configuration de l'element
  var generatedPath = myObj.buildParcoursPath(container, 'commentForm', callBack, true);
  var scriptPath = generatedPath['main'] + '&js=true' + generatedPath['goto'];
  var scriptDomObj = {
    'type' : 'script',
    'attributes' : {
      'type' : 'text/javascript',
      'src' : scriptPath
    }
  };

  // Si on a un commentaire predefinit (on veut l'envoyer)
  // Duplique le code du bouton submit definit juste au dessus (normal)
  if (myObj.definedCommentValue && myObj.commentAlreadySent[containerKey] == false) {
    // Ajout du formaulaire en cours dans un variable recuperable par la
    // callback.
    myObj.currentElementOperation = container;
    myObj.currentElementType = 'commentForm';
    myObj.currentElementCallback = callBack;
    myObj.currentActionPremium = true;
    // ET donc on l'envoie
    myObj.insertDomElement(scriptDomObj);
  }

  // Action sur le bouton
  button.onclick = function() {
    // Ajout du formaulaire en cours dans un variable recuperable par la
    // callback.
    myObj.currentFormButton = this;
    myObj.currentElementOperation = container;
    myObj.currentElementType = 'commentForm';
    myObj.currentElementCallback = callBack;
    myObj.currentActionPremium = true;

    // Si la valeur dans le texte area est differente de celle par defaut
    // et qu'elle n'est pas vide.
    if (textarea.value != '') {
      // controle de la presence d'un cookie
      if (!myObj.definedCommentValue && !myObj.availableUserForPost) {
        myObj.openFpUserDialogBox(generatedPath['main'] + generatedPath['goto']);
      }
      else {
        // Verifie la validite de l'utilisateur par rapport a la configuration
        // du bouton
        // Utilise l'url du parcours v3 avec un parametre supplementaire : js
        myObj.insertDomElement(scriptDomObj);
      }
    }
    return false;
  };
};

/**
 * Rafraichit le formulaire de commentaire apres connexion utilisateur..
 */
fpauthentificator.prototype.refreshCommentForm = function() {
  var myObj = this;

  var container = myObj.currentElementOperation;
  var containerKey = container.getAttribute('data-cfiid');

  if (myObj.commentFormTextarea[containerKey]) {
    // Rafraichit les donnee utilisateur
    myObj.checkUserCookie(true);
    // Rafraichit le formulaire
    myObj.buildCommentForm(container);
    // Fermeture de la popup
    myObj.closeFpUserDialogBox();
  }
};

/**
 * Envoie d'une reponse.
 */
fpauthentificator.prototype.sendReplyComment = function(){
  var myObj = this;
  var container = myObj.getParentByClassName(myObj.currentFormButton, 'fpAuth');
  myObj.sendComment(container, container.getElementsByTagName('textarea')[0], 'fpauthentificatorReplyCommentSent', container.id);
};

/**
 * Envoie du commentaire principal.
 */
fpauthentificator.prototype.sendMainComment = function(){
  var myObj = this;

  var ContainerKey = myObj.currentElementOperation.getAttribute('data-cfiid');
  if (!myObj.mainCommentAlreadySent[ContainerKey]) {
    myObj.mainCommentAlreadySent[ContainerKey] = true;
    myObj.sendComment(myObj.commentFormcontainer[ContainerKey], myObj.commentFormTextarea[ContainerKey], 'fpauthentificatorMainCommentSent', ContainerKey);
  }
};

/**
 * Requete d' envoi du commentaire vers le web service en jsonp.
 */
fpauthentificator.prototype.sendComment = function(container, textarea, callback, formIdentifier) {
  var myObj = this;

  // Ajout classe pour chargement du resultat
  container.className += ' fpAuth-form-loading';
  var app_id = myObj.passport.appId;
  var content_id = container.getAttribute("data-nodenid");
  var parent_cid = container.getAttribute("data-cid") ? container.getAttribute("data-cid") : 0;
  var comment = encodeURIComponent(textarea.value.substr(0, myObj.maxCommentLength));
  // Url service d'enregistrement du commentaire.
  var url = myObj.premiumHost + '/jsonp/save_comment?callback=' + callback + '&app_id=' + app_id + '&parent_cid='+ parent_cid +'&content_id=' + content_id + '&form_id=' + formIdentifier;

  // Fournit l'url de la page en tant qu'url de recuperation.
  var data_url = '';
  if (container.getAttribute("data-url")) {
    data_url = container.getAttribute("data-url");
  }
  else {
    data_url = document.location.href.replace(document.location.hash, '');
  }

  url += '&url_recup='+ encodeURIComponent(data_url);
  url += '&comment=' + comment;

  // Generation domObject du script a ajouter au document
  var scriptDomObj = {
    'type' : 'script',
    'attributes' : {
      'type' : 'text/javascript',
      'src' : url
    }
  };
  // insertion du script porteur de la requete de commentaire dans le document.
  myObj.insertDomElement(scriptDomObj);
};

/**
 * Fonction callback suite a l'envoie d'une reponse a un commentaire.
 *
 * @param response
 */
var fpauthentificatorReplyCommentSent = function (response) {
  var myObj = window.fpAuth;
  var idContainer = response.request['form_id'];
  var container = document.getElementById(idContainer);

  if (response.status == false && response.error != 'not_logged_in') {
    container.getElementsByTagName('form')[0].innerHTML = '';
  }

  if (container) {
    myObj.commentSent(container, response, 'fpAuth.sendReplyComment');
  }
};

/**
 * Fonction callback suite a l'envoie du commentaire principal.
 *
 * @param response
 */
var fpauthentificatorMainCommentSent = function (response) {
  var myObj = window.fpAuth;
  var containerkey = response.request['form_id'];

  if (response.status == false) {
    myObj.mainCommentAlreadySent[containerkey] = false;
  }

  myObj.commentSent(myObj.commentFormcontainer[containerkey], response, 'fpAuth.sendMainComment');
};

/**
 * Callback jsonp apres envoie du commentaire. Reagit selon le status et
 * affiche le message qui va avec.
 */
fpauthentificator.prototype.commentSent = function(container, response, desyncCallback) {
  var myObj = this;
  var message, className;

  // Suppression de la classe chargement
  container.className = container.className.replace('fpAuth-form-loading', '');

  // Si une erreur est renvoyee
  if (response.status == false) {
    // Ajout classe pour chargement du resultat.
    container.className = container.className.replace('fpAuth-form-loading', '');

    // Si le message d'erreur concerne la desynchro de la session utilisateur
    if (response.error == 'not_logged_in') {
      // On recupere l'url de connexion
      var generatedPath = myObj.buildParcoursPath(container, 'commentForm', desyncCallback, true);
      // Et on ouvre la popup de connexion
      myObj.openFpUserDialogBox(generatedPath['main'] + generatedPath['goto']);
    }
    else {
      // Si le code erreur est : flood
      if (response.error == 'flood') {
        // On affiche le message pour le flood
        message = myObj.commentStatusMessages(response.error);
      }
      else {
        // Sinon on affiche le message par defaut a l'utilisateur
        message = myObj.commentStatusMessages('default');
        // Par contre on affiche dans la console le vrai message
        if (typeof console != 'undefined' && typeof console.log == 'function') {
          console.log(myObj.commentStatusMessages(response.error));
        }
      }
      className = 'error';
    }
  }
  else {
    className = 'status';
    if (response.data.published == true) {
      // Statut renvoye uniquement si utilisateur payant.
      // publication effective
      message = myObj.commentStatusMessages('success');
    }
    else {
      // En attente de publication.
      // pour les comptes gratuits
      message = myObj.commentStatusMessages('moderation');
    }
  }

  // Si on a bien un message
  if (message) {
    var messageBox;
    messageBox = container.getElementsByTagName('p')[0];
    // Affichage du block message
    messageBox.style.display = 'block';
    // Ajout du nouveau message
    messageBox.className = className;
    // et de la classe qui va bien avec.

    // Charge les les elements dom du message.
    for (var elem in message) {
      // Ajout de la target aux elements de premier niveau.
      message[elem]['target'] = messageBox;
      // Insertion de toutes les definitions de dom.
      myObj.insertDomElement(message[elem]);
    }

    // Suppresion du formulaire si deja poste
    if (className == 'status') {
      container.getElementsByTagName('form')[0].innerHTML = '';
    }
  }
};

/**
 * Textes des messages de status d'envois des commentaires.
 */
fpauthentificator.prototype.commentStatusMessages = function(messageCode) {
  var message;
  var doms = [];

  var commons = {
    'thx':{
      'type' : 'h6',
      'children': [{
        'type' : 'text',
        'value' : 'Merci pour votre commentaire'
      }]
    },
    'charte':{
      'type' : 'a',
      'attributes' : {
        'href' : "http://www.lefigaro.fr/charte_moderation/charte_moderation.html",
        'target' : '_blank'
      },
      'children' : [{
        'type' : 'text',
        'value' : 'notre charte'
      }]
    }
  };

  switch(messageCode) {
    // Message utilisateur select ou business.
    case 'success':
      doms[doms.length] = {
        'type' : 'div',
        'children':[
          commons.thx,
          {'type' : 'text', 'value' : "il est publié provisoirement et soumis à modération en priorité. Il sera validé s'il respecte "},
          commons.charte,
          {'type' : 'text', 'value' : "."}
        ]
      };
      break;
    // Message pour les non select ou business.
    case 'moderation':
      doms[doms.length] = {
        'type' : 'div',
        'children':[
          commons.thx,
          {'type' : 'text', 'value' : "Il est enregistré et soumis à modération. Il sera publié s'il est conforme à "},
          commons.charte,
          {'type' : 'text', 'value' : "."}
        ]
      };
      break;
    // Message d'erreur pour les utilisateurs.
    case 'flood':
      doms[doms.length] = {'type' : 'text', 'value':'Vous avez posté trop de commentaires dans l’heure écoulée, veuillez essayer ultérieurement.'};
      break;
    case 'default':
      doms[doms.length] = {'type' : 'text', 'value':"Une erreur est survenue lors de l'envoi de votre commentaire, veuillez essayer ultérieurement."};
      break;

    // Messages de debug affichés dans la console si elle est activée.
    case 'unknown_user':
      message = 'Code erreur : unknown_user - Compte inconnue.';
      break;
    case 'unauthorized_user':
      message = 'Code erreur : unauthorized_user - Compte non autorisé à poster des commentaires.';
      break;
    case 'unknown_article':
      message = 'Code erreur :  unknown_article  - Article est invalide.';
      break;
    case 'comments_closed':
      message = 'Code erreur : comments_closed - Article non ouvert aux commentaires.';
      break;
    case 'comment_too_long':
      message = 'Code erreur : comment_too_long - Texte du commentaire posté est trop long.';
      break;
  }

  return message ? message : doms;
};

/**
 * Construit la requete pour obtenir la liste des commentaires
 */
fpauthentificator.prototype.requestCommentListPage = function(pageNum) {
  var myObj = this;
  var appId = myObj.passport.appId;
  var remoteId = myObj.commentsListContainer.getAttribute("data-nodenid");
  var parentsLimit = myObj.commentsListContainer
      .getAttribute("data-parentslimit") ? myObj.commentsListContainer
      .getAttribute("data-parentslimit") : 0;
  var commentsLimit = myObj.commentsListContainer
      .getAttribute("data-commentslimit") ? myObj.commentsListContainer
      .getAttribute("data-commentslimit") : 0;
  if (remoteId) {
    var scriptPath = myObj.premiumHost
        + '/jsonp/comments_list?callback=fpAuthBuildCommentsList'
        + '&app_id=' + appId + '&page=' + pageNum
        + '&parents_limit=' + parentsLimit + '&comments_limit=' + commentsLimit
        + '&remote_id='+ remoteId;

    // Ajout url de recuperation pour les sites n'en disposant pas.
    for (var siteKey in myObj.sitesWithUnknowRetrievingUrl) {
      if (myObj.passport.appId == myObj.sitesWithUnknowRetrievingUrl[siteKey]) {
        scriptPath +=  '&url='+ encodeURIComponent(document.location.href.replace(document.location.hash, ''));
      }
    }

    var scriptDomObj = {
      'type' : 'script',
      'attributes' : {
        'type' : 'text/javascript',
        'src' : scriptPath
      }
    };
    myObj.insertDomElement(scriptDomObj);
  }
};

/**
 * Construit les page de listings de commentaires
 */
fpauthentificator.prototype.buildCommentsCurrentPage = function(pageToBuild) {
  var myObj = this;
  if (myObj.commentsList.pages[pageToBuild]) {
    // Si on ne retrouve pas le titre du bloc dans le container c'est qu'il faut
    // construire tout le html pour la liste
    var commentsWrapper;
    if (myObj.commentsListContainer.getElementsByTagName('h3').length == 0) {
      // Titre du bloc de listing des commentaires.
      var title = document.createElement('h3');
      title.innerHTML = 'Tous les commentaires';
      // Container des differetns page
      commentsWrapper = document.createElement('div');
      commentsWrapper.className = 'comments-list-wrapper';
      // Et on insere ces elements dans le container principal
      myObj.commentsListContainer.appendChild(title);
      myObj.commentsListContainer.appendChild(commentsWrapper);
      // On stock le wrapper des page de commentaires dans l'objet courant.
      myObj.commentsList.commentsWrapper = commentsWrapper;
    }
    // Si la page n'existe pas deja.
    if (!myObj.commentsList.commentsWrapper.childNodes[pageToBuild]) {
      // on la cree et on l'insere dans le document html.
      commentsPage = document.createElement('div');
      commentsPage.className = 'comments-page-' + pageToBuild;
      myObj.commentsList.commentsWrapper.appendChild(commentsPage);
      // Puis on y ajoute les commentaire un par un
      var article, author, authorLink, date, humanReadableDate, comment, commentObj;
      for (var key in myObj.commentsList.pages[pageToBuild]) {
        commentObj = myObj.commentsList.pages[pageToBuild][key];
        // container du commentaire
        article = document.createElement('article');
        // auteur
        author = document.createElement('div');
        author.className = "author-name";
        // lien vers sa page
        authorLink = document.createElement('a');
        authorLink.href = commentObj['user_page'];
        authorLink.innerHTML = commentObj['user_name'];
        // date de publication
        date = document.createElement('span');
        date.className = "comment-posted";
        var dateObj = new Date((parseInt(commentObj.timestamp) * 1000));
        humanReadableDate = dateObj.getDate() + '/' + (dateObj.getMonth() + 1)
            + '/' + dateObj.getFullYear() + ' - ' + dateObj.getHours() + ':'
            + dateObj.getMinutes();
        date.innerHTML = humanReadableDate;
        // commentaire
        comment = document.createElement('div');
        comment.className = "comment-story description";
        comment.innerHTML = commentObj.comment;

        commentsPage.appendChild(article);
        article.appendChild(author);
        author.appendChild(authorLink);
        author.appendChild(date);
        article.appendChild(comment);
      }
    }
    // Si on est au premier chargement et qu'il y a plusieur pages de
    // commentaires.
    if (pageToBuild == 0 && myObj.commentsList.pages_count > 1) {
      // construction du pager
      var pager, pageNum, previous, next;
      // creation des elements HTML
      pager = document.createElement('nav');
      pageNum = document.createElement('span');
      previous = document.createElement('button');
      next = document.createElement('button');
      // Ajout des textes des boutons
      previous.innerHTML = 'Page précédente';
      next.innerHTML = 'Page suivante';
      pageNum.innerHTML = myObj.commentsList.currentPage + ' / '
          + myObj.commentsList.pages_count;
      // Ajout regles css initiales
      pager.style.textAlign = 'center';
      pager.style.padding = '5px';
      pager.style.position = 'relative';
      previous.style.position = 'absolute';
      previous.style.left = '5px';
      previous.style.display = 'none';
      next.style.position = 'absolute';
      next.style.right = '5px';
      // Ajout du pager dans le document html.
      myObj.commentsListContainer.appendChild(pager);
      pager.appendChild(pageNum);
      pager.appendChild(previous);
      pager.appendChild(next);
      // on ajoute les bouton dans l'objet pour les retrouver plus facilement a
      // l'avenir.
      myObj.commentsList.nextButton = next;
      myObj.commentsList.previousButton = previous;
      myObj.commentsList.numPage = pageNum;
      // Attribution des action au click sur les bouton de navigation du pager
      next.onclick = function() {
        myObj.showCommentPage('next');
        return false;
      };
      previous.onclick = function() {
        myObj.showCommentPage('previous');
        return false;
      };
    }
  }
};

/**
 * Gere la navigation d'une page a l'autre du pager de commentaires
 */
fpauthentificator.prototype.showCommentPage = function(direction) {
  var myObj = this;
  var key;
  // si on demande la page suivante
  if (direction == 'next') {
    // Si la page courante n'est pas la derniere
    if (myObj.commentsList.currentPage < myObj.commentsList.pages_count) {
      // On set le nouveau numero de page
      myObj.commentsList.currentPage += 1;
      myObj.commentsList.numPage.innerHTML = myObj.commentsList.currentPage
          + ' / ' + myObj.commentsList.pages_count;
      // Si la nouvelle page courante est la derniere on cache le bouton
      // suivant.
      if (myObj.commentsList.currentPage >= myObj.commentsList.pages_count) {
        myObj.commentsList.nextButton.style.display = 'none';
      }
      // on affche le bouton precedent
      myObj.commentsList.previousButton.style.display = 'inline';
      // on cache toutes les pages
      for (key in myObj.commentsList.commentsWrapper.childNodes) {
        if (myObj.commentsList.commentsWrapper.childNodes[key].nodeType == 1
            || myObj.commentsList.commentsWrapper.childNodes[key].nodeType == 2) {
          myObj.commentsList.commentsWrapper.childNodes[key].style.display = 'none';
        }
      }
      // Si la page de commentaires n'existe pas.
      if (!myObj.commentsList.commentsWrapper.childNodes[(myObj.commentsList.currentPage - 1)]) {
        // puis on enclenche la requete de recuperation
        myObj.requestCommentListPage((myObj.commentsList.currentPage - 1));
      } else {
        // Sinon on l'affiche
        myObj.commentsList.commentsWrapper.childNodes[(myObj.commentsList.currentPage - 1)].style.display = 'block';
      }
    }
  }
  else {
    // sinon on considere qu'on demande la page precedente
    // Et si la page courante n'est pas la premiere
    if (myObj.commentsList.currentPage > 1) {
      // On set le nouveau numero de page
      myObj.commentsList.currentPage -= 1;
      myObj.commentsList.numPage.innerHTML = myObj.commentsList.currentPage
          + ' / ' + myObj.commentsList.pages_count;
      // Si la nouvelle page courante est la premiere on cache le bouton
      // precedent.
      if (myObj.commentsList.currentPage <= 1) {
        myObj.commentsList.previousButton.style.display = 'none';
      }
      // on affche le bouton suivant
      myObj.commentsList.nextButton.style.display = 'inline';
      // on cache toutes les pages
      for (key in myObj.commentsList.commentsWrapper.childNodes) {
        if (myObj.commentsList.commentsWrapper.childNodes[key].nodeType == 1
            || myObj.commentsList.commentsWrapper.childNodes[key].nodeType == 2) {
          myObj.commentsList.commentsWrapper.childNodes[key].style.display = 'none';
        }
      }
      // On affiche que le bloc qui nosu interressse.
      myObj.commentsList.commentsWrapper.childNodes[(myObj.commentsList.currentPage - 1)].style.display = 'block';
    }
  }
};

/**
 * Met en place les boutons
 */
fpauthentificator.prototype.setButtons = function() {
  var myObj = this;
  var dataType;
  if (myObj.knownElements['links'].length > 0) {
    for ( var i = 0; i < myObj.knownElements['links'].length; i++) {
      // Type de boutton.
      dataType = (myObj.knownElements['links'][i].getAttribute("data-type")) ? myObj.knownElements['links'][i].getAttribute("data-type") : 'connect';
      switch (dataType) {
        case 'connect':
          break;
        case 'action':
          myObj.knownElements['links'][i].setAttribute('data-linkkey', i);
          myObj.knownElements['links'][i].onclick = function() {
            // Determine si Actionpremium ou non
            var actionpremium = this.getAttribute("data-actionpremium") ? true : false;
            // Generation du lien vers la popup
            var generatedHref = myObj.buildParcoursPath(this, 'login', this.getAttribute("data-action"), actionpremium);
            myObj.currentElementOperation = this;
            myObj.currentElementType = 'login';
            myObj.currentElementCallback = this.getAttribute("data-action");
            myObj.currentActionPremium = actionpremium;

            myObj.recocurrentOperationKey = this.getAttribute('data-linkkey');
            myObj.recocurrentOperationType = 'links';
            // controle session
            if (!myObj.user) {
              myObj.openUserLoginCourse(generatedHref['main'] + generatedHref['goto'], generatedHref['main'] + generatedHref['baseUrl']);
            } else {
              // Verifie la validite de l'utilisateur par rapport a la
              // configuration du bouton
              var scriptPath = generatedHref['main'] + '&js=true'
                  + generatedHref['goto'];
              var scriptDomObj = {
                'type' : 'script',
                'attributes' : {
                  'type' : 'text/javascript',
                  'src' : scriptPath
                }
              };
              myObj.insertDomElement(scriptDomObj);
            }
            return false;
          };
          break;
      }
    }
  }
};

/**
 * Build link from both current link + general passport.
 *
 * @param elem
 * @param typeForm
 * @param callbackName
 * @param actionpremium
 * @returns string typeForm
 */
fpauthentificator.prototype.buildParcoursPath = function(elem, typeForm, callbackName, actionpremium) {
  var myObj = this;
  // Instancie les variables utiles.
  var formAppId, publicValue, updateValue, version, callback;
  var generatedHref = [];

  // Set l'appid depuis le lien ou les valeurs du passport.
  formAppId = (elem.getAttribute("data-appId")) ? elem.getAttribute("data-appId") : myObj.passport.appId;

  if (typeForm == 'commentForm') {
    publicValue = '1';
    version = 'middle';
    updateValue = '0';
  }
  else {
    publicValue = (elem.getAttribute("data-public")) ? elem.getAttribute("data-public") : myObj.passport.defautlFormValues['data-public'];
    version = (elem.getAttribute("data-formlevel")) ? elem.getAttribute("data-formlevel") : myObj.passport.defautlFormValues['data-formlevel'];
    updateValue = (elem.getAttribute("data-update")) ? elem.getAttribute("data-update") : myObj.passport.defautlFormValues['data-update'];
  }

  // Construction de l'url de callback.
  // Detache les possibles hash de l'url.
  // Si le callback est reconnu comme une url.
  if (callbackName) {
    callback = callbackName;
  }
  else {
    // Ajout url par defaut.
    if (myObj.passport.defautlFormValues['data-goto'] && myObj.passport.defautlFormValues['data-goto'].match(myObj.urlRegexp)) {
      callback = myObj.passport.defautlFormValues['data-goto'];
    }
    else {
      // Par defaut on rafraichira la page.
      callback = 'refresh_parent_page';
    }
  }

  if (myObj.responsiveRun) {
    var gotoUrl = document.location.href.replace(document.location.hash, '');
    generatedHref['baseUrl'] = '&goto_url=' + encodeURIComponent(gotoUrl);
  }

  if (callback.match(myObj.urlRegexp)) {
    callback = encodeURIComponent(callback);
    generatedHref['baseUrl'] = '&goto_url=' + callback;
  }

  // Mise en string.
  generatedHref['main'] = myObj.premiumHost.replace('http:/', 'https:/') + '/fpservice/fp_auth/login?app_id=' + formAppId + '&public=' + publicValue + '&force_update=' + updateValue + '&level_name=' + version;
  // Ajout du parametre pour activation verticale.
  if (actionpremium) {
    generatedHref['main'] += '&action_premium=1';
  }
  generatedHref['goto'] = '&callback=' + callback;

  return generatedHref;
};

/**
 * Gestion du passport de la verticale.
 *
 * @param clientPassport
 */
fpauthentificator.prototype.setPassport = function(clientPassport) {
  var myObj = this;
  myObj.passport = {
    'appId' : clientPassport.appId,
    'customFormLogo' : (clientPassport.customFormLogo == 'default') ? 'http://plus.lefigaro.fr/sites/default/themes/figaropremium/images/fplinks.png' : clientPassport.customFormLogo,
    "commentReplyContainerClass" :(!clientPassport.commentReplyContainerClass) ? null : clientPassport.commentReplyContainerClass,
    'defautlFormValues' :{
      'data-goto' : clientPassport.defautlFormValues['data-goto'],
      'data-formlevel' : clientPassport.defautlFormValues['data-formlevel'],
      'data-public' : (!clientPassport.defautlFormValues['data-public']) ? '0' : clientPassport.defautlFormValues['data-public'],
      'data-update' : (!clientPassport.defautlFormValues['data-update']) ? '0' : clientPassport.defautlFormValues['data-update']
    }
  };
};

/**
 * Check user session Via une requete json.
 */
fpauthentificator.prototype.checkUserCookie = function(reloadUserBar) {
  var myObj = this;
  // Recuperation du cookie.
  var fpCookieName = 'figaro_toolbar';
  var fpCookie = myObj.getCookie(fpCookieName);
  if (fpCookie) {
    var userJustlogged = false;
    // Si l'utilisateur n'etais pas connecte
    if (!myObj.user) {
      // on stock cette infos
      // Pour determiner si on doit recharger la user-bar
      userJustlogged = true;
    }
    // On unserialize le cookie
    myObj.user = myObj.cookieUnserialize(fpCookie);
    // Parmis les roles de l'utilisateur en cours
    for (var rid in myObj.user.roles) {
      // Si on trouve le role connecte
      if (myObj.user.roles[rid].toString() == 'Connect') {
        // L'utilisateur a acces aux actions communautaires.
        myObj.availableUserForPost = true;
      }
    }
  }

  // Si on demande de reload la user bar
  // et que le user vient de se logguer.
  if (reloadUserBar && userJustlogged) {
    // Si on trouve la methode du framework.
    if (typeof ffw_loadUserDataCookie == 'function') {
      window.parent.ffw_loadUserDataCookie('', true);
    }
    else if (typeof figaropremiumReloadUserBar == 'function') {
      // Si on est sur premium on recharge la user bar avec la methode local.
      window.parent.figaropremiumReloadUserBar();
    }
  }
};

/**
 * Verifie l'acces de l'utilisateur au service demande a premium via requete json.
 */
fpauthentificator.prototype.userAccess = function(result) {
  var myObj = this;
  // Si result == false
  var generatedHref = myObj.buildParcoursPath(myObj.currentElementOperation, myObj.currentElementType, myObj.currentElementCallback, myObj.currentActionPremium);
  if (!result) {
    // Affichage de la popup
    myObj.openUserLoginCourse(generatedHref['main'] + generatedHref['goto'], generatedHref['main'] + generatedHref['baseUrl']);
  } else {
    // Sinon On passe l'url de retour a l'url inspector pour qu'il declenche le
    // bon callback.
    myObj.urlInspector(generatedHref['goto'].replace('&callback=', ''));
  }
};

/**
 * Insere un element dom a partir d'un objet le definissant.
 */
fpauthentificator.prototype.insertDomElement = function(domObject) {
  var myObj = this;
  var newDomElement;

  if (domObject.type == 'text') {
    newDomElement = document.createTextNode(domObject.value);
  }
  else {
    newDomElement = document.createElement(domObject.type);

    if (domObject.attributes) {
      for (var attribute in domObject.attributes) {
        if (domObject.attributes.hasOwnProperty(attribute)) {
          newDomElement.setAttribute(attribute, domObject.attributes[attribute]);
        }
      }
    }
  }

  if (domObject.type == 'script' || domObject.type == 'link') {
    document.getElementsByTagName('head')[0].appendChild(newDomElement);
  }
  else {
    if (domObject.target) {
      domObject.target.appendChild(newDomElement);
    }
  }

  // Insertion des enfants.
  if (domObject.children) {
    for (var child in domObject.children) {
      if (domObject.children.hasOwnProperty(child)) {
        domObject.children[child]['target'] = newDomElement;
        myObj.insertDomElement(domObject.children[child]);
      }
    }
  }
};

/**
 * Determine si il faut ouvrir une popup ou une fenetre.
 *
 * @param nonResponsiveUrl
 *   Url du parcours a emprunter en non responsive.
 * @param responsiveUrl
 *   Url du parcours a emprunter en responsive.
 */
fpauthentificator.prototype.openUserLoginCourse = function(nonResponsiveUrl, responsiveUrl) {
  var myObj = this;
  // met a jours la valeurs si changement d'orientation tablette par exemple.
  myObj.responsiveRun = window.innerWidth < myObj.screenThresholdWidth;
  // Si la fenetre est suffisament grande on ouvre une popup.
  if (!myObj.responsiveRun) {
    myObj.openFpUserDialogBox(nonResponsiveUrl);
  }
  else {
    // Sinon on stoke les actions en cours dans un cookie temporaire.
    // et apres la redirection on execute les action en cours.
    // Duree du cookie 1 minute.
    var cookieData = {
      recocurrentOperationKey : myObj.recocurrentOperationKey,
      recocurrentOperationType : myObj.recocurrentOperationType,
      currentElementCallback :  myObj.currentElementCallback,
      currentActionPremium :  myObj.currentActionPremium
    };

    myObj.setCookie('fp-auth-data', JSON.stringify(cookieData), 120);
    // Execution de la redirection de la page.
    document.location.href = responsiveUrl.replace('fpservice/fp_auth/login', 'user');
  }
};

/**
 * Dissimule la popup de connexion;
 */
fpauthentificator.prototype.closeFpUserDialogBox = function() {
  if (document.getElementById('fp-dialog-screen-blocker') != null) {
    document.getElementById('fp-dialog-screen-blocker').style.display = 'none';
    document.getElementById('fp-dialog-popup').style.display = 'none';
    document.getElementById('fp-dialog-iframe').style.display = 'none';
  }

  // Si on est sur une popup de message d'erreur du parcours de reset
  // password, le cookie est supprimé.
  var myObj = fpAuth;
  if (myObj.resetPwd && myObj.resetPwd == true) {
    // Reset le cookie Si il existait.
    myObj.setCookie('figaro_pwd', '', -1, true);
    myObj.resetPwd = false;
    myObj.postInit();
  }
};

/**
 * Affiche de la popup de connexion.
 */
fpauthentificator.prototype.openFpUserDialogBox = function(externalDialogUrl) {
  var myObj = this;
  // Screen blocker.
  if (document.getElementById('fp-dialog-screen-blocker') == null) {
    var screenBlocker = document.createElement('div');
    screenBlocker.id = 'fp-dialog-screen-blocker';
    screenBlocker.onclick = function() {
      myObj.closeFpUserDialogBox();
      return false;
    };
    document.body.appendChild(screenBlocker);
  }
  else {
    screenBlocker = document.getElementById('fp-dialog-screen-blocker');
  }

  // Popup.
  if (document.getElementById('fp-dialog-popup') == null) {
    // Container
    var popupLayer = document.createElement('div');
    popupLayer.id = 'fp-dialog-popup';
    document.body.appendChild(popupLayer);

    // Bouton de fermeture.
    var popupCloseWrapper = document.createElement('div');
    popupCloseWrapper.id = 'fp-dialog-close-popup-wrapper';
    popupLayer.appendChild(popupCloseWrapper);

    var popupCloseButton = document.createElement('a');
    popupCloseButton.id = 'fp-dialog-close-popup';
    popupCloseButton.href = '#';
    popupCloseButton.innerHTML = 'X';

    popupCloseWrapper.appendChild(popupCloseButton);

    popupCloseButton.onclick = function() {
      myObj.closeFpUserDialogBox();
      return false;
    };
  }
  else {
    popupLayer = document.getElementById('fp-dialog-popup');
  }

  // Styles recalcules en case de redimensionnement.
  var screenSize = myObj.getScreenInfos(document.body);
  screenBlocker.style.height = screenSize.h + 'px';
  screenBlocker.style.width = screenSize.w + 'px';
  screenBlocker.style.display = 'block';

  if (window.innerWidth > 940) {
    popupLayer.style.left = (window.innerWidth - 940) / 2 + 'px';
  }
  else {
    popupLayer.style.left = 0;
  }
  popupLayer.style.display = 'block';

  // Iframe.
  if (document.getElementById('fp-dialog-iframe') == null) {
    var iFrame = document.createElement('iframe');
    iFrame.id = 'fp-dialog-iframe';
    iFrame.name = 'fp-dialog-iframe';
    iFrame.scrolling = 'auto';
    iFrame.marginheight = "0";
    iFrame.marginwidth = "0";
    iFrame.frameBorder = "0";
    document.getElementById('fp-dialog-popup').appendChild(iFrame);
  }
  else {
    document.getElementById('fp-dialog-iframe').style.display = 'block';
  }

  // Url vers extra-light login form.
  document.getElementById('fp-dialog-iframe').src = externalDialogUrl;
};

/**
 * Fonction de redimensionnement de l'iframe.
 */
fpauthentificator.prototype.resizeIframe = function(iframeInnerHeight) {
  var iframe, myObj = this, iframeHeight = parseInt(iframeInnerHeight);

  // Gestion du repositionnement du parcours quand action monfigaro.
  var popup = document.getElementById('fp-dialog-popup');
  if (myObj.currentActionPremium || popup && popup.style.display == 'block') {
    var popupPadding = 90;
    var windowHeight = window.innerHeight;
    var popupHeight = iframeHeight + popupPadding;
    iframe = document.getElementById('fp-dialog-iframe');

    if (windowHeight < popupHeight) {
      popup.style.top = '20px';
      iframeHeight = windowHeight - popupPadding - 20;
    }
    else {
      popup.style.top = ((windowHeight - popupHeight - 20) / 2) + 'px';
      iframeHeight += popupPadding;
    }
  }
  // Gestion du repositionnement du parcours quand action verticale.
  else {
    var iframes = document.getElementsByTagName('iframe');
    for (var i in iframes) {
      if (typeof iframes[i] == 'object' && iframes[i].hasAttribute('class') && iframes[i].className.match('fp-auth-iframe-form')) {
        iframe = iframes[i];
      }
    }
  }
  if (iframe && iframeHeight > 0) {
    iframe.style.height = iframeHeight + 'px';
  }
};

/**
 * Retourne les dimensions relatives a l'ecran de l'utilisateurs.
 */
fpauthentificator.prototype.getScreenInfos = function(elem) {
  var obj = elem;
  var curleft = obj.offsetLeft || 0;
  var curtop = obj.offsetTop || 0;
  var curHeight = screen.height;
  var curWidth = screen.width;

  while (obj = obj.offsetParent) {
    curleft += obj.offsetLeft;
    curtop += obj.offsetTop;
    curHeight += window.innerHeight;
    curWidth += window.innerWidth;
  }
  return {
    x : curleft,
    y : curtop,
    h : curHeight,
    w : curWidth
  };
};

/**
 * Recuperation des cookies.
 */
fpauthentificator.prototype.getCookie = function(c_name) {
  var i, x, y, ARRcookies = document.cookie.split(";");
  var cookieObj = false;
  for (i = 0; i < ARRcookies.length; i++) {
    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
    x = x.replace(/^\s+|\s+$/g, "");
    if (x == c_name) {
      cookieObj = decodeURIComponent(y);
    }
  }
  return cookieObj;
};

/**
 * Definition du cookies.
 *
 * @param c_name
 *   nom du cookie.
 * @param value
 *   Valeur du cookie.
 * @param exSecondes
 *   Temps supplementaire de validite du cookie.
 * @param domain
 *   Indique si on doit spécifier le domain figaro.fr. Si le cookie à étét créer
 *   avec son domain, il faut le détruire avec les mêmes information de domain
 *   et de path.
 */
fpauthentificator.prototype.setCookie = function(c_name, value, exSecondes, domain) {
  var exdate = new Date();
  m = exdate.getTime() + (exSecondes * 1000);
  var d = new Date(m);
  var c_value = encodeURIComponent(value) + ((exSecondes==null) ? "" : "; expires="+d.toUTCString());

  if (domain) {
    c_value += ' ;path=/; domain=' + '.lefigaro.fr';
  }

  document.cookie=c_name + "=" + c_value;
};

/**
 * Lecture du cookie.
 */
fpauthentificator.prototype.cookieUnserialize = function(v) {
  if (!v) {
    return null;
  }
  var s;

  var _un = function(v) {
    s = v;
    var t, e, n, i;
    while (s) {
      switch (s.charAt(0)) {
        case 's':
          e = parseInt(s.substr(2, s.indexOf(':') + 1));
          t = s.substr(s.indexOf(':', 2) + 2, e);
          s = s.substr(s.indexOf(';', e + 5) + 1);
          return t;
        case 'i':
          t = parseInt(s.substr(2, s.indexOf(';', 2) + 1));
          s = s.substr(s.indexOf(';') + 1);
          return t;
        case 'd':
          t = parseFloat(s.substr(2, s.indexOf(';', 2)));
          s = s.substr(s.indexOf(';') + 1);
          return t;
        case 'b':
          t = s.substr(2, s.indexOf(':'));
          s = s.substr(s.indexOf(';') + 1);
          return !!((t === '1'));
        case 'N':
          s = s.substr(s.indexOf(';') + 1);
          return '';
        case 'a':
          t = [];
          e = s.indexOf(':', 2) - 2;
          n = s.substr(2, e);
          s = s.substr(s.indexOf('{') + 1);
          for (i = 0; i < n; i++)
            t[_un(s)] = _un(s);
          s = s.substr(s.indexOf('}') + 1);
          return t;
        case 'O':
        default:
          e = s.indexOf(':', s.indexOf(':', s.indexOf(':') + 2) + 1) - 1;
          tS = 's' + s.substr(s.indexOf(':'), e) + ';';
          o = s;
          var cN = _un(tS);
          try {
            t = eval('new ' + cN + '()');
          } catch (e) {
            t = {};
          }
          s = o.substr(e);
          n = s.substr(2, s.indexOf(':', 2) - 2);
          s = s.substr(s.indexOf('{') + 1);
          for (i = 0; i < n; i++)
            t[_un(s)] = _un(s);
          s = s.substr(s.indexOf('}') + 1);
          return t;
      }
      return '';
    }
  };

  return _un(v);
};

/**
 * Verifie la presence eventuelle de parametres dans l'url indiquant une fin de parcours.
 * Ces parametres peuvent etre :
 * - js_callback
 * - url_callbackconnexion/password
 * - refresh_parent_page
 * - fp_callback=window.parent.refresh_parent_page().
 */
fpauthentificator.prototype.urlInspector = function(callback) {
  var myObj = window.parent.fpAuth;

  callback = decodeURIComponent(callback);
  if (callback.match(myObj.urlRegexp)) {
    window.location.href = callback;
  }
  else if (typeof eval(callback) == 'function') {
    if (myObj.currentElementOperation && myObj.currentElementOperation.hasAttribute('data-arg')) {
      eval(callback + '('+ myObj.currentElementOperation.getAttribute('data-arg') +')');
    }
    else {
      eval(callback + '()');
    }
  }
  else {
    refresh_parent_page();
  }
};

/**
 * Page onload Listener.
 */
fpauthentificator.prototype.onload = function() {
  // Si Internet Explorer.
  if (navigator.appName == 'Microsoft Internet Explorer') {
    var ua = navigator.userAgent;
    var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null) {
      var ver = parseFloat(RegExp.$1);
    }
    if (ver >= 6.0) {
      window.onload = function() {
        setTimeout(
            "if (typeof alreadyrunflag == 'undefined' || !alreadyrunflag){fpAuth.init();}",
            0);
      };
    } else {
      alert('Votre navigateur n\'est pas supporté, veuillez le mettre à jours, ou changer de navigateur.');
    }
  }
  else if (typeof ffw_detectIE6 == 'function') {
    // Si detection du framework figaro.
    // Chargement de l'application par le framework.
    if (typeof document.domainApplicationToLoad == 'undefined') {
      // Creation du tableau des methodes a charger par le framework.
      document.domainApplicationToLoad = [];
    }
    // Ajout de la dite methode.
    document.domainApplicationToLoad[document.domainApplicationToLoad.length] = 'fpAuth.init';
  }
  else {
    // Sinon autoload.
    var alreadyrunflag = null;
    // Detection ie
    // flag to indicate whether target function has already been run.
    if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", function() {
        alreadyrunflag = 1;
        fpAuth.init();
      }, false);
    }
    else if (document.all && !window.opera) {
      document.write('<script id="contentloadtag" defer src="javascript:void(0)"><\/script>');
      var contentloadtag = document.getElementById("contentloadtag");
      contentloadtag.onreadystatechange = function() {
        if (this.readyState == "complete") {
          alreadyrunflag = 1;
          fpAuth.init();
        }
      };
    }
    else if (/Safari/i.test(navigator.userAgent)) {
      // Test for Safari.
      var _timer = setInterval(function() {
        if (/loaded|complete/.test(document.readyState)) {
          clearInterval(_timer);
          // call target function
          fpAuth.init();
        }
      }, 10);
    }
  }
};

/**
 * Callback de la requete jsonp du listing de commentaire.
 */
var fpAuthBuildCommentsList = function(response) {
  var myObj = window.fpAuth;
  if (response.data.status == true) {
    var commentsData = response.data.comments;
    // Si on trouve des commentaire.
    if (commentsData.comment_count > 0) {
      // on les stocks dans l'objet general pour ne pas refaire la requete pour
      // cette page.
      // on stock le nombre de page qui sera utile plus tard.
      myObj.commentsList.pages_count = commentsData.pages_count;
      // Et les commentaires.
      myObj.commentsList.pages[commentsData.page_current] = commentsData.comments;
      // Puis on lance la construction de la page.
      myObj.buildCommentsCurrentPage(commentsData.page_current);
    }
    else {
      // Il n'y pas de commentaire pour cette page.
      // On ajoute un message en console.
      if (typeof console != 'undefined' && typeof console.log == 'function') {
        console.log('Pas de de commentaires trouves pour ce node! revenez plus tard !');
      }
    }
  }
  else {
    if (typeof console != 'undefined' && typeof console.log == 'function') {
      console.log('Pas de node correspondant a la requete !');
    }
  }
};

/******************************************************************/
/************************** FPAPP ********************************/
/*****************************************************************/

/**
 * Initialisation des actions javascript sur les liens recommander.
 */
fpauthentificator.prototype.searchNewRecoLinks = function() {
  var myObj = this;

  // Pour toutes les div de la page.
  var lotOfDivs = document.getElementsByTagName('div');
  var keys = [];
  for(var k=0;k<myObj.recolinksType.length;k++) {
    keys[myObj.recolinksType[k]] = 0;
  }

  for (var i=0;i<lotOfDivs.length;i++ ) {
    for(var j=0;j<myObj.recolinksType.length;j++) {
      if (lotOfDivs[i].className.match(myObj.recolinksType[j] + '-container') && !lotOfDivs[i].className.match('knownfpAppLink')) {
        lotOfDivs[i].className += ' knownfpAppLink';
        // Preparation du html du liens pour les recommander, suivre, et selectionner.
        var prepared = myObj.prepareLink(myObj.recolinksType[j], lotOfDivs[i], keys[myObj.recolinksType[j]]);
        if (prepared) {
          //  Mise en cache des elements html.
          myObj.recolinksContainer[myObj.recolinksType[j]][keys[myObj.recolinksType[j]]] = lotOfDivs[i];
          myObj.recolinks[myObj.recolinksType[j]][keys[myObj.recolinksType[j]]] = lotOfDivs[i].children[0];
          // Creation des requetes de recuperation informations deja recommandes ou suivis.
          var InfosGetterPropal = 'myObj.linksGetInfos' + myObj.recolinksType[j];
          if (typeof eval(InfosGetterPropal) == 'function') {
            eval(InfosGetterPropal)(keys[myObj.recolinksType[j]], myObj.recolinksType[j], myObj.recolinks[myObj.recolinksType[j]][keys[myObj.recolinksType[j]]]);
          }
          else {
            myObj.linksGetInfos(keys[myObj.recolinksType[j]], myObj.recolinksType[j], myObj.recolinks[myObj.recolinksType[j]][keys[myObj.recolinksType[j]]]);
          }
          // Verifie si l'utilisateur presentant un bouton suivre existe bien.
          myObj.linksCheckIfUserExists(keys[myObj.recolinksType[j]], myObj.recolinksType[j]);
          // Incrementation du tableau.
          keys[myObj.recolinksType[j]]++;
        }
      }
    }
  }

  // Recre les boutons.
  myObj.setButtons();

  // Execution des requetes de get infos pour les liens
  for (var key in  myObj.recoqueries) {
    myObj.insertDomElement(myObj.recoqueries[key]);
  }
};

/**
 * Preparation du html des liens.
 * Et transformation en bouton reconnu par fpAuth.
 */
fpauthentificator.prototype.prepareLink = function(linkType, container, key) {
  var myObj = this;
  // Creation des composant html pour le bouton recommander.
  var recoLink, text;
  // Assure la retrocompatibilite avec l'ancien system.
  if (container.getElementsByTagName('a').length > 0) {
    // Si un lien existe deja on le vide.
    recoLink = container.getElementsByTagName('a')[0];
    recoLink.innerHTML= '';
  }
  else {
    // Sinon on cree le lien avec le bon url.
    recoLink = document.createElement("a");
  }
  switch(linkType) {
    case 'recommander':
      // Traitements specifiques aux recommander.
      recoLink.href = myObj.premiumHost + '/fpservice/recommander/' + container.getAttribute('data-type')
        +'/'+ container.getAttribute('data-appId') +'/'+ container.getAttribute('data-cid');

      // Reporte sur le lien, l'url de recup fournie par le container.
      if (container.getAttribute('data-url')) {
        recoLink.setAttribute('data-url', container.getAttribute('data-url'));
      }

      // On definit les textes.
      text  = document.createTextNode("Recommander");
      // Et le container pour le comptage.
      var span = document.createElement("span");
      recoLink.appendChild(span);
      break;

    // Url de traitement pour les boutons suivre :
    // - membre http://cmaringue.premium.lefigaro.fr:8090/fpservice/follow/membre/[appid]/[uid]
    // - tag http://cmaringue.premium.lefigaro.fr:8090/fpservice/follow/tag/[tag-name]
    case 'suivre':
      // On definit les textes
      text  = document.createTextNode("Suivre");
      // Traitements specifiques aux recommander.
      recoLink.href = myObj.premiumHost + '/fpservice/follow/membre/' + container.getAttribute('data-appId')
        +'/'+ container.getAttribute('data-uid');
      break;

    case 'suivretag':
      // On definit les textes
      text  = document.createTextNode("Suivre");
      // Creation du path.
      recoLink.href = myObj.premiumHost+'/fpservice/follow/tag/'+ encodeURIComponent(container.getAttribute('data-term'));
      break;

    case 'selectionner':
      var isJournaliste = false;
      var allowedRoles = {
        8:"Journaliste",
        9:"Community+Manager"
      };
      if (myObj.user) {
        for (role in myObj.user.roles) {
          isJournaliste = (!!allowedRoles[role] || isJournaliste);
        }
      }
      if (!isJournaliste) {
        container.parentNode.removeChild(container);
        return false;
      }
      // On definit les textes.
      text  = document.createTextNode("Sélectionner");
      // Traitements specifiques aux 'selectionner un commentaire'.
      recoLink.href = myObj.premiumHost + '/jsonp/select_comment?callback=fpComActionsJsCallBack&comment_id=' + container.getAttribute('data-cid');
      break;
  }

  recoLink.appendChild(text);
  // Reset le contenu du container.
  container.innerHTML= '';
  // Ajout du nouveau lien formate convenablement.
  container.appendChild(recoLink);

  // Transformation en bouton d'action.
  var link =  container.getElementsByTagName('a')[0];
  // Attributs interprete par fpAuth.
  link.className += ' fpAuth';
  link.setAttribute('data-type', 'action');
  link.setAttribute('data-action', 'fpAuth.actionDispatcher');
  // Attributs interprete par fpApp.
  // Determine le lien qui sera clique.
  link.setAttribute('fpApp-key', key);
  link.setAttribute('fpApp-type', linkType);
  // L'app_id n'est pas forcement definit dans le lien,
  // dans ce cas par defaut il faut utiliser celui du passport.
  link.setAttribute('fpApp-appid', container.getAttribute('data-appId') ? container.getAttribute('data-appId') : myObj.passport.appId);

  // Action premium pour tous les liens recommander ou suivre.
  // Prise en charge du systeme connexion du user.
  link.setAttribute('data-actionpremium', 'true');
  link.setAttribute('data-public', '1');
  link.setAttribute('data-update', '0');
  link.setAttribute('data-formlevel', 'middle');

  return true;
};

/**
 * Fonction helper de recuperation du contenu d'un meta tag.
 */
fpauthentificator.prototype.getMetaContent = function(property) {
  var metas = document.getElementsByTagName('meta');
  for (var i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute("property") == property) {
      return metas[i].getAttribute("content");
    }
  }
  return '';
};

/**
 * Attribution de l'action au clic sur les liens.
 */
fpauthentificator.prototype.actionDispatcher = function() {
  var myObj = window.fpAuth;
  // Le lien en cours est stocke dans fpAuth.
  var link = fpAuth.currentElementOperation;
  if (link) {
    // Recupere dans les attribut du lien
    // les details de l'operation en cours pour fpApp.
    myObj.recocurrentOperationKey = link.getAttribute('fpApp-key');
    myObj.recocurrentOperationType = link.getAttribute('fpApp-type');
    var linkAppId = link.getAttribute('fpApp-appid');

    // Creation du script src.
    var scriptPath = link.href + '/fpComActionsJsCallBack';

    // Sur une page d'article on recupere l'url des metas.
    var url = myObj.getMetaContent('og:url');

    // Sur les pages de listing depuis la propriete data-url.
    if (!url && link.getAttribute('data-url')) {
      url = link.getAttribute('data-url');
    }

    if (url) {
      scriptPath += '?url=' + encodeURIComponent(url);
    }

    var scriptDomObj = {'type':'script', 'attributes': {'type':'text/javascript', 'src':scriptPath}};
    // Utilisateur connecte.
    // Creation du script src.
    // Recupere dans les attribut du lien
    // les detail de l'operation en cours pour fpApp
    // La methode fpAuth.insertDomElement permet d'ajouter dans le document un script.
    fpAuth.insertDomElement(scriptDomObj);
  }
};

/**
 * CallBack apres connexion via iframe.
 */
fpauthentificator.prototype.userConnexionCallBack = function () {
  var myObj = this;
  // On re-verifie l'etat de l'utilisateur
  myObj.checkUserCookie();
  // Et on renvoie au dispatcher
  myObj.actionDispatcher();
};

/**
 * Action specicifique au mouseOver pour les liens suivre.
 */
var followLinkMouseOver = function(bouton) {
  var link = bouton.childNodes[0];
  var title = link.title;
  var textContent = link.innerHTML;
  var classes = link.className;

  // Inverse les titre et textes du lien.
  link.innerHTML = title;
  link.title = textContent;

  // Ajuste les classes.
  if (classes.match('fpApp-follow-abonne')) {
    link.className = 'fpApp-follow-unfollow';
    bouton.className.replace('fpApp-follow-abonne', 'fpApp-follow-unfollow');
  }
  else if (classes.match('fpApp-follow-unfollow')) {
    link.className = 'fpApp-follow-abonne';
    bouton.className.replace('fpApp-follow-unfollow', 'fpApp-follow-abonne');
  }
};

/**
 * Recupere les infos dans le lien et effectue la requete pour recuperer les infos supplementaires.
 */
fpauthentificator.prototype.linksGetInfos = function(key, linkType, link){
  var myObj = this;
  var splittedLink = link.href.split('/');
  myObj.recolinksInfos[linkType][key] = {
    'action':splittedLink[4],
    'type':splittedLink[5],
    'appId':splittedLink[6],
    'remoteId':splittedLink[7]
  };
  // Si l'url d'un des liens est mal construite.
  if (splittedLink[4] == '' || splittedLink[5] == '' || splittedLink[6] == '' || splittedLink[7] == '') {
    // On cache le lien et son container.
    myObj.recolinksContainer[linkType][key].style.display = 'none';
    myObj.recolinks[linkType][key].style.display = 'none';
  }
  else {
    // Sinon on  Enregistre des requetes a effectuer ou deja en cours.
    // Si premiere requete sur ce type d'action.
    var actionType = myObj.recolinksInfos[linkType][key].action +'_'+ myObj.recolinksInfos[linkType][key].type;
    var action;
    switch(actionType) {
      case 'recommander_article':
        action = 'recommander_node';
        break;
      case 'recommander_commentaire':
        action = 'recommander_comment';
        break;
      case 'recommander_status':
        action = 'recommander_fb';
        break;
      case  'follow_membre':
      case 'unfollow_membre':
        action = 'suivre_membre';
        break;
    }

    if (!myObj.recogetInfos[action]) {
      // Ajout du tableau qui contiendra les futurs appid.
      myObj.recogetInfos[action] = [];
    }
    // Si premiere requete sur cette appid.
    if (!myObj.recogetInfos[action][myObj.recolinksInfos[linkType][key].appId]) {
      // Ajout du tableau qui contiendra les futures requetes.
      myObj.recogetInfos[action][myObj.recolinksInfos[linkType][key].appId] = [];
    }

    // Si le tableau qui contient les requetes ne detient pas deja une entree correspondant
    // aux appid et remote id demandes par le lien en cours.
    if (!myObj.recogetInfos[action][myObj.recolinksInfos[linkType][key].appId][myObj.recolinksInfos[linkType][key].remoteId]) {
      // On cree l'entree pour la requete afin d'eviter de faire plusieurs fois la meme requete.
      myObj.recogetInfos[action][myObj.recolinksInfos[linkType][key].appId][myObj.recolinksInfos[linkType][key].remoteId] = 'pending';
      // Et on contruit l'objet de la requete.
      var urlGetInfo = link.href.replace(myObj.recolinksInfos[linkType][key].type+'/', myObj.recolinksInfos[linkType][key].type+'/infos/');
      var scriptPath = urlGetInfo.replace('unfollow', 'follow');

      // Puis on le stock dans un tableau pour toutes les lancer en meme temps
      // Et etre sûre de ne pas laisser de lien non associe a une requete.
      myObj.recoqueries[myObj.recoqueries.length] = {'type':'script', 'attributes': {'type':'text/javascript', 'src':scriptPath}};
    }
  }
};

/**
 * Recuperation des infos de selection.
 *
 * @param key
 * @param linkType
 * @param link
 */
fpauthentificator.prototype.linksGetInfosselectionner = function (key, linkType, link) {
  // Ressort de l'utilisation de la fonction eval().
  var myObj = window.fpAuth;
  var action = 'selectionner';
  myObj.recolinksInfos[linkType][key] = {
    'action':action,
    'appId':myObj.passport.appId,
    'contentId':link.parentNode.getAttribute('data-cid')
  };

  if (!myObj.recogetInfos[action]) {
    // Ajout du tableau qui contiendra les futurs appid.
    myObj.recogetInfos[action] = [];
  }
  // Si premiere requete sur cette appid.
  if (!myObj.recogetInfos[action][myObj.recolinksInfos[linkType][key].appId]) {
    // Ajout du tableau qui contiendra les futures requetes.
    myObj.recogetInfos[action][myObj.recolinksInfos[linkType][key].appId] = [];
  }

  // Si l'url d'un des liens est mal construite.
  // Si le tableau qui contiend les requetes ne detiend pas deja une entree correspondante.
  // aux appid et remote id demandes par le lien en cours
  if (!myObj.recogetInfos[action][myObj.passport.appId][myObj.recolinksInfos[linkType][key].contentId]) {
    // On cree l'entree pour la requete afin d'eviter de faire plusieurs fois la meme requete.
    myObj.recogetInfos[action][myObj.passport.appId][myObj.recolinksInfos[linkType][key].contentId] = 'pending';
    // Et on contruit l'objet de la requete.
    var urlGetInfo = link.href;
    urlGetInfo = urlGetInfo.replace('select_comment','check_selected_comment');
    urlGetInfo = urlGetInfo.replace('fpComActionsJsCallBack','getLinksInfosJsonpCallBack');

    // Puis on le stock dans un tableau pour toutes les lancer en meme temps
    // Et etre sur de ne pas laisser de lien non associe a une requete.
    myObj.recoqueries[myObj.recoqueries.length] = {'type':'script', 'attributes': {'type':'text/javascript', 'src':urlGetInfo}};
  }
};

/**
 * Preparation des requetes de suivretag a traiter au chargement de la page.
 */
fpauthentificator.prototype.linksGetInfossuivretag = function (key, linkType, link) {
  // Ressort de l'utilisation de la fonction eval().
  var myObj = window.fpAuth;
  var term = link.parentNode.getAttribute('data-term');

  myObj.recolinksInfos[linkType][term] = {
    'action':linkType,
    'appId':myObj.passport.appId,
    'term':term
  };

  if (!myObj.recogetInfos[linkType]) {
    // Ajout du tableau qui contiendra les futurs appid
    myObj.recogetInfos[linkType] = [];
  }

  // On ajoute l'entree pour la requete si ce n'est deja fait.
  if (!myObj.recogetInfos[linkType][term]) {
    myObj.recogetInfos[linkType][term] = 'pending';
    // Transformation de lurl de suivre tag et url de get_info.
    // Url pour recuperer les infos des suivre tag au chargement de la page.
    // fpservice/follow/tag/infos
    var urlGetInfo = link.href.replace('tag/', 'tag/infos/');
    urlGetInfo = urlGetInfo.replace('unfollow', 'follow');

    // Puis on le stock dans un tableau pour toutes les lancer en meme temps
    // Et eter sur de ne pas laisser de lien non asscie a une requete.
    myObj.recoqueries[myObj.recoqueries.length] = {'type':'script', 'attributes': {'type':'text/javascript', 'src':urlGetInfo}};
  }
};

/**
 * Fonction de verification de l'existance d'un utilisateur cote premium.
 *
 * @param key
 *   Cle incrementale de l'element en cours de traitement.
 * @param linkType
 *   Type de lien en cours de traitement.
 */
fpauthentificator.prototype.linksCheckIfUserExists = function(key, linkType) {
  var myObj = this;
  // Le traitement suivant n'interresse que les bouton suivre.
  // Et ne dois pas etre fait si execute depuis plus.lefigaro.fr.
  // (on se fait confiance pour ne pas positionner le bouton suivre sur des utilisateurs inexistants).
  // var possibleHost = new RegExp('plus|premium\.[azAZ_]*lefigaro.fr');
  if (linkType != 'suivre' || document.location.host.match('plus.lefigaro.fr')) {
    // Interrompt l'exectuion de la fonction.
    return false;
  }

  // Recuperation des infos a envoyer a user graph.
  var appId = myObj.recolinksContainer[linkType][key].getAttribute("data-appid");
  var remoteId = myObj.recolinksContainer[linkType][key].getAttribute("data-uid");
  var userGraphUrl = myObj.premiumHost + '/fpservice/user_graph?appid=' + appId + '&remote_id=' + remoteId + '&jsonp_callback=window.fpAuth.linksCheckIfUserExistsCallback';

  // Envoie de la requete a userGraphe.
  // Puis on le stock dans un tableau pour toutes les lancer en meme temps
  // Et eter sur de ne pas laisser de lien non asscie a une requete.
  myObj.recoqueries[myObj.recoqueries.length] = {'type':'script', 'attributes': {'type':'text/javascript', 'src':userGraphUrl}};
};

/**
 * Fonction callback de l'appel jsonp de verification existance utilisateur.
 *
 * @param result
 *   Resultat de la requete jsonp.
 */
fpauthentificator.prototype.linksCheckIfUserExistsCallback = function(result) {
  var myObj = this;
  if (!result.status) {
    var appId, remoteId;
    for (var key in myObj.recolinksContainer['suivre']) {
      appId = myObj.recolinksContainer['suivre'][key].getAttribute("data-appid");
      remoteId = myObj.recolinksContainer['suivre'][key].getAttribute("data-uid");
      if (result.appid == appId && result.remote_id == remoteId) {
        myObj.recolinksContainer['suivre'][key].style.display = 'none';
        if (typeof console != 'undefined' && typeof console.log != 'undefined') {
          console.log('FpAuth Error :: Pas de correspondance trouve avec cet utilisateur cote premium :: ['+ appId +']['+ remoteId +']');
        }
      }
    }
  }
};

/**
 * Recupere les donnees json et enclenche les mises a jours des liens si necessaire.
 */
var recommanderLinksInfosCallBack = function(action, data){
  var myObj = window.fpAuth;
  var actionFunctionName;
  var typeLink;

  if (!data) {
    return;
  }

  // Selon le type d'action
  // on definit un type de lien reconnu par l'objet.
  switch(action){
    case 'suivre_membre':
      typeLink ='suivre';
    break;

    case 'suivre_tag':
      typeLink = 'suivretag';
      // Exception pour suivre un tag.
      // Mise en memoire des donnees recuperees.
      for (var tagkey in data) {
        if (tagkey) {
          var termkey = tagkey;
          break;
        }
      }
      // La cle des datas est unique et c'est le term name.
      myObj.recogetInfos[typeLink][termkey] = data;
      // On ajoute les donnee dans le tableau correspondant.
      myObj.recolinksDatas[typeLink][termkey] = data;

      // Fonction de repercution rapport aux datas.
      actionFunctionName = typeLink+'UpdateActions';
      eval(actionFunctionName)(termkey, data);
      return;

    default:
      typeLink ='recommander';
    break;
  }
  // Recuperation des app id et remote id.
  var appId, remoteId;
  for (var key in data) {
    appId = key;
    for(var k in data[key]) {
      remoteId = k;
    }
  }

  // Mise en memoire des donnees recuperees.
  if (appId && remoteId) {
    myObj.recogetInfos[action][appId][remoteId] = data ? data : 0;
  }

  // Pour tous les liens de la page
  for (var linkKey in myObj.recolinksInfos[typeLink]) {
    // Si la requete concerne un bouton suivre, on le laisse passer.
    // Sinon on verifie que les composantes des liens connus correspondent a la requete que l'on reçoit.
    if (
      typeLink == 'suivre' ||
        (
          myObj.recolinksInfos[typeLink][linkKey].action == typeLink
          && myObj.recolinksInfos[typeLink][linkKey].appId == appId
          && myObj.recolinksInfos[typeLink][linkKey].remoteId == remoteId
        )
    ) {
      // On ajoute les donnee dans le tableau correspondant.
      myObj.recolinksDatas[typeLink][linkKey] = data;
      // Fonction de repercution rapport aux datas.
      actionFunctionName = typeLink+'UpdateActions';
      eval(actionFunctionName)(typeLink, linkKey);
    }
  }
};

/**
 * Recupere les donnees json et enclenche les mises a jours des liens si necessaire.
 */
var getLinksInfosJsonpCallBack = function(result) {
  var myObj = window.fpAuth;
  var appId = myObj.passport.appId;
  var type = result.data.type;
  var contentId = result.data.content_id;
  myObj.recogetInfos[type][appId][contentId] = true;

  for (var linkKey in myObj.recolinksInfos[type]) {
    // Si la requete concerne un bouton suivre, on le laisse passer.
    // Sinon on verifie que les composantes des liens connus correspondent a la requete que l'on reçoit.
    if (
          myObj.recolinksInfos[type][linkKey].action == type &&
          myObj.recolinksInfos[type][linkKey].appId == appId &&
          myObj.recolinksInfos[type][linkKey].contentId == contentId
       ) {
      // On ajoute les donnee dans le tableau correspondant.
      myObj.recolinksDatas[type][linkKey] = result.data;
      // Fonction de repercution rapport aux datas.
      var actionFunctionName = type+'UpdateActions';
      if (typeof eval(actionFunctionName) == 'function') {
        eval(actionFunctionName)(type, linkKey, result);
      }
    }
  }
};

/**
 * Actions de mise a jours des liens recommander.
 */
var recommanderUpdateActions = function(typeLink, linkKey) {
  var myObj = window.fpAuth;
  // Si on a des datas pour le liens en cours
  if (typeof myObj.recolinksInfos[typeLink][linkKey] != 'undefined') {
    // Arrive dans le cas ou on ne match pas le stub cote premium.
    var data = myObj.recolinksDatas[typeLink][linkKey][myObj.recolinksInfos[typeLink][linkKey].appId][myObj.recolinksInfos[typeLink][linkKey].remoteId];
    if (typeof data == 'undefined') {
      myObj.recolinks[typeLink][linkKey].style.display = 'none';
    }
    else {
      if (data && myObj.recolinksInfos[typeLink][linkKey].remoteId != null && data['count'] != 0) {
        // Nombre de flag sur le Lien a mettre a jour.
        recommanderUpdateLink(linkKey, typeLink, data['count']);
        // Si l'utilisateur est loggue.
        if (fpAuth.user) {
          // On recupere la liste des utilisateur qui ont flague le lien
          var usersList = data['users'];
          // Et on verifie si le visiteur a deja flague le lien
          var flaggedByUser = false;
          for(var i = 0;i<usersList.length;i++) {
            if (usersList[i] == fpAuth.user.uid.toString()) {
              flaggedByUser = true;
            }
          }
          // Si l'utilisateur a deja flague le lien
          if (flaggedByUser == true) {
            // On change la classse et le texte du lien
            myObj.recolinks[typeLink][linkKey].className += ' flagged';
            myObj.recolinks[typeLink][linkKey].innerHTML = '<span></span>Recommand&eacute;';
          }
        }
      }
    }
  }
};

/**
 * Actions de mise a jours des liens selectionner au chargement de la page.
 */
var selectionnerUpdateActions = function(linkType, linkKey, result) {
  var myObj = window.fpAuth;
  if (result.data.status) {
    // Ajout de la class css au lien.
    myObj.recolinksContainer[linkType][linkKey].className += ' flagged';
    // Changement du texte dans le lien.
    myObj.recolinksContainer[linkType][linkKey].removeChild(myObj.recolinks[linkType][linkKey]);
    myObj.recolinksContainer[linkType][linkKey].innerHTML = 'Sélectionné';
  }
};

/**
 * Actions de mise a jours des liens suivre.
 */
var suivreUpdateActions = function(typeLink, linkKey){
  var myObj = window.fpAuth;
  // Si on a bien des infos disponibles pour ce lien
  if (myObj.recolinksDatas[typeLink][linkKey] != '' && fpAuth.user.uid != null) {
    // On recupere l'appid
    var appId = myObj.recolinksInfos[typeLink][linkKey].appId;
    // le remoteId
    var remoteId = myObj.recolinksInfos[typeLink][linkKey].remoteId;
    // le uid de l'utilisateur
    var uid = fpAuth.user.uid.toString();
    // SI on a bien un relation entre les 2 utilisateurs ( le visiteur et le visite)
    if (myObj.recolinksDatas[typeLink][linkKey][appId][uid] != null
        && myObj.recolinksDatas[typeLink][linkKey][appId][uid][remoteId] != null
        && myObj.recolinksDatas[typeLink][linkKey][appId][uid][remoteId]['follow_statement'] != null) {
      // On met a jour le lien suivre selon leur relation
      suivreSubmittedCallBack(linkKey, typeLink, myObj.recolinksDatas[typeLink][linkKey][appId][uid][remoteId]['follow_statement'], false);
    }
  }
};

/**
 * Mise a jour du lien suivre un tag au chargement de la page.
 */
var suivretagUpdateActions = function(termName, data) {
  var myObj = window.fpAuth;
  var suivre = false;

  // Recuperation de tous les liens "suivre un tag".
  var recoLinks = myObj.recolinks['suivretag'];

  // Gestion des erreurs.
  for (var key in recoLinks) {
    var link = recoLinks[key];

    // Test sur le term a traiter.
    // On le trouve en attribut sur la balise parente.
    if (termName == link.parentNode.getAttribute('data-term')) {
      // Terme inconnu, on cache le bouton.
      if (data[termName].error == 'unknown_term') {
        myObj.recolinksContainer['suivretag'][key].style.display = 'none';
        if (typeof console != 'undefined' && typeof console.log != 'undefined') {
          console.log("ERROR : Tag " + termName + " inconnu.");
        }
        return;
      }
      // Probleme de chargement du tag.
      // On envoie un message d'erreur.
      if (data[termName].error == 'flag_error') {
        if (typeof console != 'undefined' && typeof console.log != 'undefined') {
          console.log("ERROR : Probleme au chargement du tag " + termName + ".");
        }
        return;
      }
    }
  }

  for (var key in data[termName].users) {
    if (data[termName].users[key] == myObj.user.uid) {
      suivre = true;
      break;
    }
  }

  // Si le user suit deja le tag
  if (suivre) {
    // Pour chaque lien, on test si on doit faire des modifications.
    for (var key in recoLinks) {
      var link = recoLinks[key];

      // Test sur le term a traiter.
      // On le trouve en attribut sur la balise parente.
      if (termName == link.parentNode.getAttribute('data-term')) {
        // On change le titre du bouton.
        link.innerHTML = 'Abonné(e)';

        // Modification du lien pour se desabonner.
        link.href = link.href.replace('follow', 'unfollow');

        // Ajout du rollover de desincription.
        // Changement du texte dans le title (Pour roll-over).
        link.className = 'fpApp-follow-abonne';
        var parents = link.parentNode;
        parents.className += ' fpApp-follow-abonne';

        // Message de rollover.
        link.title = 'Ne plus suivre';

        // Attribution du comportement au roll-over sur le bouton suivre un tag.
        link.parentNode.onmouseover = function() {
          followLinkMouseOver(this);
        };
        link.parentNode.onmouseout = function() {
          followLinkMouseOver(this);
        };
      }
    }
  }
};

/**
 * Met a jour le nombre de flag pour un lien.
 */
var recommanderUpdateLink = function(linkKey, typeLink, count) {
  var myObj = window.fpAuth;
  // Recuperation span contenant le compte de recommander
  var countSpan = myObj.recolinksContainer[typeLink][linkKey].getElementsByTagName('span')[1];
  // Si il n'existe pas on le cree
  if (countSpan == null) {
    countSpan = document.createElement('span');
    countSpan.className = myObj.recorecommanderLinksCountClassName;
    myObj.recolinksContainer[typeLink][linkKey].appendChild(countSpan);
  }
  // Puis on cree un element pour html Textnode qui contiendra le resultat de la requete d'info
  countText  = document.createTextNode(count);
  // Et on l'ajoute en vidant le container au prealable
  countSpan.innerHTML = '';
  countSpan.appendChild(countText);
};

/**
 * Mise a jour des liens apres envoie du vote.
 */
var fpComActionsJsCallBack = function(result) {
  var myObj = window.fpAuth;

  // Si desynchro cookie et session drupal.
  if (result == 'unlogged') {
    var path = fpAuth.buildParcoursPath(myObj.recolinks[myObj.recocurrentOperationType][myObj.recocurrentOperationKey], 'recommander', 'fpApp.userConnexionCallBack', true);
    fpAuth.openUserLoginCourse(path['main'] + path['goto'], path['main'] + path['baseUrl']);
  }
  else {
    var functionName ='';
    // Si deja flaggue.
    // Specifique au bouton Recommander.
    if (result == 'ever_flagged' && myObj.recocurrentOperationType == 'recommander') {
        functionName = myObj.recocurrentOperationType+'OpendfpShareDialog';
        eval(functionName)(myObj.recolinks[myObj.recocurrentOperationType][myObj.recocurrentOperationKey]);
    }
    else {
      functionName = myObj.recocurrentOperationType+'SubmittedCallBack';
      eval(functionName)(myObj.recocurrentOperationKey, myObj.recocurrentOperationType, result, true);
    }
    // Mise a jours des infos de l'utilisateur.
    fpAuth.checkUserCookie();
  }
};

/**
 * Actions de callback apres envois d'une action de recommandation.
 */
var recommanderSubmittedCallBack = function(currentOperationKey, typeLink, result, click){
  var myObj = window.fpAuth;
  switch (result) {
    case 'unknow_article':
    case 'flag_error':
      // Mise a jour du lien en mode erreur.
      recommanderUpdateLink(currentOperationKey, typeLink, 'null');
      // En cas d'erreur on desactive le lien.
      myObj.recolinks[typeLink][currentOperationKey].innerHTML = 'Erreur';
      break;

    default :
      if (parseInt(result) > 0) {
        // Mise a jour du total de flags dans le lien.
        recommanderUpdateLink(currentOperationKey, typeLink, result);
        // Ajout de la class css au lien.
        myObj.recolinks[typeLink][currentOperationKey].className += ' flagged';
        // Changement du texte dans le lien.
        myObj.recolinks[typeLink][currentOperationKey].innerHTML = '<span></span>Recommand&eacute;';
      }
      break;
  }
};

/**
 * Actions de callback apres envois d'une action 'Selectionner'.
 */
var selectionnerSubmittedCallBack = function(linkKey, linkType, result, click) {
  var myObj = window.fpAuth;
  // Mise a jour de l'etat du lien.
  switch (result.data.status) {
    case 1:
      // Ajout de la class css au lien.
      myObj.recolinksContainer[linkType][linkKey].className += ' flagged';
      // Changement du texte dans le lien.
      myObj.recolinksContainer[linkType][linkKey].removeChild(myObj.recolinks[linkType][linkKey]);
      myObj.recolinksContainer[linkType][linkKey].innerHTML = 'Sélectionné';
      break;

    case -1:
      for (containerKey in myObj.recolinksContainer[linkType]) {
        myObj.recolinksContainer[linkType][containerKey].parentNode.removeChild(myObj.recolinksContainer[linkType][containerKey]);
      }
      mObj.checkUserCookie();
      break;
  }
};

/**
 * Actions de callback apres envois d'une action de suivis.
 */
var suivreSubmittedCallBack = function(currentOperationKey, typeLink, result, click){
  var myObj = window.fpAuth;

  // Si je suis dans une action de clique
  // et que le compte consulte est prive.
  if (click == true) {
    if (
      typeof Drupal != 'undefined' &&
      typeof Drupal.settings != 'undefined' &&
      typeof Drupal.settings.fpcomactions != 'undefined' &&
      typeof Drupal.settings.fpcomactions.account_privacy != 'undefined' &&
      Drupal.settings.fpcomactions.account_privacy == 1
    ) {
      // Reload de la page.
      window.location.reload();
    }
  }
  // Reset les action au survole des boutons "suivre".
  myObj.recolinks[typeLink][currentOperationKey].parentNode.onmouseover = null;
  myObj.recolinks[typeLink][currentOperationKey].parentNode.onmouseout = null;
  // Variables utilisees.
  var linkText, linkTitle, linkHrefPattern, linkHrefReplacement, className;
  // Selon le resultat de la requete
  // Et selon le status de relation renvoye
  // On definit le texte du bouton  et la classe du bouton
  switch(result) {
    case 'RELATION_APROVED':
      linkText = 'Abonné(e)';
      linkTitle = 'Ne plus suivre';
      className = 'fpApp-follow-abonne';
      if (!myObj.recolinks[typeLink][currentOperationKey].href.match('unfollow')) {
        linkHrefPattern = 'follow';
        linkHrefReplacement = 'unfollow';
      }
    break;
    case 'RELATION_WAITING':
      linkText = 'En attente';
      linkTitle = 'Annuler';
      className = 'fpApp-follow-abonne';
      if (!myObj.recolinks[typeLink][currentOperationKey].href.match('unfollow')) {
        linkHrefPattern = 'follow';
        linkHrefReplacement = 'unfollow';
      }
      break;
    case 'RELATION_DELETE':
      linkText = 'Suivre';
      linkTitle = 'Suivre';
      className = 'fpApp-follow-follow';
      if (myObj.recolinks[typeLink][currentOperationKey].href.match('unfollow')) {
        linkHrefPattern = 'unfollow';
        linkHrefReplacement = 'follow';
      }
      break;
    case 'RELATION_REJECT':
    case 'ERROR':
      linkText = 'Erreur';
      className = 'fpApp-follow-follow';
      window.location.reload();
      break;
  }
  if (linkText != '') {
    // Changement du texte dans le lien.
    myObj.recolinks[typeLink][currentOperationKey].innerHTML = linkText;
  }
  if (linkTitle != '') {
    // Changement du texte dans le title (Pour roll-over).
    myObj.recolinks[typeLink][currentOperationKey].title = linkTitle;
  }
  if (className != '') {
    // Changement du texte dans le title (Pour roll-over).
    myObj.recolinks[typeLink][currentOperationKey].className = className;
    var parents = myObj.recolinks[typeLink][currentOperationKey].parentNode;
    // Reset les classes du container.
    parents.className.replace(' fpApp-follow-abonne', '');
    parents.className.replace(' fpApp-follow-unfollow', '');
    // Attribution de la nouvelle classe.
    parents.className += ' ' + className;
  }
  if (linkHrefPattern != linkHrefReplacement) {
    // changement du href du lien.
    myObj.recolinks[typeLink][currentOperationKey].href = myObj.recolinks[typeLink][currentOperationKey].href.replace(linkHrefPattern, linkHrefReplacement);
  }
  // Attribution du comportement au roll-over sur le bouton suivre
  myObj.recolinks[typeLink][currentOperationKey].parentNode.onmouseover = function(){
    followLinkMouseOver(this);
  };
  myObj.recolinks[typeLink][currentOperationKey].parentNode.onmouseout = function(){
    followLinkMouseOver(this);
  };
};

/**
 * Action de callback pour le bouton suivre un tag.
 */
var suivretagSubmittedCallBack = function(currentOperationKey, typeLink, result, click){
  var myObj = window.fpAuth;

  // Reset les actions au survole des boutons suivre.
  myObj.recolinks[typeLink][currentOperationKey].parentNode.onmouseover = null;
  myObj.recolinks[typeLink][currentOperationKey].parentNode.onmouseout = null;

  // Recuperation du term en cours pour les messages d'erreur.
  var term = myObj.recolinks[typeLink][currentOperationKey].parentNode.getAttribute('data-term');

  // Variables utilisees.
  var linkText, linkTitle, linkHrefPattern, linkHrefReplacement, className;
  // Selon le resultat de la requete et le status de relation renvoye
  // On definit le texte, la classe du bouton ainsi que les messages d'erreur.
  switch(result) {
    case 'FOLLOW':
    case 'ever_flagged':
      linkText = 'Abonné(e)';
      linkTitle = 'Ne plus suivre';
      className = 'fpApp-follow-abonne';
      if (!myObj.recolinks[typeLink][currentOperationKey].href.match('unfollow')) {
        linkHrefPattern = 'follow';
        linkHrefReplacement = 'unfollow';
      }
      break;

    case 'UNFOLLOW':
      linkText = 'Suivre';
      linkTitle = 'Suivre';
      className = 'fpApp-follow-follow';
      if (myObj.recolinks[typeLink][currentOperationKey].href.match('unfollow')) {
        linkHrefPattern = 'unfollow';
        linkHrefReplacement = 'follow';
      }
      break;

    case 'unknown_term':
      // Suppression du bouton + message d'erreur.
      myObj.recolinksContainer[typeLink][currentOperationKey].style.display = 'none';
      if (typeof console != 'undefined' && typeof console.log != 'undefined') {
        console.log("ERROR : Tag " + term +" inconnu.");
      }
      return;

    case 'anonymous_user':
      // User non loggue, ne devrait jamais arriver!!!
      if (typeof console != 'undefined' && typeof console.log != 'undefined') {
        console.log("ERROR : l'utilisateur n'est pas loggue.");
      }
      return;

    case 'ERROR':
    case 'flag_error':
      // On ne fait rien c'est juste une erreur de traitement.
      if (typeof console != 'undefined' && typeof console.log != 'undefined') {
        console.log("ERROR : Erreur lors du traitement de recuperation du tag " + term + ".");
      }
      return;
  }
  if (linkText != '') {
    // Changement du texte dans le lien.
    myObj.recolinks[typeLink][currentOperationKey].innerHTML = linkText;
  }
  if (linkTitle != '') {
    // Changement du texte dans le title (Pour roll-over).
    myObj.recolinks[typeLink][currentOperationKey].title = linkTitle;
  }
  if (className != '') {
    // Changement du texte dans le title (Pour roll-over).
    myObj.recolinks[typeLink][currentOperationKey].className = className;
    var parents = myObj.recolinks[typeLink][currentOperationKey].parentNode;
    // Reset les classes du container.
    parents.className.replace(' fpApp-follow-abonne', '');
    parents.className.replace(' fpApp-follow-unfollow', '');
    // Attribution de la nouvelle classe.
    parents.className += ' ' + className;
  }

  if (linkHrefPattern != linkHrefReplacement) {
    // changement du href du lien.
    myObj.recolinks[typeLink][currentOperationKey].href = myObj.recolinks[typeLink][currentOperationKey].href.replace(linkHrefPattern, linkHrefReplacement);
  }

  // Attribution du comportement au roll-over sur le bouton suivre
  myObj.recolinks[typeLink][currentOperationKey].parentNode.onmouseout = function() {
    myObj.recolinks[typeLink][currentOperationKey].parentNode.onmouseover = function() {
      followLinkMouseOver(this);
    };
    myObj.recolinks[typeLink][currentOperationKey].parentNode.onmouseout = function() {
      followLinkMouseOver(this);
    };
  };
};

/**
 * Creation de la fenetre de dialogue de partage.
 * Quand l'utilisateur a deja flaggue.
 */
var recommanderOpendfpShareDialog = function(curentLink){

  var shareDialogExists = false;
  var divs = curentLink.parentNode.getElementsByTagName('div');
  for(var i = 0; i < divs.length; i++) {
    if (divs[i].className.match('fp-share-dialog-block')){
      shareDialogExists = true;
      divs[i].style.display = 'block';
    }
  }
  if (!shareDialogExists) {
    // Container pour share dialog.
    var div = document.createElement('div');
    div.className = 'fp-share-dialog-block';
    // Text pour share dialog.
    var text = '<p><strong>Vous avez d&eacute;j&agrave; recommand&eacute; ce contenu.</strong><br />';
    text += 'Vous pouvez &eacute;galement le partager sur Facebook ou Twitter.</p>';
    div.innerHTML = text;

    // Bouton de fermeture.
    var span = document.createElement('span');
    span.innerHTML = 'X';

    div.appendChild(span);
    curentLink.parentNode.appendChild(div);
    span.onclick = function() {
      closefpShareDialog(div, 'click');
    }
  }
};

/**
 * Fermeture de la fenetre de partage.
 */
var closefpShareDialog = function(shareBlock) {
  shareBlock.style.display = 'none';
};

/*********************** Tools ***************************/

/**
 * Fonction de rafraîchissement de page, redefinissable par un tier.
 * avant ou après la définition de celle-ci.
 */
if (typeof refresh_parent_page == 'undefined') {
  var refresh_parent_page = function() {
    var path = document.location.href.replace(document.location.hash, '');
    if (path.match('fp_callback=window.parent.refresh_parent_page()')) {
      // Ancien system de rafraîchissement de page.
      path = path.replace('fp_callback=window.parent.refresh_parent_page()', '');
    }
    window.parent.document.location.href = path;
  };
}

/*********************** Addons ***************************/

/**
 * fonction de ping vers fidji.
 */
fpauthentificator.prototype.pingFidji = function () {
  var myObj = this;
  if (myObj.premiumHost.match(myObj.defaultPremiumHost)) {
    var metas = document.getElementsByTagName('meta');
    for (var key in metas) {
      var meta = metas[key];
      if (typeof meta.getAttribute != 'undefined' && meta.getAttribute('property') == 'og:url') {
        // Recupere l'url depuis le meta og:url.
        // Si il existe bien cree un script src pour lancer le ping.
        // Envoi du ping avec un script src avec l'url de l'article en parametre.
        var pingUrl = meta.getAttribute('content') ? 'http://api.fidji.lefigaro.fr/ping/?url=' + meta.getAttribute('content') : '';
        if (pingUrl) {
          var scriptDomObj = {
            'type' : 'script',
            'attributes' : {'type' : 'text/javascript','src' : pingUrl}
          };
          myObj.insertDomElement(scriptDomObj);
        }
        break;
      }
    }
  }
};

(function(){
  if (typeof window.fpAuth == 'undefined') {
    window.fpAuth = new fpauthentificator();
  }
})();
