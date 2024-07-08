import ContentstackAppSDK from "@contentstack/app-sdk";
import { InfiniteScrollTable, Search } from "@contentstack/venus-components";
import React, { useEffect, useMemo, useState } from "react";

const PublishDetail = ({
  locales,
  environments,
  environmentsMapping,
  contentType,
  entryUid,
}: any) => {
  const [totalEntries, setTotalEntries] = useState(0);
  const [publishStatus, setPublishStatus] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    pageSize: 30,
    page: 1,
  });
  const [searchText, setSearchText] = useState("");

  const columns = useMemo(
    () => [
      {
        Header: "Locales",
        accessor: "locale",
        columnWidthMultiplier: 1.9,
        disableResizing: false,
      },
      ...environments.map((env: any) => ({
        Header: env.name,
        accessor: (obj: any) => {
          const data = obj.publishing_details.filter(
            (pub: any) => pub.environment === env.name
          );
          return (
            <div className="pub-status-list">
              {data.length > 0 ? (
                data.map((item: any) => (
                  <span key={item.details}>{item.details}</span>
                ))
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

  const getPublishingDetails = (
    selectedLocale: any,
    publishingDetails: any,
    environmentsDetail: any,
    publishedLocale: any
  ) => {
    const filteredDetails = publishingDetails.filter(
      (detail: any) => detail.locale === selectedLocale
    );

    const result = filteredDetails.map((detail: any) => ({
      details: `${publishedLocale} ${detail.version}`,
      environment:
        environmentsDetail[detail.environment] || "Unknown Environment",
    }));

    const resultWithLocale = {
      locale: selectedLocale,
      publishing_details: result,
    };
    return resultWithLocale;
  };

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

          let publishStatus = getPublishingDetails(
            locale.code,
            entry.publish_details,
            environmentsMapping,
            entry.locale
          );
          (publishStatus as any)["publishedLocale"] = entry.locale;
          return publishStatus;
        });

        const publishDetails = await Promise.all(publishDetailsPromises);
        setTotalEntries(publishDetails.length);
        setPublishStatus(publishDetails);
      }
    } catch (error) {
      console.error("Error fetching publish details:", error);
    }
  };

  useEffect(() => {
    fetchPublishDetails();
  }, [locales, contentType, entryUid, environmentsMapping]);

  const handleSearch = (searchText: string) => {
    setSearchText(searchText);
  };

  const filteredData = useMemo(() => {
    let filtered = publishStatus;
    if (searchText) {
      filtered = filtered.filter((item) =>
        item.locale.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    setTotalEntries(filtered.length);
    return filtered;
  }, [publishStatus, searchText]);

  const handlePaginationChange = ({ page, pageSize }: any) => {
    setPagination({ page, pageSize });
  };

  const currentPageData = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [pagination, filteredData]);

  return (
    <div className="container">
      <div>
        <InfiniteScrollTable
          data={currentPageData}
          columns={columns}
          uniqueKey="locale"
          fetchTableData={({ searchText }: any) => {
            setSearchText(searchText);
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
          onChangePagination={handlePaginationChange}
          canSearch
          isResizable
          tableHeight={650}
          totalCounts={totalEntries}
          searchPlaceholder={"Search Locale (Eg. en-us)"}
        />
      </div>
    </div>
  );
};

export default PublishDetail;
