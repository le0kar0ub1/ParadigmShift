"use strict";

/* [ENVIRRONNEMENT VARIABLE] */
const DBID_CONTEXTDEF="paradigmshift-context"
const DBID_RESOURCES="paradigmshift-resource" 
/* [ENVIRRONNEMENT VARIABLE] */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const resourcegroupstaggingapi = new AWS.ResourceGroupsTaggingAPI();

function getResourcesByTag()
{
    return new Promise((resolve, reject) => {
        var params = {
          ExcludeCompliantResources: true || false,
          IncludeComplianceDetails: true || false,
          PaginationToken: 'STRING_VALUE',
          ResourceTypeFilters: [
            'STRING_VALUE',
            /* more items */
          ],
          ResourcesPerPage: 'NUMBER_VALUE',
          TagFilters: [
            {
              Key: 'STRING_VALUE',
              Values: [
                'STRING_VALUE',
                /* more items */
              ]
            },
            /* more items */
          ],
          TagsPerPage: 'NUMBER_VALUE'
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
        var allcontext = await getScheduledContext();
        for (let context in allcontext)
        {
            console.log(context);
            scheduleOneContext(context);
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
