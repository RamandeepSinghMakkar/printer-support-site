# Google Apps Script Email Setup

To make the HTML form send an email directly to `ramandeep15372@gmail.com` for free, follow these steps:

## 1. Create the Script
1. Go to [script.google.com](https://script.google.com/) and sign in with your Google account.
2. Click **New Project**.
3. Name it something like "Printer Form Handler".
4. Delete any existing code in the `Code.gs` file and paste the following code:

```javascript
function doPost(e) {
  try {
    // Replace this with your email
    var adminEmail = "ramandeep15372@gmail.com"; 
    
    // Parse the data from the form
    var fullName = e.parameter.fullName;
    var printerModel = e.parameter.printerModel;
    var email = e.parameter.email;
    var phone = e.parameter.phone;
    
    // Construct the email subject and body
    var subject = "New Printer Setup Request: " + fullName;
    var body = "A new user has submitted their details for printer setup.\n\n" +
               "Full Name: " + fullName + "\n" +
               "Printer Model: " + printerModel + "\n" +
               "Email: " + email + "\n" +
               "Phone: " + phone;
               
    // Send the email
    MailApp.sendEmail(adminEmail, subject, body);
    
    // Return a success response
    return ContentService.createTextOutput(JSON.stringify({"result":"success"}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({"result":"error", "error": error}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## 2. Deploy as a Web App
1. Click the blue **Deploy** button in the top right corner.
2. Select **New deployment**.
3. Click the gear icon next to "Select type" and choose **Web app**.
4. Set the following options:
   - **Description**: Form Handler
   - **Execute as**: Me (your Google account)
   - **Who has access**: Anyone
5. Click **Deploy**. (You may be prompted to review permissions. Click "Review permissions", choose your account, click "Advanced", and "Go to Printer Form Handler (unsafe)" to allow it to send emails on your behalf).
6. Copy the **Web app URL** that is generated.

## 3. Connect to Your Website
1. Open the `script.js` file in your `garry` folder.
2. Find the commented section around line 24.
3. Uncomment the fetch code and replace `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL` with the URL you copied.

```javascript
    // Uncomment and use this code:
    const scriptURL = 'YOUR_ACTUAL_WEB_APP_URL_HERE';
    fetch(scriptURL, { method: 'POST', body: formData})
      .then(response => console.log('Success!', response))
      .catch(error => console.error('Error!', error.message));
```

That's it! When someone fills out the form, you will receive an email instantly.
