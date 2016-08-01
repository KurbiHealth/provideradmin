function chatboxConfigController($stateParams, notification, Restangular, $http, chatServerURL,$scope) {
   
	// URL is the location of the chat endpoints
	var URL = chatServerURL;

    // notification is the service used to display notifications on the top of the screen
    this.notification = notification;
   
    // AVATAR (FILE PICKER)
    this.avatar = '';

    // COLOR PICKER FIELD
    // taken from https://github.com/ruhley/angular-color-picker
    $scope.options = {
	    round: true,
	    format: 'hex',
	    swatchOnly: true,
	    close: {
	        show: true,
	        label: 'Close',
	        class: 'btn',
	    }
	};
	this.color = '';

	// HEADLINE
    this.headline = '';

    // Check to see if there is a recent customization record available; if there is, load it and put values into form fields
    if($stateParams.chatBoxId){
		var currView = 'edit';
		var chatBoxId = $stateParams.chatBoxId;
		Restangular.one('chatbox',chatBoxId).get()
			.then(function(result){
				var chatBoxData = result.data.plain();

			});
    }else{
console.log('new chatBox');
    	var currView = 'new';
    }

    // the function is called from the template (file 'chatboxconfigtemplate.js')
	this.submitForm = function() {

		var apiKey = 'public';

		var customizationFormData = {
			avatar: this.avatar,
			color: this.color,
			headline: this.headline
		};
  
		if(currView == 'new'){
			$http
			.post(URL,customizationFormData)
			.then(function(response) {
				// Add snippet to UI
				console.log(response);
				var targetDiv = angular.element(document.getElementById('chatSnippet'));
				targetDiv.text("<script>"+response.data.snippet + "</script>");
				apiKey = response.apiKey;
				return response.data;
			}, function(err) {
				console.log("There was an error saving.",err);
			})
			.then(function(response){
				var chatBoxId = response.chatBoxId;
				var snippet = response.snippet;

				// Save form elements and snippet to Stamplay
				var data = {
					'chat_avatar': customizationFormData.avatar,
					'chat_color': customizationFormData.color,
					'chat_headline': customizationFormData.headline,
					'chatbox': chatBoxId
				};
				Restangular.all('customization')
					.post(data)
					.then(function(response) {
console.log('customization response',response);
					// save the snippet & link to Customization rcd 
					// to the ChatBox record
console.log('chatBoxId',chatBoxId,'snippet',snippet);
					var customizationId = response.data.id;
console.log('customizationId',customizationId);

					var chatBoxData = {
						'snippet': snippet,
						'customizations': ''
					}
					Restangular
						.one('chatbox',chatBoxId)
						.get()
						.then(function(result){
							var temp = result.data.plain();
console.log('result from chatbox get',temp);
							if(!temp.customizations){
								customArr = [];
							}else{
								var customArr = temp.customizations;
							}
// TO DO save chatbox.id in customization.chatbox
							customArr.push(customizationId);
							chatBoxData.customizations = customArr;
console.log('chatbox data',chatBoxData);
							Restangular.one('chatbox',chatBoxId)
								.customPUT(chatBoxData)
								.then(function(result){
console.log('updated chatbox with snippet and new customizations array',result.data.plain());
								})
						});
				}, function(err) {
					console.log("There was an error saving.",err);
				})
			});
		}

		if(currView == 'edit'){
			// send chatBoxId to bot API, it will update the js,html,css
/*			var data = {

			};
			$http
			.put(URL,data,function(result){

			})

			// create a new customization record
			.then(function(result){
				Restangular.one('customization').post(

				)
			// insert the new customization id into the chatbox record
				.then(function(result){
					var data = {

					};
					Restangular.one('chatbox',chatBoxId).put(data)
					.then(function(result){

					});
				})
			}); */

		} // END if(currView == 'edit')

	} // END this.submitForm()

} // END function chatboxConfigController()

export default chatboxConfigController;