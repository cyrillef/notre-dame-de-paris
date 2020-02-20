
var viewer, oDocument, oViews2D, oViews3D;

$(document).ready(function () {
  launchViewer();
});

function launchViewer() {
  var options = {
    env: 'AutodeskProduction',
    getAccessToken: getForgeToken,
  };

  Autodesk.Viewing.Initializer(options, () => {
    viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer'));
    viewer.start();

    getModelURN((urn, version) => {
        var documentId = 'urn:' + urn;
        Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
    });
    
  });
}


function loadModelInViewer(svfUrl, sharedPropertyDbPath) {
  viewer.tearDown();
  viewer.setUp(viewer.config);
  let modelOptions = {
    sharedPropertyDbPath: sharedPropertyDbPath
  };
  viewer.loadModel(svfUrl, modelOptions, (model) => {}, onDocumentLoadFailure);
}

function switchView(evt, role) {
  evt.stopPropagation();
  let views = role === '3d' ? oViews3D : oViews2D;

  let viewableID = evt.target.id.substring(5);

  let viewObj = oDocument.getRoot().search({
    'type': 'geometry',
    'role': role,
    'viewableID': viewableID
  }, true);
  if (viewObj.length == 0)
    return;
  let svfUrl = oDocument.getViewablePath(viewObj[0]);
  loadModelInViewer(svfUrl, viewObj[0].findPropertyDbPath());
}

function onDocumentLoadSuccess(doc) {
  oDocument =doc;
  var viewables = doc.getRoot().getDefaultGeometry();

  oViews3D = doc.getRoot().search({
    'type': 'geometry',
    'role': '3d'
  });
  for (let i = 0; oViews3D && i < oViews3D.length; i++) {
    let r = $('<div><button id="view_' + oViews3D[i].data.viewableID + '" data="' + oViews3D[i].data.guid + '">' + oViews3D[i].data.name + '</button></div>');
    $('#list3d').append(r);
    $('#view_' + oViews3D[i].data.viewableID).click(function (e) { switchView(e, '3d'); });
  }

  oViews2D = doc.getRoot().search({
    'type': 'geometry',
    'role': '2d'
  });
  for (let i = 0; oViews2D && i < oViews2D.length; i++) {
    let r = $('<div><button id="view_' + oViews2D[i].data.viewableID + '" data="' + oViews2D[i].data.guid + '">' + oViews2D[i].data.name + '</button></div>');
    $('#list2d').append(r);
    $('#view_' + oViews2D[i].data.viewableID).click(function (e) { switchView(e, '2d'); });
  }

  viewer.loadDocumentNode(doc, viewables).then(i => {
    // documented loaded, any action?
  });
}

function onDocumentLoadFailure(viewerErrorCode) {
  console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
}

function getForgeToken(callback) {
  fetch('/api/forge/oauth/token').then(res => {
    res.json().then(data => {
      callback(data.access_token, data.expires_in);
    });
  });
}

function getModelURN(callback) {
  fetch('/api/forge/oauth/urn').then(res => {
    res.json().then(data => {
      callback(data.urn, data.version);
    });
  });
}