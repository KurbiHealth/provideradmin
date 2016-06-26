function processChatroomRecord(data){

	/*  CREATE A USER RECORD FROM THE CHAT ROOM DATA??????
		OR HAVE A CRON JOB THAT DID IT ALREADY????
		OR HAVE A STAMPLAY TASK THAT DOES THAT WHEN THE CHATROOM IS SAVED????
		OR ADD A FUNCTION TO THE CHATBOT TO CREATE A USER RECORD WHEN IT SAVES THE CHATBOT???? */

	var messages = data[0].messages;
console.log('messages',messages);
	var question,
		avatar,
		created;
	var tags = [];
	messages.map(function(m){
		m = JSON.parse(m);
		if(m.source == 'patient'){
			var q = m.message.qCode;
			var b = m.message.body;
			if(q){
				if(q == 'avatar chosen'){
					avatar = b.image;
				}
				if(q == 'back pain details'){
					question = b.text;
				}else{
					if(q.includes('pain')){
						tags.push(b.text);
					}
					if(q.includes('one week') || q.includes('one day')){
						tags.push(b.text);
					}
					if(q.includes('asked pros') || q.includes('self care') || q.includes('no treatment')){
						if(tags.indexOf(b.text) == -1)
							tags.push(b.text);
					}
				}
			}
		}
	})

	created = new Date(data[0].dt_create);
	created = created.toLocaleTimeString("en-us", {
	    weekday: "long", year: "numeric", month: "short",
	    day: "numeric", hour: "2-digit", minute: "2-digit"
	});

	var returnObj = {
		created: created,
		question: question,
		avatar: avatar,
		tags: tags.join(', '),
		title: question
	};

	return returnObj;
}

function formSubmit(){

	// ask if provider wishes to save a copy as a seed article in Articles
	var Restangular = this.Restangular;
	var $q = this.$q;
	var notification = this.notification;
	var createArticle = false;
	var promises = [];
	var that = this;
	that.returns = [];
console.log('that',that);

	if(confirm('Would you like to copy this reply to Articles?')){
	    var user = window.localStorage.getItem("user");
	    if(typeof user == 'object' && user == null){
	        notification.log('problem saving article');
	        return false;
	    }else{
	        user = JSON.stringify(user);
	    }
	    var articleData = {
	    	author: user._id,
	    	body: this.reply,
	    	conversation_id: this.chatroomId,
	    	title: this.question,
	    	published: false
		};
		var articles = Restangular.all('articles');
		promises.push(
	    	articles
			.post(articleData)
			.then(function(response,err){
				if(err){
					that.returns.push('There was a problem: ' + JSON.stringify(err));
				}
				if(response.status == '200'){
					that.returns.push('Article saved');
				}
			})
		);
	}

	// save to Chatroomreplies (replyText,chatRoomId)
	var replyData = {
		chatRoomId: this.chatroomId
		,replyText: this.reply
		//,recipient: THIS NEEDS TO HAVE A USER ID, WHICH MEANS WE NEED TO HAVE A USER RECORD ALREADY CREATED FROM THE CONVERSATION 
	};
	var replies = Restangular.all('chatroomreplies');
	promises.push(
		replies.post(replyData)
		.then(function(response,err){
			if(err){
				that.returns.push('There was a problem saving the reply: ' + JSON.stringify(err));
			}
			if(response.status == '200'){
				that.returns.push('Reply saved');
			}
		})
	);		

	$q.all(promises).then(function(){
		notification.log(that.returns.join('\n'));
		var url = '/#/chatroom/show/' + that.chatroomId;
console.log('url',url);
		window.location = url;
	});

}

function conversationReplyController($stateParams, notification, Restangular, $q) {

	// set up nofications
	this.notification = notification;
	this.chatroomId = $stateParams.chatRoomId;
	var chatroomId = this.chatroomId;
	this.chatRoomData = null;
	this.Restangular = Restangular;
	this.$q = $q;

	// form variables
	this.question = '';
	this.tags = '';
	this.title = '';
	this.reply = '';
	this.avatar = '';
	var that = this;

	// load ChatRoom record from Stamplay
	var chatroomData = {
		"_id": chatroomId
	};

	Restangular
		.all('chatroom')
		.getList(chatroomData)
		.then(function(response,err){
			if(err){
				return this.notification.log('There was a problem: ' + JSON.stringify(err));
			}
			
			this.chatRoomData = response.data.plain();

			// process the record
			var data = processChatroomRecord(response.data.plain());
			
			// display processed data in template form
			that.question = data.question;
			that.tags = data.tags;
			that.title = data.title;
			that.avatar = data.avatar;
			
			return that;
		});

	// form submission to ChatRoomReplies data model (owner,created,replyText,chatRoomId) 
	this.formSubmit = formSubmit;

}

export default conversationReplyController;

conversationReplyController.$inject = ['$stateParams', 'notification', 'Restangular', '$q'];