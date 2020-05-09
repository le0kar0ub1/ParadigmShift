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
        const contextID = event.contextID;
        await unregisterContext(contextID);
        await unregisterResources(contextID)
        return callback(null, {
            statusCode: 200,
            body: "Success",
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'}
        })
    } catch(err) {
        return callback(err, {
            statusCode: 500,
            body: "Bad data format",
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'}
        });
    }
};

function unregisterContext(contextID)
{
    return dynamodb.deleteItem({
        Key : {
            "contextID": contextID
        },
        TableName: process.env.DBID_CONTEXTDEF
    }).promise();
}

function unregisterResources(contextID)
{
    return dynamodb.deleteItem({
        Key : {
            "contextID": contextID
        },
        TableName: process.env.DBID_RESOURCES
    }).promise();
}