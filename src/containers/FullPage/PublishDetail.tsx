import ContentstackAppSDK from "@contentstack/app-sdk";

import React, { useEffect, useState } from "react";

const PublishDetail = ({
  selectedLocale,
  environments,
  contentType,
  entryUid,
}: any) => {
  const [locale, setLocale] = useState("");
  const [publishStatus, setPublishStatus] = useState<any[]>([]);
  function getPublishingDetails(
    selectedLocale: any,
    publishingDetails: any,
    environmentsDetail: any
  ) {
    console.log(selectedLocale);
    // Filter the publishing details based on the selected locale
    const filteredDetails = publishingDetails.filter(
      (detail: any) => detail.locale === selectedLocale
    );

    console.log(filteredDetails);
    // Map through the filtered details to get the version and environment name
    const result = filteredDetails.map((detail: any) => {
      const environmentName =
        environmentsDetail[detail.environment] || "Unknown Environment";
      return {
        version: detail.version,
        environment: environmentName,
      };
    });

    return result;
  }
  useEffect(() => {
    ContentstackAppSDK.init().then(async (appSdk) => {
      if (selectedLocale) {
        const { entry } = await appSdk?.stack
          ?.ContentType(contentType)
          .Entry(entryUid)
          .only("locale")
          .addParam("include_publish_details", "true")
          .addParam("locale", selectedLocale?.code)
          .fetch();

        console.log(entry);
        setLocale(entry.locale);
        // console.log(locale)

        const publish_status = getPublishingDetails(
          selectedLocale.code,
          entry.publish_details,
          environments
        );
        console.log(publish_status);
        console.log(environments);
        setPublishStatus(publish_status);
      }
    });
  }, [selectedLocale]);

  return (
    <div className="container">
      <div>
        <div>  {locale && <span>Published Locale: {locale}</span>}</div>
       
       <br />
        {publishStatus.length > 0 ? (
          <div className="publishing_details">
            {publishStatus.map((detail, index) => (
              <div key={index} className="detail_card">
                <p>
                  <strong>Environment:</strong> {detail.environment}
                </p>
                <p>
                  <strong>Version:</strong> {detail.version}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No publishing details found for the selected locale.</p>
        )}
      </div>
    </div>
  );
};

export default PublishDetail;
