document.addEventListener('DOMContentLoaded', function() {
    app.initialized().then(function(_client) {
      window.client = _client;
      setupCallButtonListener();
    }).catch(console.error);
  });
  
  function setupCallButtonListener() {
    // Use MutationObserver to detect when call buttons are added to the DOM
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // Element node
            const callButtons = node.querySelectorAll('.content-call-button, [aria-label="Call"]');
            callButtons.forEach(function(button) {
              button.addEventListener('click', handleCallButtonClick);
            });
          }
        });
      });
    });
  
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  function handleCallButtonClick() {
    client.data.get('contact').then(function(data) {
      const contact = data.contact;
      console.log('Contact details:', contact);
      
      // Display in your FDK app
      displayContact(contact);
    }).catch(function(error) {
      console.error('Error fetching contact:', error);
      document.getElementById('contact-container').innerHTML = 
        '<p class="error">Error loading contact details</p>';
    });
  }
  
  function displayContact(contact) {
    const phoneNumber = contact.phone || contact.mobile_number || 'No phone number';
    const email = contact.email || 'No email';
    
    const contactHTML = `
      <div class="contact-card">
        <div class="contact-name">${contact.name || 'Unnamed Contact'}</div>
        <div class="contact-detail">Phone: ${phoneNumber}</div>
        <div class="contact-detail">Email: ${email}</div>
        <div class="contact-detail">Company: ${contact.company || 'No company'}</div>
        <div class="contact-detail">Called at: ${new Date().toLocaleString()}</div>
      </div>
    `;
    
    document.getElementById('contact-container').innerHTML = contactHTML;
  }