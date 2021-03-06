"use strict";

/* [ENVIRRONNEMENT VARIABLE] */
const DBID_CONTEXTDEF="paradigmshift-context"
const DBID_RESOURCES="paradigmshift-resource" 
/* [ENVIRRONNEMENT VARIABLE] */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const lambda = new AWS.Lambda();

const cron = require('cron-parser');

function ISO8601parse(asStr)
{
    const asMs = Date.parse(asStr);

    if (isNaN(asMs))
        return (NaN);
    return (asMs / 1000);
}

function schedulingEval(cronStr, lastScheduling)
{
    const now = Date.now();
    const appnext = ISO8601parse(cron.parseExpression(cronStr).next().toString());
    const appnextnext = ISO8601parse(cron.parseExpression(cronStr).next().next().toString());

    if (isNaN(appnext))
        return (NaN)
    if (now >= appnext && (appnext - lastScheduling === appnextnext - appnext))
        return (appnext);
    return (NaN);
}

function invokeLambdaApplySched(playload, action)
{
    return new Promise((resolve, reject) => {
        var params = {
            FunctionName: func,
            InvocationType: 'RequestResponse',
            Payload: {
                type: action,
                data: JSON.stringify(playload)
            }
        };
        lambda.invoke(params, function(err, data) {
            if (err) {
                return reject (err);
            } else {
                return resolve (data.Payload);
            }
        });
    });
}

async function scheduleOneContext(context)
{
    let state;

    if (context.isScheduled == false)
        return;
    if (context.powerState == false)
        state = schedulingEval(context.schedulingRuleStart, context.lastscheduling);
    else
        state = schedulingEval(context.schedulingRuleStop, context.lastscheduling);
    if (isNaN(state))
        return;
    invokeLambdaApplySched(context.resources, context.powerState == true ? "STOP" : "START");
    await updateLastScheduling(context.contextID, state);
}

exports.handler = async (event, context, callback) =>
{
    try {
        var allcontext = await getScheduledContexts();
        for (let inc in allcontext)
        {
            scheduleOneContext(allcontext[inc]);
        }
        return callback(null, {
            statusCode: 200,
            body: "Success",
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
        });
    } catch (err) {
        return callback(err, {
            statusCode: 500,
            body: JSON.stringify(err),
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
        });
    }
};

function updateLastScheduling(contextID, newsched)
{
    return new Promise((resolve, reject) => {
        var params = {
            ExpressionAttributeNames: { 
                "#entry": "lastscheduling"
            },
            ExpressionAttributeValues: {
                ":newsched": newsched
            },
            Key: {
                contextID
            },
            UpdateExpression: "SET #entry = :newsched",
            TableName: DBID_CONTEXTDEF
        };
        dynamodb.update(params, function(err, data) {
            if (err) {
                console.log("Error while updating the database" + err);
                return reject (err);
            } else {
                return resolve (data);
            }
        });
    });
}

/*
** Please, before any cry, read the datamodel documentation :)
*/
function getScheduledContexts()
{
    return new Promise((resolve, reject) => {
        var params = {
            FilterExpression: "#isScheduled = :eqval",
            ExpressionAttributeNames: {
                "#isScheduled": "isScheduled",
            },
            ExpressionAttributeValues: {
                ":eqval": true
            },
            TableName: DBID_CONTEXTDEF
        };
        dynamodb.scan(params, function(err, data) {
            if (err) {
                console.log("Error while reading database" + err);
                return reject (err);
            } else {
                return resolve (data.Items);
            }
        });
    });
}