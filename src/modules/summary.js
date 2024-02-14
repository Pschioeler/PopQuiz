//import possible other dependable modules
function displayAnswers(questionCount){
    //do some display magic here with each answered question
}

function generateDataForDownload(){
    //The content in this function must follow xlst file format
    var fileContent = `
        <data>
            <content>Hello, World!</content>
        </data>
    `; //this data should arrive from another function as an array
    return fileContent;
}

function getXSLTStylesheetToStyleDownloadedFile() {
    const filePath = "/src/downloadTemplate.xslt"; //modify this path if the xslt file is moved

    return fetch(filePath)  // Foretag HTTP-anmodning for at hente XSLT-filen
        .then(response => response.text())  // Konverter svaret til tekst
        .catch(error => {
            console.error('Fejl ved indlæsning af XSLT-filen:', error);
        });
}

function transformXMLToXSLFO(){
    const xmlData = generateDataForDownload();
    const xsltStylesheet = getXSLTStylesheetToStyleDownloadedFile();

    const xsltProcessor = new XSLTProcessor();
    const parser = new DOMParser();
    const xsltDocument = parser.parseFromString(xsltStylesheet, "text/xml");
    xsltProcessor.importStylesheet(xsltDocument);
    const xslFO = xsltProcessor.transformToFragment(parser.parseFromString(xmlData, "text/xml"), document);

    return xslFO;
}

function serializeXSLFOToString() {
    const xslFO = transformXMLToXSLFO();
    // Konverter XSL-FO til en streng
    const serializer = new XMLSerializer();
    const xslFOString = serializer.serializeToString(xslFO);
    
    // Returner XSL-FO-strengen
    return xslFOString;
}

function downloadResults(fileName){
    const fileContentAsXML = generateDataForDownload();

    const xsltStyleSheet = getXSLTStylesheetToStyleDownloadedFile();

    const xslFO = transformXMLToXSLFO();

    const xslFOString = serializeXSLFOToString();

    const file = new Blob([xslFOString], {type: "application/pdf"});
    const downloadLink = document.createElement("a");
    const url = URL.createObjectURL(file);
    //Opret et a element og tilknyt fileName og downloadlink til den så brugeren kan aktivere downloaden gennem DOM/Frontend
    downloadLink.href = url;
    downloadLink.download = fileName;

    document.body.appendChild(downloadLink);
    // Simuler klik på downloadlink for at starte download
    downloadLink.click();
    // Fjern downloadlink fra DOM'en
    document.body.removeChild(downloadLink);
}

module.exports = { generateDataForDownload, downloadResults};