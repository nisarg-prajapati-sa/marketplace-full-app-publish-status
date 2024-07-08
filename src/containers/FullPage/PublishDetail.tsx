import ContentstackAppSDK from "@contentstack/app-sdk";
import { InfiniteScrollTable } from "@contentstack/venus-components";

import React, { useEffect, useMemo, useState } from "react";

const PublishDetail = ({
  locales,
  environments,
  environmentsMapping,
  contentType,
  entryUid,
}: any) => {
  console.log(
    locales,
    environments,
    environmentsMapping,
    contentType,
    entryUid
  );

  const [publishStatus, setPublishStatus] = useState<any[]>([]);
  const [entryTitle, setEntryTitle] = useState(null);

  const columns = useMemo(
    () => [
      {
        Header: "Locales",
        accessor: "locale",
        columnWidthMultiplier: 1.9,
        disableResizing: false,
        width: 400,
      },
      ...environments.map((env: any) => ({
        Header: env.name,
        accessor: (obj: any) => {
            const data = obj.publishing_details.filter((pub:any)=>(pub.environment == env.name));
          return (
            <div className="pub-status-list">
              {data.length > 0 ? (
                data.map((item: any) => {
                  return <span>{item.details}</span>;
                })
              ) : (
                <span>Not Published</span>
              )}
            </div>
          
          );
        },
        id: env.uid,
        columnWidthMultiplier: 2,
      })),
    ],
    [environments]
  );
  function getPublishingDetails(
    selectedLocale: any,
    publishingDetails: any,
    environmentsDetail: any,
    publishedLocale: any
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
        details: publishedLocale + " " + detail.version,
        environment: environmentName,
      };
    });

    const resultWithLocale = {
      locale: selectedLocale,
      publishing_details: result,
    };
    return resultWithLocale;
  }
  useEffect(() => {
    const fetchPublishDetails = async () => {
      try {
        const appSdk = await ContentstackAppSDK.init();
        if (locales) {
          const publishDetailsPromises = locales.map(async (locale: any) => {
            const { entry } = await appSdk?.stack
              ?.ContentType(contentType)
              .Entry(entryUid)
              .only("locale")
              .addParam("include_publish_details", "true")
              .addParam("locale", locale?.code)
              .fetch();

            console.log(entry);

            let publishStatus = getPublishingDetails(
              locale.code,
              entry.publish_details,
              environmentsMapping,
              entry.locale
            );
            (publishStatus as any)["publishedLocale"] = entry.locale;
            console.log(publishStatus);
            return publishStatus;
          });

          const publishDetails = await Promise.all(publishDetailsPromises);
          console.log(publishDetails);
          setPublishStatus(publishDetails);
        }
      } catch (error) {
        console.error("Error fetching publish details:", error);
      }
    };

    fetchPublishDetails();
  }, [locales, contentType, entryUid, environmentsMapping, environments]);

  return (
    <div className="container">
      {publishStatus.length > 0 ? (
        <div>
          <InfiniteScrollTable
            data={publishStatus}
            columns={columns}
            uniqueKey={"locale"}
            //   totalCounts={totalEntries}
            fetchTableData={({ searchText }: any) => {
              //   setSearchText(searchText);
            }}
            loadMoreItems={(params: any) => {
              console.log(params);
            }}
            canResize
            v2Features={{
              isNewEmptyState: true,
              pagination: true,
            }}
            rowPerPageOptions={[30, 50, 100]}
            //   onChangePagination={({ page, pageSize }: any) => {
            //     const startIndex = (page - 1) * pageSize;
            //     const endIndex = page * pageSize;
            //     setCurrentPageData(entriesData.slice(startIndex, endIndex));
            //   }}
            canSearch
            isResizable
            tableHeight={650}
            //   onRowClick={handleRowClick}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default PublishDetail;
