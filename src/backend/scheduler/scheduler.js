"use strict";

/* [ENVIRRONNEMENT VARIABLE] */
const DBID_CONTEXTDEF="paradigmshift-context"
const DBID_RESOURCES="paradigmshift-resource" 
/* [ENVIRRONNEMENT VARIABLE] */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

// const cron = require('cron-parser');

function contextSwitchPower(context)
{
    
}

function ISO8601parse(asStr)
{
    const asMs = Date.parse(asStr);

    if (isNaN(asMs))
        return (NaN);
    return (asMs / 1000);
}

// function schedulingEval(cronStr, lastscheduling)
// {
//     const now = Date.now();
//     const appnext = ISO8601parse(cron.parseExpression(cronStr).next().toString());

//     if (isNaN(appnext))
//         return (NaN)
//     if (now >= appnext)
//         return (appnext);
//     return (NaN);
// }

exports.handler = async (event, context, callback) =>
{
    var next;

    try {
        /* Get the database timer */
        // for each context scheduled
        var total = await getScheduledContext();
        console.log(total);
        // next = schedulingEval(cron, lastscheduling);
        // if (next != NaN) {
            // update last scheduling in DB
            // contextSwitchPower(context);
        // }
        return callback(null, {
            statusCode: 200,
            body: "Success",
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'}
        });
    } catch (err) {
        return callback(err, {
            statusCode: 500,
            body: JSON.stringify(err),
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'}
        });
    }
};

function getScheduledContext()
{
    return new Promise((resolve, reject) => {
        var params = {
            IndexName: 'isScheduled-index',
            KeyConditionExpression: "#isScheduled = :isScheduled",
            ExpressionAttributeNames:{
                "#isScheduled": "isScheduled"
            },
            ExpressionAttributeValues: {
                ":isScheduled": true
            },
            TableName: DBID_CONTEXTDEF
        };
        dynamodb.query(params, function(err, data) {
            if (err) {
                console.log("Error when read database" + err);
                return reject (err);
            } else {
                return resolve (data);
            }
        });
    });
}
// TableName: process.env.DBID_CONTEXTDEF
