// ============================================================================
// AMOURA CRAFTS: ALL-IN-ONE GOOGLE APPS SCRIPT
// Supports:
// 1. Real Customer Reviews (Sheet 1)
// 2. Custom Products & Google Drive Image Hosting (Sheet 2: "Products")
// ============================================================================
// HOW TO INSTALL:
// 1. Open your Google Spreadsheet:
//    https://docs.google.com/spreadsheets/d/18AIyiyMLRQQ2WdJ1WtiUwAX8SQczsNGEgCp6cIDPoJo/edit
// 2. Click "Extensions" > "Apps Script".
// 3. Select all existing code, delete it, and paste this entire code.
// 4. Click "Deploy" > "Manage deployments" > Edit (pencil icon) > New Version > Deploy.
// ============================================================================

function doGet(e) {
  var params = e && e.parameter ? e.parameter : {};
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Fetch Products
  if (params.type === 'products') {
    var prodSheet = ss.getSheetByName("Products");
    if (!prodSheet) {
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var data = prodSheet.getDataRange().getValues();
    if (data.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var products = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0] && !row[1]) continue;
      products.push({
        id: String(row[0]),
        name: String(row[1]),
        price: Number(row[2]) || 0,
        mrp: Number(row[3]) || 0,
        category: String(row[4] || "candles"),
        desc: String(row[5] || ""),
        tag: String(row[6] || "New Arrival"),
        img: String(row[7] || ""),
        date: String(row[8] || "")
      });
    }
    return ContentService.createTextOutput(JSON.stringify(products))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // 2. Default: Fetch Reviews (Sheet 1)
  var sheet = ss.getSheets()[0];
  var data = sheet.getDataRange().getValues();
  var reviews = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0] && !row[1]) continue;
    reviews.push({
      id: "rev-" + i,
      name: row[0],
      rating: Number(row[1]) || 5,
      comment: row[2],
      date: row[3] || new Date().toISOString()
    });
  }
  return ContentService.createTextOutput(JSON.stringify(reviews))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var raw = e.postData.contents;
    var data = JSON.parse(raw);
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. Action: Add Product
    if (data.action === "addProduct") {
      var prodSheet = ss.getSheetByName("Products");
      if (!prodSheet) {
        prodSheet = ss.insertSheet("Products");
        prodSheet.appendRow(["ID", "Name", "Price", "MRP", "Category", "Description", "Tag", "ImageURL", "DateAdded"]);
      }

      var imgUrl = data.img || "";
      // If image is a Base64 string, upload it to Google Drive for lightning-fast public hosting
      if (imgUrl && imgUrl.indexOf("data:image") === 0) {
        try {
          var contentType = imgUrl.substring(5, imgUrl.indexOf(";"));
          var base64Data = imgUrl.substring(imgUrl.indexOf(",") + 1);
          var decoded = Utilities.base64Decode(base64Data);
          var blob = Utilities.newBlob(decoded, contentType, (data.name || "product") + "_" + Date.now() + ".jpg");
          var file = DriveApp.createFile(blob);
          file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          imgUrl = "https://lh3.googleusercontent.com/d/" + file.getId();
        } catch (driveErr) {
          // If DriveApp is not allowed, keep original URL/string
        }
      }

      var id = data.id || ("prod-" + Date.now());
      prodSheet.appendRow([
        id,
        data.name || "",
        Number(data.price) || 0,
        Number(data.mrp) || 0,
        data.category || "candles",
        data.desc || "",
        data.tag || "New Arrival",
        imgUrl,
        data.date || new Date().toISOString().split("T")[0]
      ]);

      return ContentService.createTextOutput(JSON.stringify({ success: true, id: id, img: imgUrl }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Action: Delete Product
    if (data.action === "deleteProduct") {
      var prodSheet = ss.getSheetByName("Products");
      if (prodSheet) {
        var vals = prodSheet.getDataRange().getValues();
        for (var i = 1; i < vals.length; i++) {
          if (String(vals[i][0]) === String(data.id)) {
            prodSheet.deleteRow(i + 1);
            break;
          }
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 3. Default Action: Add Customer Review (Sheet 1)
    var sheet = ss.getSheets()[0];
    sheet.appendRow([
      data.name,
      data.rating,
      data.comment,
      data.date || new Date().toISOString()
    ]);

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
