#
# Create the frontend `config.js` file
#

TARGET="../src/frontend/static/config.js"

rm -f $TARGET

##
## Set the script controlflow
##

function CLEANUP()
{
    rm -f $TARGET
}

function RAISE()
{
    CLEANUP
    echo "Process terminated, fatal error"
    exit 0
}

set -e

trap RAISE EXIT

# First we need the APIs endpoints 
echo -n "const API_BASEURL=" > $TARGET
echo -e "\"$theapiurl\"" >> $TARGET

echo -e "const API_CONTEXTGET_ENDPOINT=\"$theapiurl\"" >> $TARGET
echo -e "const API_CONTEXTREGISTER_ENDPOINT=\"$theapiurl\"" >> $TARGET

echo -en "
const resourceref = [
    \"ec2::instance\",
    \"rds::instance\",
    \"appstream::fleet\"
];" >> $TARGET

trap - EXIT