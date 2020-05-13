"use strict";

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
    return new Promise((resolve, reject) => {
        dynamodb.deleteItem({
            Key : {
                "contextID": contextID
            },
            TableName: process.env.DBID_CONTEXTDEF
        }, function(err, data) {
            if (err)
                return reject (err);
            else
                return resolve (true);
        });
    });
}

function unregisterResources(contextID)
{
    return new Promise((resolve, reject) => {
        dynamodb.deleteItem({
            Key : {
                "contextID": contextID
            },
            TableName: process.env.DBID_RESOURCES
        }, function(err, data) {
            if (err)
                return reject (err);
            else
                return resolve (true);
        });
    });
}