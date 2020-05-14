"use strict";

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const resourcegroupstaggingapi = new AWS.ResourceGroupsTaggingAPI();

const cron = require('cron-parser');

function invokeLambdaApplySched(playload, action)
{
    return new Promise((resolve, reject) => {
        var params = {
            FunctionName: func,
            InvocationType: 'RequestResponse',
            Payload: {
                type: action,
                data: JSON.stringify(playload)
            }
        };
        lambda.invoke(params, function(err, data) {
            if (err) {
                return reject (err);
            } else {
                return resolve (data.Payload);
            }
        });
    });
}

function getResourcesByTag(resource, tag, values)
{
    return new Promise((resolve, reject) => {
        var params = {
            ResourceTypeFilters: [
              resource
            ],
            TagFilters: [
              {
                Key: tag,
                Values: values
              }
            ],
        };
        resourcegroupstaggingapi.getResources(params, function(err, data) {
            if (err) 
                return reject (err);
            else
                return resolve (data);
        });
    });
}

function getIDfromARN(data)
{
    var ret = [];

    for (let i in data)
    {
        var current = data[i].split("/");
        ret.push(current[current.lenght - 1]);
    }
    return ret;
}

async function scheduleOnetag(tag)
{
    const allres = ["ec2:instance","rds:instance", "appstream:fleet"]; // ENV: TARGETRESOURCES
    var schedres = {};
    var action;

    if (tag.isScheduled == false)
        return;
    // check what do on this tag /!\
    for (let i in allres)
    {
        var res = getResourcesByTag(allres[i], tag.tagKey, tag.tagValues);
        var ids = getIDfromARN(res);
        schedres[allres[i]] = {
            id: ids,
            isScheduled: new Array(ids.lenght).fill(true),
            attrib: new Array(ids.lenght).fill("")
        };
    }
    invokeLambdaApplySched(schedres);
}

exports.handler = async (event, context, callback) =>
{
    try {
        var alltags = await getScheduledTags();
        for (let tag in alltags)
        {
            scheduleOnetag(alltags[tag]);
        }
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

/*
** Please, before any cry, read the datamodel documentation :)
*/
function getScheduledTags()
{
    return new Promise((resolve, reject) => {
        var params = {
            FilterExpression: "#isScheduled = :eqval",
            ExpressionAttributeNames: {
                "#isScheduled": "isScheduled",
            },
            ExpressionAttributeValues: {
                ":eqval": true
            },
            TableName: process.env.DBID_TAGDEF
        };
        dynamodb.scan(params, function(err, data) {
            if (err) {
                console.log("Error while reading database" + err);
                return reject (err);
            } else {
                return resolve (data.Items);
            }
        });
    });
}