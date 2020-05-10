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
        const type = event.data.type;
        const contextID = event.data.contextID;
        var data;
        if (type === "context") {
            if (contextID === "restricted-all")
                data = await scanDatabase(process.env.DBID_CONTEXTDEF);
            else
                data = await getDatabase(contextID, process.env.DBID_CONTEXTDEF);
        } else if (type === "resource") {
            data = await getDatabase(contextID, process.env.DBID_RESOURCES);
        } else { 
            return callback(null, {
                statusCode: 500,
                body: "Bad data format",
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
            body: "Bad data format",
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'}
        });
    }
};

function getDatabase(contextID, database)
{
    return new Promise((resolve, reject) => {
        dynamodb.get({
            Key: {
                "contextID": contextID
            },
            TableName: database
        }, function(err, data) {
            if (err)
                return reject (err);
            else
                return resolve (data.Item);
        });
    });
}

/*
** Yeah, ugly...
** Think about an other way to achieve this part
*/
function scanDatabase(database)
{
    return new Promise((resolve, reject) => {
        dynamodb.scan({
            TableName: database
        }, function(err, data) {
            if (err)
                return reject (err);
            else
                return resolve (data.Items);
        });
    });
}