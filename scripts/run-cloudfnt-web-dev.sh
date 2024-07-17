
if [ $# -lt 1 ]; then
	echo "usage:$0 [tag]"
	exit 1
fi
tag=$1
host_adc_path="/Users/dongin/.config/gcloud/application_default_credentials.json"
host_credential_path="/Users/dongin/Downloads/ineeji-cloudai-test-ba6631d89c7a.json"
port=19871
docker run -d -p ${port}:9871  -v "${host_adc_path}":/app/adc.json -v "${host_credential_path}":/certs/signed_url_credentials.json $tag

