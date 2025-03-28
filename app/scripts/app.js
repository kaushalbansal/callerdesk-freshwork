document.onreadystatechange = function () {
  if (document.readyState === "interactive") renderApp();
};

function renderApp() {
  app
    .initialized()
    .then((client) => {
      window.client = client; // Store globally

      client.events.on("app.activated", onAppActivate);
      client.events.on("calling", eventCallback);

      // Resize instance
      client.instance.resize({ height: "600px", width: "400px" });

      // Fetch User Info
      getCurrentEntityInfo();
    })
    .catch(handleErr);
}

function onAppActivate() {
  console.log("App Activated - Checking for button...");

  waitForElement(".btn-open", function (btn) {
    btn.addEventListener("click", openModal);
    console.log("Button '.btn-open' found and event listener added!");
  });

  addHoverEventToPhoneNumbers();
}

// Add hover event for phone numbers
function addHoverEventToPhoneNumbers() {
  console.log("Checking for phone number elements...");

  const phoneElements = document.querySelectorAll('div[col-id="mobile_number"]');

  if (phoneElements.length === 0) {
    console.warn(" No phone number elements found. Waiting...");
    return;
  }

  phoneElements.forEach((div) => {
    div.addEventListener("mouseover", () => {
      const phoneNumberElement = div.querySelector('a[data-id="display-number"]');
      if (!phoneNumberElement) {
        console.warn("Phone number element not found inside:", div);
        return;
      }

      const phoneNumber = phoneNumberElement.textContent.trim();
      console.log("Hovered Phone Number:", phoneNumber);

      // Send message to parent window
      window.parent.postMessage({ action: "getPhoneNumber", phoneNumber }, "*");
    });
  });

  console.log("Hover events added.");
}

const observer = new MutationObserver(() => {
  addHoverEventToPhoneNumbers();
});
observer.observe(document.body, { childList: true, subtree: true });

setTimeout(addHoverEventToPhoneNumbers, 2000);

function waitForElement(selector, callback) {
  const element = document.querySelector(selector);
  if (element) {
    callback(element);
  } else {
    const observer = new MutationObserver((mutations, obs) => {
      const element = document.querySelector(selector);
      if (element) {
        callback(element);
        obs.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

function eventCallback(event) {
  const data = event?.helper?.getData();
  try {
  const childFrame = document.getElementById("childFrame");
      if (childFrame.contentWindow) {
          childFrame.contentWindow.postMessage(
              { type: "PARENT_PHONE_NUMBER", payload: data.phoneNumber },
              "https://iframe.callerdesk.io/" 
          );
      }
  } catch (error) {
    console.error("Error retrieving call data:", error);
  }
}


function openModal() {
  client.interface
    .trigger("showModal", useTemplate("Title of the Modal", "./views/modal.html"))
    .catch(handleErr);
}

function useTemplate(title, template) {
  return { title, template };
}

// Fetch user info safely
async function getCurrentEntityInfo() {
  try {
    const data = await client.data.get("currentEntityInfo");
    console.log("✅ User Info:", data);
  } catch (error) {
    console.error("❌ Error fetching user info:", error);
  }
}

// Generic error handler
function handleErr(err) {
  console.error("❌ Error occurred:", err);
}
