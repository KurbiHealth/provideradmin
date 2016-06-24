function processChatroomRecord(data){
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
	var createArticle;
console.log('data in formSubmit',this.reply,this.question,this.title);
return false;
	// save to Chatroomreplies (replyText,chatRoomId)
	var data = {

	};
	Restangular
		.post(data)
		.then(function(err,response){
			if(err){
				return this.notification.log('There was a problem: ' + JSON.stringify(err));
			}
		});

	// if above is true, save to Articles (author,body,title,conversation_id)
	if(createArticle){
		Restangular
			.post(data)
			.then(function(err,response){
				if(err){
					return this.notification.log('There was a problem: ' + JSON.stringify(err));
				}
			});
	}

}

function conversationReplyController($stateParams, notification, Restangular) {

	// set up nofications
	this.notification = notification;
	var chatroomId = $stateParams.chatRoomId;
	this.chatRoomData = null;

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
				return notification.log('There was a problem: ' + JSON.stringify(err));
			}
			this.chatRoomData = response.data.plain();

			// process the record
			var data = processChatroomRecord(response.data.plain());
console.log('processed data',data);
			// display processed data in template form
console.log('this',this);
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

conversationReplyController.$inject = ['$stateParams', 'notification', 'Restangular'];