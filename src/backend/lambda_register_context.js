"use strict";

/* [ENVIRRONNEMENT VARIABLE] */
const DDB_ID="ParadigmShift-context" 
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
            body: JSON.stringify("An Error Occured"),
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'}
        });
    }
    try {
        /* let's checkup if all informations are here */
        const appName           = event_array.appName;
        const resource          = event_array.resource;
        const attribut          = event_array.attribut;
        const description       = event_array.description;
        const powerState        = event_array.powerState;
        const isScheluderActive = event_array.isScheluderActive;

        await write_database(appName, resource, attribut, description, powerState, isScheluderActive);
        return callback(null, {
            statusCode: 200,
            body: JSON.stringify("Successed"),
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'}
        })
    } catch(err) {
        return callback(err, {
            statusCode: 500,
            body: JSON.stringify("An Error Occured"),
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'}
        });
    }
};

function write_database(appName, resource, attribut, description, powerState, isScheluderActive)
{
    return dynamodb.put({
        Item: {
            "appName"           : appName,
            "resource"          : resource,
            "attribut"          : attribut,
            "description"       : description,
            "powerState"        : powerState,
            "isScheluderActive" : isScheluderActive
        },
        TableName: process.env.DynamoDB_ID
    }).promise();
}

function generateUUID()
{
    return uuidv4().substring(0,31);
}