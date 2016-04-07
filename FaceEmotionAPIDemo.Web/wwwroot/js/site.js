var emotionService = (function() {
   function createBlob (dataURL) {
        var BASE64_MARKER = ';base64,';
        if (dataURL.indexOf(BASE64_MARKER) == -1) {
            var parts = dataURL.split(',');
            var contentType = parts[0].split(':')[1];
            var raw = decodeURIComponent(parts[1]);
            return new Blob([raw], { type: contentType });
        }
        var parts = dataURL.split(BASE64_MARKER);
        var contentType = parts[0].split(':')[1];
        var raw = window.atob(parts[1]);
        var rawLength = raw.length;

        var uInt8Array = new Uint8Array(rawLength);

        for (var i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], { type: contentType });
    };
    
    return {
        getFaceEmotionsByStream : function(stream, apiKey, onDoneCallback) {
            $.ajax({
                url: "https://api.projectoxford.ai/emotion/v1.0/recognize?",
                beforeSend: function(xhrObj){
                    // Request headers
                    xhrObj.setRequestHeader("Content-Type","application/octet-stream");
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", apiKey);
                },
                type: "POST",
                data: createBlob(stream),
                processData: false
            })
            .done(function(data) {
                console.log(JSON.stringify(data));
                onDoneCallback(data);
            })
            .fail(function() {
                console.log('bummer');
            });
        }
    };
})();

var emoticonProvider = (function(){
    this.happiness = ':)';
    this.sadness = ':(';
    this.anger = 'X(';
    this.neutral = ':|';
    this.surprise = ':o';
    this.contempt = ':/';
    this.disgust = '>:P';
    
    return {
        fromScores(scores){
            var maxEmotionScore = Math.max(
                    scores.anger, 
                    scores.happiness, 
                    scores.sadness, 
                    scores.neutral, 
                    scores.disgust, 
                    scores.contempt, 
                    scores.surprise);
                
            if(scores.happiness === maxEmotionScore) {
                return happiness;
            } else if(scores.sadness === maxEmotionScore) {
                return sadness;
            } else if(scores.anger === maxEmotionScore) {
                return anger;
            } else if(scores.neutral === maxEmotionScore) {
                return neutral;
            } else if(scores.surprise === maxEmotionScore) {
                return surprise;
            } else if(scores.contempt === maxEmotionScore) {
                return contempt;
            } else if(scores.disgust === maxEmotionScore) {
                return disgust;
            } else {
                return '';
            }
        }
    };
})();