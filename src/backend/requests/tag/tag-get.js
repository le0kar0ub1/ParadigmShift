"use strict";

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) =>
{
    try {
        const tagKey = event.data.tagKey;
        var data;
        if (tagKey === "restricted-all")
            data = await scanDatabase();
        else
            data = await getDatabase(tagKey);
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

function getDatabase(tagKey)
{
    return new Promise((resolve, reject) => {
        dynamodb.get({
            Key: {
                "tagKey": tagKey
            },
            TableName: process.env.DBID_TAGDEF
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
function scanDatabase()
{
    return new Promise((resolve, reject) => {
        dynamodb.scan({
            TableName: process.env.DBID_TAGDEF
        }, function(err, data) {
            if (err)
                return reject (err);
            else
                return resolve (data.Items);
        });
    });
}