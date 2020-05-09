"use strict";

/* [ENVIRRONNEMENT VARIABLE] */
const DBID_CONTEXTDEF="paradigmshift-context";
const DBID_RESOURCES="paradigmshift-resource";
/* [ENVIRRONNEMENT VARIABLE] */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) =>
{
    try {
        /* let's checkup if all informations are here */
        const contextID        = event.data.contextID;
        const contextDesc      = event.data.contextDesc;
        const schedulingRule   = event.data.schedulingRule;
        const powerState       = event.data.powerState;
        const isScheduled      = event.data.isScheduled;
        var   resources        = JSON.parse(event.data.resources);

        await registerContext(contextID, schedulingRule, contextDesc, powerState, isScheduled);
        await registerResources(contextID,resources);
        return callback(null, {
            statusCode: 200,
            body: "Success",
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'}
        });
    } catch(err) {
        return callback(err, {
            statusCode: 500,
            body: "Bad data format",
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'}
        });
    }
};

function registerContext(contextID, schedulingRule, contextDesc, powerState, isScheduled)
{
    return dynamodb.put({
        Item: {
            "contextID"        : contextID,
            "contextDesc"      : contextDesc,
            "schedulingRule"   : schedulingRule,
            "powerState"       : powerState,
            "isScheduled"      : isScheduled,
            "lastScheduling"   : Date.now()
        },
        TableName: process.env.DBID_CONTEXTDEF
    }).promise();
}

function registerResources(contextID, resources)
{
    return dynamodb.put({
        Item: {
            "contextID" : contextID,
            "ec2::instance"     : JSON.stringify(resources["ec2::instance"]),
            "rds::instance"     : JSON.stringify(resources["rds::instance"]),
            "appstream::fleet"  : JSON.stringify(resources["appstream::fleet"])
        },
        TableName: process.env.DBID_RESOURCES
    }).promise();
}