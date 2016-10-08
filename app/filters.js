/**
 * 
 * AngularJS Boilerplate
 * @description           Description
 * @author                Jozef Butko // www.jozefbutko.com/resume
 * @url                   www.jozefbutko.com
 * @version               1.1.7
 * @date                  March 2015
 * @license               MIT
 * 
 */
;(function() {

angular.module('chat')
	.filter('ago',function(){
		return function(date){
				if(!date){
					return moment().locale('fr').fromNow()
				}

				return moment(date).locale('fr').fromNow(); // 4 years ago
			};
	})
	.filter('words', function () {
        return function (input, words) {
            if (isNaN(words)) return input;
            if (words <= 0) return '';
            if (input) {
                var inputWords = input.split(/\s+/);
                if (inputWords.length > words) {
                    input = inputWords.slice(0, words).join(' ') + '…';
                }
            }
            return input;
        };
    })

	.filter('titlecase', function() {
		return function( input ) {
			return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		}
	});




})();