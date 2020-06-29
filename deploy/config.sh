#
# Create the frontend `config.js` file
#

TARGET="../src/frontend/static/config.js"

rm -f $TARGET

touch $TARGET

# First we need the API endpoints 
echo -e "const API_CONTEXTGET_ENDPOINT=\"$apiendpoint/context-get\";" >> $TARGET
echo -e "const API_CONTEXTREGISTER_ENDPOINT=\"$apiendpoint/context-register\";" >> $TARGET
echo -e "const API_TAGGET_ENDPOINT=\"$apiendpoint/tag-get\";" >> $TARGET
echo -e "const API_TAGREGISTER_ENDPOINT=\"$apiendpoint/tag-register\";" >> $TARGET


# Then put the handled resources
# so far it's not useful but later that will allow us a deploy-time config for resources

echo -n "const resourceref = " >> $TARGET
cat resources-target.json >> $TARGET
echo ";" >> $TARGET