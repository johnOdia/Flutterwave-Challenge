const express = require('express');

//rulefield requirements/constraints validation
function validateRuleField(req, res, next) {
    const ruleField = req.body.rule

    //Check, rule field must be valid JSON
    if (!(ruleField instanceof Object)) {
        const error = new Error(`The rule field must be in JSON format`);
        error.status = 400;
        return next(error);
    }

    //Check, rule field should contain field
    if (ruleField.field === undefined) {
        const error = new Error(`The rule field must contain a field key`);
        error.status = 400;
        return next(error);
    }
    
    if(ruleField.field === '0' && req.body.data !== undefined && typeof req.body.data === 'string'){
        req.data = req.body.data        
        return next()
    }
  
    //Check, field nesting should not be more than two levels
    let checkNested;
    if (typeof ruleField.field === 'string') {
        checkNested = ruleField.field.replace(/[^.]/g, "").length
        if (checkNested > 1) {
            const error = generateError('Nesting should not be more than 2 levels in the rule field', 400)
            return next(error);
        }
    }
    
    //Check if nested field exists in object data
    if (checkNested) {        
        const key = ruleField.field;        
        const splittedKey = key.split('.');
        
        const [parentKey, nestedKey] = splittedKey;
        const data = req.body.data[parentKey][nestedKey];

        if (data === undefined) {            
            const error = generateError(`field ${key} is missing from data.`, 400);
            return next(error);
        }
        req.data = data;
        next()
    }
    
    //check if field exists in array data
    const fieldValue = ruleField.field;
    if (typeof fieldValue === 'number') {        
        req.data = req.body.data[fieldValue];
        const error = generateError(`field ${fieldValue} is missing from data.`, 400)
        req.body.data[fieldValue] === undefined ? next(error) : "";
    }

    //check if field exists in string data
    const stringData = req.body.data[ruleField.field]
    if (!stringData) {
        const error = generateError(`field ${ruleField.field} is missing from data.`, 400)
        next(error);
    }
    else req.data = stringData;
    

    next()
}

    
    

//The condition to use for validating the rule 
function validateCondition(req, res, next) {
    const ruleConditions = ['eq', 'neq', 'gt', 'gte', 'contains'];
    const reqCondition = req.body.rule.condition;
    const error = generateError(`Invalid condition [${reqCondition}].`, 400);

    ruleConditions.find(condition => condition === reqCondition) === undefined ? next(error) : next();
}

//Validate field types
function validateAllFields(req, res, next) {
    //validate rule field
    const ruleField = req.body.rule;

    if (!(ruleField instanceof Object)) {
        const error = generateError("rule should be an object.", 400);
        next(error);
    }

    //validate data field
    const datafield = req.body.data;

    if (typeof datafield !== 'object' && typeof datafield !== 'string') {
        const error = generateError("Data field should be a valid JSON, an array or a string.", 400)
        next(error);
    }
    next()
}

//all required fields must be passed
function checkRequired(req, res, next) {
    let error;

    if (req.body.rule === undefined) {
        error = generateError('rule is required.', 400)
        return next(error)
    }

    if (req.body.data === undefined) {
        error = generateError('data is required.', 400)
        return next(error)
    }

    next()
}

//validate json payload
function validateJSON(req, res, next) {
    if (typeof req.body !== 'object') {
        const error = generateError("Invalid JSON payload passed.", 400);
        next(error);
    }
    next();
}

//generate error
function generateError(message, status) {
    const error = new Error(message);
    error.status = status;
    return error;
}


module.exports = {
    validateJSON: validateJSON,
    checkRequired: checkRequired,
    validateAllFields: validateAllFields,
    validateRuleField: validateRuleField,
    validateCondition: validateCondition
}