
$("#exportToCinedi").on("click", function (e) {
  e.preventDefault();

    // Sélectionner tous les tableaux dans la classe .view-export-cinedi .table-responsive.col
    var tables = document.querySelectorAll(".view-export-cinedi .table-responsive.col");
  
    // Fonction utilitaire pour formater la date
    function formatDate(dateString) {
      return moment(dateString, "DD-MM-YYYY").format("DDMMYYYY");
    }
  
    // Fonction pour extraire les informations d'un élément HTML
    function extractInfo(row, elementSelector, defaultValue = "") {
      var element = row.querySelector(elementSelector);
      return element ? element.textContent.trim() : defaultValue;
    }
  
    var dataToExport = "";
  
    var enregistrement1 = {};
    var enregistrement2 = {};
    var enregistrement3 = {};
    var enregistrement4 = {};
    var enregistrement5 = {};
  
  
  
  
  
    // Utiliser un objet pour stocker les informations en cours de traitement
    var TypeEn1 = "";
    var TypeEn2 = "";
    var TypeEn3 = "";
    var TypeEn4 = "";
    var TypeEn5 = "";
    // Parcourir chaque tableau
    tables.forEach(function (table, tableIndex) {
      var captionLinks = table.querySelectorAll("caption a");
  
      // Afficher le texte du premier lien trouvé dans la console.log
      if (captionLinks.length > 0) {
    
      }
  
      // Parcourir chaque ligne du tableau
      var rows = table.querySelectorAll("tbody tr");
      rows.forEach(function (row, rowIndex) {
        var NumManifold = "00258"; //(sur 5 chiffres max)
        var typeBordereau = 1;
        var typeEnregistrementOne = "01";
        var typeEnregistrementTwo = "02";
        var typeEnregistrementTrois = "04";
        var typeEnregistrementFour = "10";
        var typeEnregistrementFive = "11";
        //
        var region = extractInfo(row, ".views-field.views-field-field-region-cinematographique");
        var autorisation = extractInfo(row, ".views-field.views-field-field-autorisation-de-salle-");
        //
        var enseigne = extractInfo(row, ".views-field.views-field-field-enseigne");
        var ville = extractInfo(row, ".views-field.views-field-nothing").slice(0, 14).padEnd(14, ' ');
        var dateDebutProgramme = formatDate(document.querySelector("#edit-field-date-seance-value-min").value);
        var dateFinProgramme = formatDate(document.querySelector("#edit-field-date-seance-value-max").value);
        var seanceJour = extractInfo(row, ".views-field.views-field-field-date-seance");
        var maDate = new Date(2024, 0, 10);
        var weekNumber = $.datepicker.iso8601Week(maDate);
        //->
        var film = extractInfo(row, ".views-field.views-field-field-film");
        var visa = extractInfo(row, ".views-field.views-field-field-visa");
        var nomDistributeur = extractInfo(row, ".views-field.views-field-field-distributeur");
        var minimumGaranti = "P000000000"; //TODO
        var nombreSeance = 1;
        var taxeSpe ="00000"
        var codeDistributeur = extractInfo(row, ".views-field.views-field-field-code");
        var tauxLocation = extractInfo(row, ".views-field.views-field-field-taux-location");
  
  
        //
        var projection = extractInfo(row, '.views-field.views-field-field-mode-de-projection  ')
        
        if(projection === "2D"){
          projection = "NUM";
        }else if (projection === "3D"){
          projection = "N3D";
        }else{
          projection = "STD;"
        }
  
  
        var versionDiffusion = extractInfo(row, ".views-field.views-field-field-version-de-diffusion");
  
        if(versionDiffusion === "VF"){
          versionDiffusion = "1";
        }else if (versionDiffusion === "VO"){
          versionDiffusion = "2";
        }else{
          versionDiffusion = "3;"
        }
        
        //
        var tauxLocationSansPourcentage = parseFloat(tauxLocation);
        var tauxProcessed = Math.round(tauxLocationSansPourcentage * 100).toString(); // Convertir à un entier
           
        
        //
        //
        var adressProjection = extractInfo(row, '.views-field.views-field-field-adress-projection ').slice(0, 35).padEnd(35, ' ');
        var codePostal = extractInfo(row, '.views-field.views-field-field-code-postal ')
        var telephoneBrut = extractInfo(row, '.views-field.views-field-field-telephone');
        var telephoneString = telephoneBrut.toString();
        var telephone = telephoneString.replace(".", "");
        var mobile = "0000000000"
  
  
  
  
        var debutCommun = region + autorisation + NumManifold + typeBordereau;
  
        /* calcul total entree et recette  */
        var prixTarifplein = 7.5;
        var prixTarifReduit = 5.5;
        var prixTarifCinejeune = 4.5;
        //->tarif reduit
        var premierTR = extractInfo(row, '.views-field.views-field-nothing-1  ')
        var dernnierTR = extractInfo(row, '.views-field.views-field-nothing-2  ')
        var totalTR = dernnierTR - premierTR;
        var recetteTR = totalTR * prixTarifReduit;
        //->tarif plein
        var premierTP = extractInfo(row, '.views-field.views-field-nothing-3  ')
        var dernnierTP = extractInfo(row, '.views-field.views-field-nothing-4  ')
        var totalTP = dernnierTP - premierTP;
        var recetteTP = totalTP * prixTarifplein;
        //->tarif cinejeune
        var premierJeune = extractInfo(row, '.views-field.views-field-nothing-5  ')
        var dernnierJeune = extractInfo(row, '.views-field.views-field-nothing-6  ')
        var totalJeune = dernnierJeune - premierJeune;
        var recetteJeune= totalJeune * prixTarifCinejeune;
  
        var totalEntree = totalTR + totalTP + totalJeune;
        var totalRecette = recetteTR + recetteTP + recetteJeune;
  
        var nombreSeanceString = String(nombreSeance);
        var processedNombreSeance = nombreSeanceString.slice(0, 3).padStart(3, "0");
        //->
        var totalEntreeString = String(totalEntree);
        var processedTotalEntree = totalEntreeString.slice(0, 6).padStart(6, "0");
        //->
        var totalRecetteString = String(totalRecette);
        var porcessedTotalRecette = totalRecetteString.slice(0, 9).padStart(9, "0").replace('.', '')
  
  
     
  
        var tauxLocationSansPourcentageRendement = parseFloat(tauxLocation);
        var tauxRendemencalcul = tauxLocationSansPourcentageRendement/100;
  
  
        var rendementBrutFormatted = tauxRendemencalcul * totalRecette;
         
  
        /* FOMATAGE DES DONNE  */
        //TYPE 1
        var enseigne1 =  extractInfo(row, ".views-field.views-field-field-enseigne").slice(0, 14).padEnd(14, ' ');
        var ville1 = extractInfo(row, ".views-field.views-field-nothing").slice(0, 14).padEnd(14, ' ');
        //->
        //typ2
        var film = extractInfo(row, ".views-field.views-field-field-film").slice(0, 25).padEnd(25, ' ');
        var nomDistributeur = extractInfo(row, ".views-field.views-field-field-distributeur").slice(0, 25).padEnd(25, ' ');
        //type3
        var premierTR3 = extractInfo(row, '.views-field.views-field-nothing-1  ').slice(0, 7).padStart(7, '0');
        var dernnierTR3 = extractInfo(row, '.views-field.views-field-nothing-2  ').slice(0, 7).padStart(7, '0');
        //->tarif plein
        var premierTP3 = extractInfo(row, '.views-field.views-field-nothing-3  ').slice(0, 7).padStart(7, '0');
        var dernnierTP3 = extractInfo(row, '.views-field.views-field-nothing-4  ').slice(0, 7).padStart(7, '0');
        //->tarif cinejeune
        var premierJeune3 = extractInfo(row, '.views-field.views-field-nothing-5  ').slice(0, 7).padStart(7, '0');
        var dernnierJeune3= extractInfo(row, '.views-field.views-field-nothing-6  ').slice(0, 7).padStart(7, '0');
  
        //-------------
        var total3FormatTP = totalTP.toString();
        var total3TopBrut = total3FormatTP.slice(0, 6).padStart(6, '0');
        //
        var total3FormatTR = totalTR.toString();
        var total3TRBrut = total3FormatTR.slice(0, 6).padStart(6, '0');
        //
        var total3FormatJeune = totalJeune.toString();
        var totalJeuneRBrut = total3FormatJeune.slice(0, 6).padStart(6, '0');
        
        //-------------
        var prixTarifpleinFormat = prixTarifplein.toString();
        var prixTarifpleinBrut = prixTarifpleinFormat.slice(0, 5).padStart(5, '0').replace(".", ",");
        //
        var prixTarifreduitFormat = prixTarifReduit.toString();
        var prixTarifreduitBrut = prixTarifreduitFormat.slice(0, 5).padStart(5, '0').replace(".", ",");
        //
        var prixTarifCinejeuneFormat = prixTarifCinejeune.toString();
        var prixTarifCinejeuneBrut = prixTarifCinejeuneFormat.slice(0, 5).padStart(5, '0').replace(".", ",");
        //-------------
        var recetteTPFormat = recetteTP.toString();
        var recetteTPBrut = recetteTPFormat.slice(0, 11).padStart(11, '0').replace(".", "");
        //
        var recetteTRFormat = recetteTR.toString();
        var recetteTRBrut = recetteTRFormat.slice(0, 11).padStart(11, '0').replace(".", "");
         //
         var recetteJeuneFormat = recetteJeune.toString();
         var recetteJeuneBrut = recetteJeuneFormat.slice(0, 11).padStart(11, '0').replace(".", "");
  
  
        //-------------
        var cat1= "ENT ";
        var cat2= "TRD ";
        var cat3= "CJE ";
  
        //TYPE 4 FORMATED
  
        var enseigne4 =  extractInfo(row, ".views-field.views-field-field-enseigne").slice(0, 35).padEnd(35, ' ');
        var ville4 = extractInfo(row, ".views-field.views-field-nothing").slice(0, 35).padEnd(35, ' ');
  
        //TYPE 5 FORMATEDD 
        var total4Format = totalEntree.toString();
        var total4 = total4Format.substring(0, 6).padStart(6, "0");
  
        var totalRecette4Format = totalRecette.toString();
        var totalRecette4 = totalRecette4Format.substring(0, 9).padStart(9, "0").replace(".", "");
  
        var heureSeanceBrut = extractInfo(row, ".views-field.views-field-field-date-seance-1");
        var heureSeance = heureSeanceBrut.replace(/:/g, '').slice(0, 4);
        
        var NoResultJour = "000000000000000000";
  
        var nbrSeance =1;
  
  
        /* ----------- TYPE ENREGISTREMENT 1  ----------- */
  
            var key = debutCommun + typeEnregistrementOne + enseigne + ville  + dateDebutProgramme  + dateFinProgramme  + weekNumber   ;          
            if (!enregistrement1[key]) {
              enregistrement1[key] =  [];
            }
  
            enregistrement1[key].push(seanceJour + "-" + nbrSeance + "-" + totalEntree + "-" + totalRecette);
  
            var keySeance = seanceJour + ville;
  
            if (enregistrement1[keySeance]) {
              // Si keySeance existe déjà dans enregistrement1
              // Fusionne les données pour les mêmes seanceJour et ville
              enregistrement1[keySeance].forEach(function (item, index) {
                var values = item.split("-");
                nbrSeance += parseInt(values[1], 10);
                totalEntree += parseInt(values[2], 10);
                totalRecette += parseInt(values[3], 10);
              });
  
  
              enregistrement1[keySeance] = [seanceJour + "-" + nbrSeance + "-" + totalEntree + "-" + totalRecette];
            } 
  
            /* Typpe enregistrment2 */
  
            var keype2 =  debutCommun +  typeEnregistrementTwo +  projection +  versionDiffusion + visa + film + codeDistributeur + nomDistributeur   + minimumGaranti + tauxProcessed;
  
            if(!enregistrement2[keype2]){
              enregistrement2[keype2] = []
            }
            enregistrement2[keype2].push(  rendementBrutFormatted  )
  
            /* Typpe enregistrment 3 */
  
             TypeEn3+= debutCommun +  typeEnregistrementTrois + ville + 
            cat1 + premierTP3   + dernnierTP3  + total3TopBrut  + prixTarifpleinBrut  + recetteTPBrut  +  taxeSpe + 
            cat2 + premierTR3 + dernnierTR3 + total3TRBrut + prixTarifreduitBrut + recetteTRBrut +  taxeSpe + 
            cat3 + premierJeune3 + dernnierJeune3 + totalJeuneRBrut + prixTarifCinejeuneBrut + recetteJeuneBrut +  taxeSpe 
            + '\n'; 
  
  
            /* Typpe enregistrment 4 */
            var adressProjection4 = adressProjection.padEnd(14, "");
  
            var keyt4 = debutCommun + typeEnregistrementFour + enseigne4
            + adressProjection4 + ville4 + codePostal + ville4 + telephoneBrut +  mobile;
  
            if(!enregistrement4[keyt4]){
              enregistrement4[keyt4] = []
            }
             /* Typpe enregistrment 5 */
             var ville5 = ville.slice(0, 14).padEnd(14, ' ')
             TypeEn5+= debutCommun + typeEnregistrementFive + ville5 + seanceJour + heureSeance + total4 + totalRecette4  + '\n';
      });
    
  
    });
  
    for (var keyt4 in enregistrement4) {
      if (enregistrement4.hasOwnProperty(keyt4)) {
        TypeEn4 += keyt4  + '\n';
      }
    }
  
  
    for (var key in enregistrement1) {
      if (enregistrement1.hasOwnProperty(key)) {
        TypeEn1 += key + fusionnerEnregistrements(enregistrement1[key]) + '\n';
      }
    }
  
    function fusionnerEnregistrements(enregistrements) {
      var mergedRecord = {};
      
      enregistrements.forEach(function (item) {
        var values = item.split("-");
        var seanceJour = values[0];
        
        if (!mergedRecord[seanceJour]) {
          mergedRecord[seanceJour] = {
            nbrSeance: 0,
            totalEntree: 0,
            totalRecette: 0
          };
        }
    
        mergedRecord[seanceJour].nbrSeance += parseInt(values[1], 10);
        mergedRecord[seanceJour].totalEntree += parseInt(values[2], 10);
        mergedRecord[seanceJour].totalRecette += parseInt(values[3], 10);
      });
    
      var mergedArray = [];
    
      for (var seanceJour in mergedRecord) {
        if (mergedRecord.hasOwnProperty(seanceJour)) {
          mergedArray.push(seanceJour + "-" + mergedRecord[seanceJour].nbrSeance + "-" + mergedRecord[seanceJour].totalEntree + "-" + mergedRecord[seanceJour].totalRecette);
        }
      }
    
      return mergedArray;
    }
    //------------------------------------------------->
    
    for (var keype2 in enregistrement2) {
      if (enregistrement2.hasOwnProperty(keype2)) {
        TypeEn2 += keype2  + sumRendement(enregistrement2[keype2]) + '\n';
      }
    }
  
  
    function sumRendement(array) {
      var sum = 0;
      for (var i = 0; i < array.length; i++) {
          // Assuming rendementBrutFormatted is a string representing a number
          sum += parseFloat(array[i]);
      }
      return sum.toFixed(2); // Format the sum as needed
  }
    
    //------------------------------------------------->
    
  
    
  
    /* MERGED TYPE EN 2 */
  
  
    dataToExport += TypeEn1 + TypeEn2  + TypeEn3 + TypeEn4 + TypeEn5; 


  // Créer le fichier et le télécharger une seule fois à l'extérieur de la boucle
  var dateDuJour = moment().format("DDMMYYYY");
  var blob = new Blob([dataToExport], { type: "text/plain" });
  var blobUrl = URL.createObjectURL(blob);

  var downloadLink = document.createElement("a");
  downloadLink.href = blobUrl;
  downloadLink.download = "Export_cinedi_" + dateDuJour + "_total_lignes" + dataToExport.split('\n').length + ".txt";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(blobUrl);
});
