let client;

init();

async function init() {
  client = await app.initialized();
  // client.events.on("app.activated", renderText);
  // client.events.on("cti.triggerDialer", handleDialerEvent);
  client.instance.resize({ height: "600px", width: "400px" });
}

// async function renderText() {}

// async function handleDialerEvent(event) {
//   console.log("CTI Event:", event);
//   const phoneNumber = event?.data?.number;

//   client.interface.trigger("show", { id: "softphone" });

//   const childFrame = document.getElementById("childFrame");
//   if (childFrame?.contentWindow && phoneNumber) {
//     childFrame.contentWindow.postMessage(
//       { type: "PARENT_PHONE_NUMBER", payload: phoneNumber },
//       "http://localhost:3001/"
//     );
//   }
// }
