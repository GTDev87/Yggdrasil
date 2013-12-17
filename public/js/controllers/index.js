
app.factory('Base64', function() {

  var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  // private method for UTF-8 encoding
  function _utf8_encode(string) {
      string = string.replace(/\r\n/g,"\n");
      var utftext = "";

      for (var n = 0; n < string.length; n++) {

          var c = string.charCodeAt(n);

          if (c < 128) {
              utftext += String.fromCharCode(c);
          }
          else if((c > 127) && (c < 2048)) {
              utftext += String.fromCharCode((c >> 6) | 192);
              utftext += String.fromCharCode((c & 63) | 128);
          }
          else {
              utftext += String.fromCharCode((c >> 12) | 224);
              utftext += String.fromCharCode(((c >> 6) & 63) | 128);
              utftext += String.fromCharCode((c & 63) | 128);
          }
      }

      return utftext;
  }

  // private method for UTF-8 decoding
  function _utf8_decode(utftext) {
      var string = "";
      var i = 0;
      var c, c1, c2;
      c = c1 = c2 = 0;

      while ( i < utftext.length ) {

          c = utftext.charCodeAt(i);

          if (c < 128) {
              string += String.fromCharCode(c);
              i++;
          }
          else if((c > 191) && (c < 224)) {
              c2 = utftext.charCodeAt(i+1);
              string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
              i += 2;
          }
          else {
              c2 = utftext.charCodeAt(i+1);
              c3 = utftext.charCodeAt(i+2);
              string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
              i += 3;
          }
      }
      return string;
  }

  function encode(input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = _utf8_encode(input);

    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
          enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
          enc4 = 64;
      }

      output = output +
      _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
      _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
    }

    return output;
  }


  function decode(input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {
      enc1 = _keyStr.indexOf(input.charAt(i++));
      enc2 = _keyStr.indexOf(input.charAt(i++));
      enc3 = _keyStr.indexOf(input.charAt(i++));
      enc4 = _keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
          output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
          output = output + String.fromCharCode(chr3);
      }
    }

    output = _utf8_decode(output);
    return output;
  }

  return {
    encode : encode, // public method for encoding
    decode : decode // public method for decoding
  }

});




angular.module('mean').controller('IndexController', ['$scope', 'Global', 'Pulls', 'Save', 'Find', 'Base64', function ($scope, Global, Pulls, Save, Find, Base64) {
    $scope.global = Global;
    $scope.request = {};
    $scope.request.oauth = {};
    $scope.result = {};
    $scope.tree = {};
    
    $scope.jsonData = {
      name: "Animal",
      children: [
        {
          name: "Mammal",
          children: [
            {name:"Cat"},
            {name:"Dog"}
          ]
        },
        {
          name: "Fish"
        }
      ]
    };

    $scope.jsonData = {
      Animal: [
        {
          Mammal: [
            "Cat",
            "Dog"
          ]
        }, 
        {
          name: "Fish"
        }
      ]
    };



    $scope.hasOauth = false;

    $scope.toggleOauth = function () {
        $scope.hasOauth = !$scope.hasOauth;
        $scope.request.oauth = {};
    };

    

    function formatCsvString(text){ return text.replace(/\"/g, '""'); }

    function convertDataToCsv(colNames, values){
      var colSeparator = '","';
      var rowSeparator = '"\r\n"';

      return '"' + _.map(
        colNames,
        function(name){
          return formatCsvString(name);
        }
      ).join(colSeparator) + rowSeparator + _.map(values, 
        function(row) {
          console.log("row = %j", row);
          return _.map(colNames, function(name){
            return formatCsvString(row[name].toString());
          }).join(colSeparator);
        }
      ).join(rowSeparator) + '"';
    }

    $scope.downloadCSV = function() {
      console.log("$scope.pruneResults = %j", $scope.pruneResults);

      var csvData = convertDataToCsv($scope.pruneResults.names, $scope.pruneResults.values);

      

      console.log("csvData = %j", csvData);
      window.location.href = "data:text/csv;base64," + Base64.encode(csvData);

    };

    // var initObj = _.reduce(
    //     $scope.pruneResults.names, 
    //     function(aggObj, name){
    //       aggObj[name] = name;
    //       return aggObj;
    //     },
    //     {}
    //   );

    //   console.log("$scope.pruneResults = %j", $scope.pruneResults);
    //   var vals = _.map($scope.pruneResults.values, 
    //     function(row) {
    //       return _.reduce(
    //         $scope.pruneResults.names,
    //         function(aggObj, name){
    //           aggObj[name] = row[name];
    //           return aggObj;
    //         },
    //         {}
    //       );
    //     }
    //   );
    //   $scope.csvData = [initObj].concat(vals);

    //   console.log("$scope.csvData = %j", $scope.csvData);

    $scope.getDataRequest = function () {
    	console.log("called getDataRequest");
    	console.log("$scope.request = %j", $scope.request);
    	Pulls.post($scope.request, function(pullResults){
        console.log("pullResults = %j", pullResults);
        $scope.jsonData = pullResults;
    		$scope.result.data = pullResults;
    		$scope.result.query = "/";
    		$scope.describeData()
    		
    		console.log("response");
    	});
    }

    $scope.saveData = function () {
      console.log("called saveData");
      console.log("$scope.jsonData = %j", $scope.jsonData);

      var saveObject = $scope.tree;
      saveObject.data = $scope.jsonData;

      if(saveObject.data && saveObject.name){
        Save.post(saveObject, function(saveResults){
          console.log("saveResults = %j", saveResults);
        });
      }
    }

    $scope.findData = function () {
      var findObject = $scope.tree;

      console.log("called findData");
      console.log("findObject = %j", findObject);
      Find.get(findObject, function(findResults){
        console.log("findResults = %j", findResults);
        $scope.jsonData = findResults;
      });
    }

    $scope.pruneFieldsFn = function (){
      $scope.pruneResults = {};
      $scope.pruneResults.names = $scope.result.pruneFields.split(",");
      $scope.pruneResults.values = prune.json($scope.jsonData).getTableWithArray($scope.pruneResults.names, $scope.pruneResults.names);
      console.log("values = %j", $scope.pruneResults.values);
    }

    $scope.describeData = function () {
    	console.log("data to describe = %j", $scope.result.data);
    	$scope.result.processed = canopy.json($scope.result.data).describe($scope.result.query);
    }
}]);