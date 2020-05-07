"use strict";

/* [ENVIRRONNEMENT VARIABLE] */
const DBID_CONTEXTDEF="paradigmshift-contextdef"
const DBID_RESOURCES="paradigmshift-resources" 
/* [ENVIRRONNEMENT VARIABLE] */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const uuidv4 = require('uuid/v4');

exports.handler = async (event, context, callback) =>
{
    let event_array;
    try { event_array = JSON.parse(event.body); }
    catch (err) {
        return callback(null, {
            statusCode: 500,
            body: JSON.stringify("Bad data format"),
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'}
        });
    }
    try {
        /* let's checkup if all informations are here */
        const contextID              = event_array.contextID;
        const contextDesc            = event_array.contextDesc;
        const schedulingRule         = event_array.schedulingRule;
        const powerState             = event_array.powerState;
        const isScheluderActive      = event_array.isScheluderActive;

        await registerContext(contextID, schedulingRule, schedulingRule, contextDesc, powerState, isScheluderActive);
        return callback(null, {
            statusCode: 200,
            body: JSON.stringify("Success"),
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'}
        })
    } catch(err) {
        return callback(err, {
            statusCode: 500,
            body: JSON.stringify("Bad data format"),
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'}
        });
    }
};

function registerContext(contextID, schedulingRule, schedulingRule, contextDesc, powerState, isScheluderActive)
{
    return dynamodb.put({
        Item: {
            "contextID"              : contextID,
            "contextDesc"            : contextDesc,
            "schedulingRule"         : schedulingRule,
            "powerState"             : powerState,
            "isScheluderActive"      : isScheluderActive,
            "lastScheduling"         : Date.now()
        },
        TableName: process.env.DBID_CONTEXTDEF
    }).promise();
}

function registerResources(contextID, resources)
{
    return dynamodb.put({
        Item: {
            "contextID" : contextID,
            "ec2"       : resources.ec2,
            "rds"       : resources.rds,
            "fleet"     : resources.fleet,
        },
        TableName: process.env.DBID_RESOURCES
    }).promise();
}

function generateUUID()
{
    return uuidv4().substring(0,31);
}