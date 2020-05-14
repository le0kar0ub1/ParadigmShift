"use strict";

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

function invokeLambda(handler, action, ids)
{
    return new Promise((resolve, reject) => {
        var params = {
            FunctionName: handler,
            InvocationType: 'RequestResponse',
            Payload: {
                action: action,
                ids: ids
            }
        };
        lambda.invoke(params, function(err, data) {
            if (err)
                return reject (err);
            else
                return resolve (data.Payload);
        });
    });
}

function getScheduledResources(data)
{
    var res = [];

    for (let i in data.id)
    {
        if (data.isScheduled[i] == true)
            res.push(data.id[i]);
    }
    return res;
}

async function scheduleResources(action, resources)
{
    const allres = ["ec2:instance","rds:instance", "appstream:fleet"]; // ENV: TARGETRESOURCES
    try {
        for (let res in allres)
        {
            const sched = getScheduledResources(allres[res]);
            const handler = "paradigmshift-" + (allres[res].split(":"))[0] + "-handler";
            if (shed.lenght != 0)
                await invokeLambda(handler, action, sched);
        }
    } catch (err) {
        console.log(err);
    }
}

exports.handler = async (event, context, callback) =>
{
    try {
        scheduleResources(event.action, event.resources);
        return callback(null, {
            statusCode: 200,
            body: "Success",
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
        });
    } catch (err) {
        return callback(err, {
            statusCode: 500,
            body: JSON.stringify(err),
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
        });
    }
};
