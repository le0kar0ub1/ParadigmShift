"use strict";

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) =>
{
    try {
        const tagKey = event.tagKey;
        await unregisterTag(tagKey);
        return callback(null, {
            statusCode: 200,
            body: "Success",
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
        })
    } catch(err) {
        return callback(err, {
            statusCode: 500,
            body: "Bad data format",
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
        });
    }
};

function unregisterTag(tagKey)
{
    return new Promise((resolve, reject) => {
        dynamodb.deleteItem({
            Key : {
                "tagKey": tagKey
            },
            TableName: process.env.DBID_TAGDEF
        }, function(err, data) {
            if (err)
                return reject (err);
            else
                return resolve (true);
        });
    });
}