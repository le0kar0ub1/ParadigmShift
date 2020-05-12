"use strict";

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

function invokeLambda(func, playload)
{
    return new Promise((resolve, reject) => {
        var params = {
            FunctionName: func,
            InvocationType: 'RequestResponse',
            Payload: JSON.stringify(playload)
        };
        lambda.invoke(params, function(err, data) {
            if (err)
                return reject (err);
            else
                return resolve (data.Payload);
        });
    });
}

async function scheduleResources(action, resources)
{
    try {
        const ec2 = resources["ec2::instance"];
        for (let inc in ec2.id)
        {
            if (ec2.isScheduled[inc] == true)
            {
                await invokeLambda('ec2handler', ec2.id[inc]);
            }
        }
    } catch (err) {}
}

exports.handler = async (event, context, callback) =>
{
    try {
        scheduleResources(event.action, event.resources);
        return callback(null, {
            statusCode: 200,
            body: "Success",
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'}
        });
    } catch (err) {
        return callback(err, {
            statusCode: 500,
            body: JSON.stringify(err),
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'}
        });
    }
};
