"use strict";

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) =>
{
    try {
        /* let's checkup if all informations are here */
        const tagKey               = event.data.tagKey;
        const tagValues            = event.data.tagValues;
        const tagDesc              = event.data.tagDesc;
        const schedulingRuleStart  = event.data.schedulingRuleStart;
        const schedulingRuleStop   = event.data.schedulingRuleStop;
        const powerState           = event.data.powerState;
        const isScheduled          = event.data.isScheduled;

        await registerTag(tagKey, tagValues, schedulingRuleStart, schedulingRuleStop, tagDesc, powerState, isScheduled);
        return callback(null, {
            statusCode: 200,
            body: "Success",
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

function registerTag(tagKey, schedulingRuleStart, schedulingRuleStop, tagDesc, powerState, isScheduled)
{
    return new Promise((resolve, reject) => {
        dynamodb.put({
            Item: {
                "tagKey"              : tagKey,
                "tagValues"           : tagValues,
                "tagDesc"             : tagDesc,
                "schedulingRuleStart" : schedulingRuleStart,
                "schedulingRuleStop"  : schedulingRuleStop,
                "powerState"          : powerState,
                "isScheduled"         : isScheduled,
                "lastScheduling"      : Date.now()
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