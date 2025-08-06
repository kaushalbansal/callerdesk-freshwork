(function () {
  document.onreadystatechange = function () {
    if (document.readyState === "interactive") renderApp();
  };

  function renderApp() {
    app
      .initialized()
      .then((client) => {
        window.client = client;

        client.events.on("app.activated", onAppActivate);
        client.events.on("calling", eventCallback);

        client.instance.resize({ height: "600px", width: "400px" });

        // Trigger onFormLoad after app is initialized
        // onFormLoad(client);
      })
      .catch((err) => {
        showNotification("error", "App failed to initialize. Please refresh.");
        console.error("App initialization failed:", err);
      });
  }

  function showNotification(type, message) {
    client.interface.trigger("showNotify", {
      type,
      message,
    });
  }

  function waitForElement(selector, callback, intervalTime = 100, timeout = 10000) {
    const startTime = Date.now();

    const interval = setInterval(() => {
      const element = document.querySelector(selector);

      if (element) {
        clearInterval(interval);
        callback(element);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(interval);
        console.warn(`Element '${selector}' not found within timeout`);
      }
    }, intervalTime);
  }

  function onAppActivate() {
    console.log("App Activated - Checking for button...");

    waitForElement(".btn-open", function (btn) {
      console.log("Button '.btn-open' found:", btn);
      btn.addEventListener("click", openModal);
    });
  }

  function eventCallback(event) {
    const data = event?.helper?.getData?.();
    const phoneNumber = data?.phoneNumber;
    const childFrame = document.getElementById("childFrame");

    if (childFrame?.contentWindow && phoneNumber) {
      childFrame.contentWindow.postMessage(
        { type: "PARENT_PHONE_NUMBER", payload: phoneNumber },
        "http://localhost:3000/"
      );
    }
  }

  function openModal() {
    client.interface
      .trigger("showModal", useTemplate("Title of the Modal", "./views/modal.html"))
      .catch(handleErr);
  }

  function useTemplate(title, templatePath) {
    return {
      title: title,
      template: templatePath,
    };
  }

  function handleErr(error) {
    console.error("Error:", error);
    showNotification("error", "Something went wrong.");
  }

  // function onFormLoad(client) {
  //   client.context
  //     .then((context) => {
  //       const product = context?.productContext?.name;

  //       if (product === "freshsales") {
  //         utils.set("Domain", { label: "Freshsales Domain" });
  //         utils.set("ApiKey", { label: "Freshsales API Key" });
  //         utils.set("Domain", { hint: "Enter the sub-domain of your Freshsales account" });
  //         utils.set("ApiKey", { hint: "Enter API key of your Freshsales account" });
  //         utils.set("FieldToDisplayInFCRM", { visible: false });
  //       } else if (product === "freshworks_crm") {
  //         utils.set("Domain", { label: "FCRM Domain" });
  //         utils.set("ApiKey", { label: "FCRM API Key" });
  //         utils.set("Domain", { hint: "Enter the sub-domain of your FCRM account" });
  //         utils.set("ApiKey", { hint: "Enter API key of your FCRM account" });
  //         utils.set("FieldToDisplayInFreshsales", { visible: false });
  //       } else {
  //         console.log("ERROR: Missing expected product from client context");
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("ERROR: Problem fetching product context from client", error);
  //     });
  // }
})();
