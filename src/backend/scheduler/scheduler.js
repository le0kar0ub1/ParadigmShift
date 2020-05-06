"use strict";

/* [ENVIRRONNEMENT VARIABLE] */
const DDB_ID="paradigmshift-context" 
/* [ENVIRRONNEMENT VARIABLE] */

const AWS = require('aws-sdk');

const cron = require('cron-parser');

function parse_ISO8601(asStr)
{
    const asMs = Date.parse(asStr);
    if (asMs === NaN)
        return (Nan);
    return (asMs * 1000);
}

// function schedulingEval(current, )

exports.handler = async (event, context, callback) =>
{
    try {
        /* Get the database timer */
    } catch (err) {
        return callback(err);
    }
};