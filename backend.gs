function doPost(e) {
  try {
    // Parse the incoming JSON data
    var data = JSON.parse(e.postData.contents);
    
    // Construct the email message
    var emailBody = "New Printer Setup Form Submission:\n\n" +
                    "Full Name: " + (data.fullName || "N/A") + "\n" +
                    "Printer Model: " + (data.printerModel || "N/A") + "\n" +
                    "Email: " + (data.email || "N/A") + "\n" +
                    "Phone: " + (data.phone || "N/A") + "\n";
                    
    // Send the email
    MailApp.sendEmail({
      to: "ramandeep15372@gmail.com",
      subject: "New Printer Setup Lead - " + (data.printerModel || "Printer"),
      body: emailBody
    });
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle CORS preflight requests
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}
