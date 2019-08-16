const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function addCredentialValidator(data) {
    let errors = {}

    data.info = !isEmpty(data.info) ? data.info : ''
    data.bio = !isEmpty(data.bio) ? data.bio : ''
    data.gender = !isEmpty(data.gender) ? data.gender : ''
    data.relationship = !isEmpty(data.relationship) ? data.relationship : ''
    data.postion = !isEmpty(data.postion) ? data.postion : ''
    data.company = !isEmpty(data.company) ? data.company : ''
    data.course = !isEmpty(data.course) ? data.course : ''
    data.institution = !isEmpty(data.institution) ? data.institution : ''
    data.dob = !isEmpty(data.dob) ? data.dob : ''
    data.imageId = !isEmpty(data.imageId) ? data.imageId : ''
    data.country = !isEmpty(data.country) ? data.country : ''
    data.state = !isEmpty(data.state) ? data.state : ''
    data.city = !isEmpty(data.city) ? data.city : ''
    data.fstate = !isEmpty(data.state) ? data.state : ''
    data.fcity = !isEmpty(data.city) ? data.city : ''
    data.zipCode = !isEmpty(data.zipCode) ? data.zipCode : ''
    

    if(Validator.isEmpty(data.info)) {
        errors.info = "Info field is required"
    }

    if (Validator.isEmpty(data.bio)) {
        errors.bio = "Bio field is required"
    }

    if (Validator.isEmpty(data.gender)) {
        errors.gender = "Gender field is required"
    }

    if (Validator.isEmpty(data.relationship)) {
        errors.relationship = "Relationship field is required"
    }

    if (Validator.isEmpty(data.course)) {
        errors.course = "Course field is required"
    }

    if (Validator.isEmpty(data.institution)) {
        errors.institution = "Institution field is required"
    }

    if (Validator.isEmpty(data.dob)) {
        errors.dob = "Date of birth field is required"
    }
    
    if (Validator.isEmpty(data.imageId)) {
        errors.imageId = "Please Upload you profile pic"
    }

    if (Validator.isEmpty(data.country)) {
        errors.country = "Mention your Country Name"
    }

    if (Validator.isEmpty(data.state)) {
        errors.state = "Mention your State Name"
    }

    if (Validator.isEmpty(data.city)) {
        errors.city = "Mention your City Name"
    }

    
    if (Validator.isEmpty(data.fstate)) {
        errors.fstate = "Mention your State Name"
    }

    if (Validator.isEmpty(data.fcity)) {
        errors.fcity = "Mention your City Name"
    }

    if (Validator.isEmpty(data.zipCode)) {
        errors.zipCode = "Mention your Zipcode"
    }

    return {
        errors, 
        isValid: isEmpty(errors)
    }
}