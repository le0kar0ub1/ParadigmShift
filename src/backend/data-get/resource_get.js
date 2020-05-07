"use strict";

/* [ENVIRRONNEMENT VARIABLE] */
const DBID_CONTEXTDEF="paradigmshift-contextdef"
const DBID_RESOURCES="paradigmshift-resources" 
/* [ENVIRRONNEMENT VARIABLE] */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

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
        const contextID = event_array.contextID;
        const resources = await getContext(contextID);
        return callback(null, {
            statusCode: 200,
            body: JSON.stringify(resources),
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

function getContext(contextID)
{
    return dynamodb.getItem({
        Key : {
            "contextID": contextID
        },
        TableName: process.env.DBID_RESOURCES
    }).promise();
}