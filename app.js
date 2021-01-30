const express = require('express');
const app = express();
const PORT = process.env.PORT || 5500;
const { validateJSON, checkRequired, validateAllFields, validateRuleField, validateCondition } = require("./middlewares/validate")
const routes = require('./routes/routes');

app.use(express.json())


//Middlewares
app.use('/validate-rule', validateJSON)
app.use('/validate-rule', checkRequired)
app.use('/validate-rule', validateAllFields)
app.use('/validate-rule', validateRuleField)
app.use('/validate-rule', validateCondition)

app.use('/',routes)


//error handler
app.use((err, req, res, next) => {
    if (!err.status) {
        err.status = 500;
    }

    const error = {
        "message": err.message,
        "status": "error",
        "data": null
    };

    res.status(err.status).json(error);
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));