const  mongoose = require("mongoose");
const {Schema} = mongoose;
const JWT = require('jsonwebtoken');
const bcrypat = require('bcrypt');

const userSchema = new Schema({
    name: {
        type: String,
        require:[true, 'user name is Required'],
        minLength: [10, 'Name must be at least 5 char'],
        MaxLength: [20, 'Name must be less than 20 char'],
        trim: true
    },
    email:{
        type: String,
        require: [true, 'user email is required'],
        unique: true,
        lowercase: true,
        unique: [true, 'already registered']
    },
    password:{
        type: String,
        select: false
    },
    forgotPasswordToken: {
        type: String
    },
    forPasswordExpiryDate:{
        type: String
    }
},
{timestamps: true
});

userSchema.pre('save', async function(){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypat.hash(this.password, 10);
    return next();
})


userSchema.methods = {
    jwtToken(){
        return JWT.sign(
            {id: this.id, email: this.email,},
            process.env.SECRET,
            {expiresIn: "24"}
        )
    }
}
const userModel = mongoose.model('user', userSchema);
module.exports = userModel;