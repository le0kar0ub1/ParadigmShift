"use strict";

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const resourcegroupstaggingapi = new AWS.ResourceGroupsTaggingAPI();

const cron = require('cron-parser');

function getResourcesByTag(tag, values)
{
    return new Promise((resolve, reject) => {
        var params = {
            ResourceTypeFilters: [
              'ec2:instance',
              'rds:instance',
              'appstream:fleet'
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

exports.handler = async (event, context, callback) =>
{
    try {
        var alltags = await getScheduledTags();
        for (let tag in alltags)
        {
            console.log(tag);
            scheduleOneContext(tag);
        }
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