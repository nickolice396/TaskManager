const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    age: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0)
                throw new Error('Age Must Be Positive Number!')
        }
    },


    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,

        validate(value) {
            if (value.includes('password'))
                throw new Error('Password cannot contain "Password"')

        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error('Email Invalid')

        }
    },


    creditCard: {
        type: String,
        required: true
    }



})


const validateAll = (name, email, creditCard) => {
    if (!validator.isAlpha(name, ['az-AZ'])) {
        console.log('Name Invalid')
        return false
    }


    if (!validator.isEmail(email)) {

        console.log('Email Invalid')
        return false
    }

    if (!validator.isCreditCard(creditCard)) {
        console.log('Credit Card Number Invalid')
        return false
    }

    return true
}




/*
const sensai = new User({
        name: 'DanielLaRusso',
        age: 41,
        password: 'miyagi-do',
        email: 'dannyLarusso1984@gmail.com',
        creditCard: '5454 3434 5435 3321'
    })
  
    sensai.save().then((sensai) => {

        if (validateAll(sensai.name, sensai.email, sensai.creditCard)) {
            console.log(sensai)
        }



    }).catch((error) => {
        console.log('Unexpected Error!', error)
    })*/


userSchema.statics.findByCred = async(email, password) => {
    const user = await User.findOne({ email })

    if (!user)
        throw new Error('Unable To Find Email!')

    const match = await bcrypt.compare(password, user.password)
    if (!match)
        throw new Error('Password Does not Mactch!')


    return user
}




//Hashing Regular Password
userSchema.pre('save', async function(next) {
    const user = this

    if (user.isModified('password'))
        user.password = await bcrypt.hash(user.password, 8)


    next()
})




const User = mongoose.model('User', userSchema)

module.exports = User