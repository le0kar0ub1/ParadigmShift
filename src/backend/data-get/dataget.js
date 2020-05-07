"use strict";

/* [ENVIRRONNEMENT VARIABLE] */
const DBID_CONTEXTDEF="paradigmshift-context";
const DBID_RESOURCES="paradigmshift-resource";
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
        const type = event_array.type;
        const contextID = event_array.contextID;
        var data;
        if (type == "context") {
            data = await getDatabase(contextID, process.env.DBID_CONTEXTDEF);
        } else if (type == "resource") {
            data = await getDatabase(contextID, process.env.DBID_RESOURCES);
        } else { 
            return callback(null, {
                statusCode: 500,
                body: JSON.stringify("Bad data format"),
                headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'}
            });
        }
        return callback(null, {
            statusCode: 200,
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'}
        });
    } catch(err) {
        return callback(err, {
            statusCode: 500,
            body: JSON.stringify("Bad data format"),
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'}
        });
    }
};

function getDatabase(contextID, database)
{
    return dynamodb.getItem({
        Key : {
            "contextID": contextID
        },
        TableName: database
    }).promise();
}