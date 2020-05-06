"use strict";

/* [ENVIRRONNEMENT VARIABLE] */
const DBID_CONTEXTDEF="paradigmshift-contextdef"
const DBID_RESOURCES="paradigmshift-resources" 
/* [ENVIRRONNEMENT VARIABLE] */

const AWS = require('aws-sdk');

const cron = require('cron-parser');

function contextSwitchPower(context)
{
    
}

function parse_ISO8601(asStr)
{
    const asMs = Date.parse(asStr);
    if (asMs === NaN)
        return (Nan);
    return (asMs * 1000);
}

function schedulingEval(cronStr, lastscheduling)
{
    const now = Date.now();
    const appnext = parse_ISO8601(cron.parseExpression(cronStr).next().toString());

    if (appnext == NaN)
        return (NaN)
    if (now >= appnext)
        return (appnext);
    return (NaN);
}

exports.handler = async (event, context, callback) =>
{
    var next;

    try {
        /* Get the database timer */
        // for each context scheduled
        next = schedulingEval(cron, lastscheduling);
        if (next != NaN) {
            // update last scheduling in DB
            // contextSwitchPower(context);
        }
        
    } catch (err) {
        return callback(err);
    }
};