"use strict";

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) =>
{
    try {
        /* let's checkup if all informations are here */
        const contextID            = event.data.contextID;
        const contextDesc          = event.data.contextDesc;
        const schedulingRuleStart  = event.data.schedulingRuleStart;
        const schedulingRuleStop   = event.data.schedulingRuleStop;
        const powerState           = event.data.powerState;
        const isScheduled          = event.data.isScheduled;
        var   resources            = JSON.parse(event.data.resources);

        await registerContext(contextID, schedulingRuleStart, schedulingRuleStop, contextDesc, powerState, isScheduled);
        await registerResources(contextID,resources);
        return callback(null, {
            statusCode: 200,
            body: "Success",
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
        });
    } catch(err) {
        return callback(err, {
            statusCode: 500,
            body: "Bad data format",
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
        });
    }
};

function registerContext(contextID, schedulingRuleStart, schedulingRuleStop, contextDesc, powerState, isScheduled)
{
    return new Promise((resolve, reject) => {
        dynamodb.put({
            Item: {
                "contextID"           : contextID,
                "contextDesc"         : contextDesc,
                "schedulingRuleStart" : schedulingRuleStart,
                "schedulingRuleStop"  : schedulingRuleStop,
                "powerState"          : powerState,
                "isScheduled"         : isScheduled,
                "lastScheduling"      : Date.now()
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

function registerResources(contextID, resources)
{
    return new Promise((resolve, reject) => {
        dynamodb.put({
            Item: {
                "contextID"         : contextID,
                "ec2::instance"     : JSON.stringify(resources["ec2::instance"]),
                "rds::instance"     : JSON.stringify(resources["rds::instance"]),
                "appstream::fleet"  : JSON.stringify(resources["appstream::fleet"])
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