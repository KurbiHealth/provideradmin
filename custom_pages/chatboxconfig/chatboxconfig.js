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

		var data = {
			avatar: this.avatar,
			color: this.color,
			headline: this.headline,
			snippet: this.snippet,
			url: this.url
		};
  
		if(currView == 'new'){
			$http
			.post(URL,data)
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
				var custom = Restangular.one('customization');
				
				custom.chat_avatar = data.avatar;
				custom.chat_color = data.color;
				custom.chat_headline = data.headline;
				
				custom.save()
				.then(function(response) {
					console.log(response);
					// save the snippet & link to Customization rcd 
					// to the ChatBox record
		console.log('chatBoxId',chatBoxId);
		console.log('snippet',snippet);
					var customizationId = response.data.id;
		console.log('customizationId',customizationId);

					var chatBoxGet = {
						"_id": chatBoxId
					};
					var chatBoxData = {
						snippet: snippet,
						customizations: [chatBoxId]
					}
					var chatBox = Restangular
						.all('chatbox')
						.getList(chatBoxGet)
						.push(chatBoxData)
						.then(function(result){
console.log('result of updating chatbox',result);
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
			});

		} // END if(currView == 'edit')

	} // END this.submitForm()

} // END function chatboxConfigController()

export default chatboxConfigController;