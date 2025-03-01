document.onreadystatechange = function() {
  if (document.readyState === 'interactive') renderApp();
  function renderApp() {
    let onInit = app.initialized();

    onInit.then(getClient).catch(handleErr);

    function getClient(_client) {
      window.client = _client;
      client.events.on('app.activated', onAppActivate);
    }
  }
};

function onAppActivate() {
  console.log( "Test" , window.location);
  let btn = document.querySelector('.btn-open');
  btn.addEventListener('click', openModal);
  // Start writing your code...
}

function openModal() {
  client.interface.trigger(
    'showModal',
    useTemplate('Title of the Modal', './views/modal.html')
  );
}

function useTemplate(title, template) {
  return {
    title,
    template
  };
}

function handleErr(err) {
  console.error(`Error occured. Details:`, err);
}

exports = {
  onContactCreateCallback: function(payload) {
    console.log("Logging arguments from onContactCreate event: " + JSON.stringify(payload));
    }
  }
async function getCurrentEntityInfo() {
  console.log("userInfo",data);
  try {
    const data = await client.data.get("currentEntityInfo");
    // success output for contact
    // data: { "currentEntityInfo": { "currentEntityId": 12, "currentEntityType": "contact"}}
    console.log("userInfo",data);
  } catch (error) {
    // failure operation
    console.error(error);
  }
}

getCurrentEntityInfo();

