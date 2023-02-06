main();
function main(){


  app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;

  var myPDFFile = File.openDialog("Choose a PDF File");
  var spacing = getNumberFromUser();
  if((myPDFFile != "")&&(myPDFFile != null)){
    var myDocument, myPage;
    if(app.documents.length != 0){
      var myTemp = myChooseDocument();
      myDocument = myTemp[0];
      myNewDocument = myTemp[1];
    }
    else{
      myDocument = app.documents.add();
      myNewDocument = false;
    }
  
    if(myNewDocument == false){
      myPage = myChoosePage(myDocument);
    }
    else{
      myPage = myDocument.pages.item(0);
    }
    myPlacePDF(myDocument, myPage, myPDFFile,spacing);
  }
}
function myChooseDocument(){
    var myDocumentNames = new Array;
    myDocumentNames.push("New Document");
    //Get the names of the documents
    for(var myDocumentCounter = 0;myDocumentCounter < app.documents.length; myDocumentCounter++){
        myDocumentNames.push(app.documents.item(myDocumentCounter).name);
    }
    var myChooseDocumentDialog = app.dialogs.add({name:"Choose a Document", canCancel:false});
    with(myChooseDocumentDialog.dialogColumns.add()){
        with(dialogRows.add()){
            with(dialogColumns.add()){
                staticTexts.add({staticLabel:"Place PDF in:"});
            }
            with(dialogColumns.add()){
                var myChooseDocumentDropdown = dropdowns.add({stringList:myDocumentNames, selectedIndex:1});
            }
        }
    }
  var myResult = myChooseDocumentDialog.show();
  if(myResult == true){
    if(myChooseDocumentDropdown.selectedIndex == 0){
      myDocument = app.documents.add();
      myNewDocument = true;
    }
    else{
      myDocument = app.documents.item(myChooseDocumentDropdown.selectedIndex-1);
      myNewDocument = false;
    }
    myChooseDocumentDialog.destroy();
  }
  else{
    myDocument = "";
    myNewDocument = "";
    myChooseDocumentDialog.destroy();
  }
    return [myDocument, myNewDocument];
}
function myChoosePage(myDocument){
    var myPageNames = new Array;
    //Get the names of the pages in the document
    for(var myCounter = 0; myCounter < myDocument.pages.length;myCounter++){
        myPageNames.push(myDocument.pages.item(myCounter).name);
    }
    var myChoosePageDialog = app.dialogs.add({name:"Choose a Page", canCancel:false});
    with(myChoosePageDialog.dialogColumns.add()){
        with(dialogRows.add()){
            with(dialogColumns.add()){
                staticTexts.add({staticLabel:"Place PDF on:"});
            }
            with(dialogColumns.add()){
                var myChoosePageDropdown = dropdowns.add({stringList:myPageNames, selectedIndex:0});
            }
        }
    }
    myChoosePageDialog.show();
    var myPage = myDocument.pages.item(myChoosePageDropdown.selectedIndex);
    myChoosePageDialog.destroy();
    return myPage;
}
function myPlacePDF(myDocument, myPage, myPDFFile,spacing){
    var myPDFPage;
    app.pdfPlacePreferences.pdfCrop = PDFCrop.CROP_CONTENT_VISIBLE_LAYERS;
    var myCounter = 1;
    var offset = 0;
    var myBreak = false;
    while(myBreak == false){
        app.pdfPlacePreferences.pageNumber = myCounter;
        try{
            myPDFPage = myPage.place(File(myPDFFile), [0,offset])[0];
        }
        catch(error){
          
          myPage = myDocument.pages.add();
          offset = 0;
          myPDFPage = myPage.place(File(myPDFFile), [0,offset])[0];
        }

    // Check if page height exceeds page bounds
    if(myPDFPage.geometricBounds[3] > myPage.bounds[3]){
        myPage = myDocument.pages.add();
        offset = 0;
    }

    
    if(myCounter == 1){
        var myFirstPage = myPDFPage.pdfAttributes.pageNumber;
    }
    else{
        if(myPDFPage.pdfAttributes.pageNumber  == myFirstPage){
            myBreak = true;
        }
    }

    // Update offset for next page
    offset = spacing + offset + myPDFPage.geometricBounds[2] - myPDFPage.geometricBounds[0];
    myCounter = myCounter + 1;
}
}

function getNumberFromUser() {
    var myNumber;
    var myDialog = new Window("dialog", "Space between equations?");
    myDialog.add("statictext", undefined, "Space between equations?");
    var myEditText = myDialog.add("edittext", [0, 0, 200, 24], "0");
    myEditText.active = true;
    myDialog.add("button", undefined, "OK");
    myDialog.show();
    myNumber = parseInt(myEditText.text);
    return myNumber;
}
