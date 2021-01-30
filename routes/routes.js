const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json(
        {
            "message": "My Rule-Validation API",
            "status": "success",
            "data": {
                "name": "Efosa John Odia",
                "github": "https://github.com/johnOdia",
                "email": "efosajohnodia@gmail.com",
                "mobile": "08133370540"
            }
        }
    )
})


router.post("/validate-rule", (req, res, next) => {
    const rule = req.body.rule;
    const data = req.data;
    const condition = rule.condition;
    const conditionValue = rule.condition_value;
    let status;

    switch (condition) {
        case 'eq':
            data == conditionValue ? status = 'success' : status = 'error' 
            break;
        case 'neq':            
            data != conditionValue ? status = 'success' : status = 'error' 
            break;
        case 'gt':
            data > conditionValue ? status = 'success' : status = 'error' 
            break;
        case 'gte':
            data >= conditionValue ? status = 'success' : status = 'error' 
            break;
        case 'contains':            
            req.body.data.find(val => val === data) ? status = 'success' : status = 'error'
            break;
        default:
            status = 'error'
            break;
    }

    if(status === 'success'){
        const response = {
            message: `field ${rule.field} successfully validated.`,
            status: "success",
            data: {
              validation: {
                error: false,
                field: rule.field,
                field_value: req.data,
                condition: condition,
                condition_value: conditionValue
              }
            }
          }

          res.status(200).json(response);
    }

    else{
        const response = {
            message: `field ${rule.field} failed validation.`,
            status: "error",
            data: {
              validation: {
                error: true,
                field: rule.field,
                field_value: req.data,
                condition: condition,
                condition_value: conditionValue
              }
            }
          }
          res.status(400).json(response);
    }    
})

module.exports = router;