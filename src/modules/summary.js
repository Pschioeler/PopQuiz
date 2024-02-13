//import possible other dependable modules
function displayAnswers(questionCount){
    //do some display magic here with each answered question
}

function generateDataForDownload(){
    //get information about answers and return it for other functions
    var fileContent = "";
    return fileContent;
}

function downloadResults(fileName){
    const fileContent = generateDataForDownload();

    const file = new Blob([fileContent], {type: "text/plain"});
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