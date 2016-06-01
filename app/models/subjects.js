var mongoosePaginate=require('mongoose-paginate');
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var subjectSchema = new Schema({
    
    code 			: String,
    name			: String,
    codeTeacher		: String,
    initDate		: String,
    status			: String,
    description		: String

});

subjectSchema.plugin(mongoosePaginate);

// create the model for users and expose it to our app
module.exports = mongoose.model('Subject', subjectSchema);
