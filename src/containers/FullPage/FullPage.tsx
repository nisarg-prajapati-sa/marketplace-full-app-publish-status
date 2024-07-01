// import "./styles.scss";

// import { useEffect, useMemo, useState } from "react";

// import ContentstackAppSDK from "@contentstack/app-sdk";
// import { InfiniteScrollTable } from "@contentstack/venus-components";
// import { Select } from "@contentstack/venus-components";
// //import TableComponent from "@contentstack/venus-components/I";

// const FullPageExtension = () => {
//   const [state, setState] = useState<any>({
//     config: {},
//     location: {},
//     appSdkInitialized: false,
//   });

//   const [contentTypes, setContentTypes] = useState<any[]>();
//   const [contentTypeOptions, setContentTypeOptions] = useState<any[]>([]);
//   const [selectedContentType, setSelectedContentType] = useState<any>("");
//   const [entriesData, setEntriesData] = useState<any[]>([]);
//   const [publishingEnvs, setPublishingEnvs] = useState<any[]>([]);
//   const [locales, setLocales] = useState<any[]>([]);
//   const columns = useMemo(
//     () => [
//       {
//         Header: "Title",
//         accessor: "title",
//         columnWidthMultiplier: 1.9,
//       },
//       {
//         Header: "UID",
//         accessor: "uid",
//         id: "uid",
//         columnWidthMultiplier: 1.5,
//       },
//       ...locales.map((locale) => ({
//         Header: locale.code,
//         accessor: (obj: any) =>
//           (
//             obj.publish_details.find((pd: any) => pd.locale === locale.code)
//               ?.environments || []
//           ).join(", "),
//         id: locale.code,
//         columnWidthMultiplier: 2,
//       })),
//     ],
//     [locales]
//   );
//   const transformPublishDetails = (
//     publishDetails: any,
//     publishingEnvs: any
//   ) => {
//     const grouped = publishDetails.reduce((acc: any, detail: any) => {
//       console.log(detail);
//       const { locale, environment, version } = detail;
//       if (!acc[locale]) {
//         acc[locale] = { locale, environments: [] };
//       }
//       acc[locale].environments.push(
//         publishingEnvs[environment] + "-" + version
//       );
//       return acc;
//     }, {});

//     return Object.values(grouped);
//   };

//   const getEntriesOfAContentType = async (contentTypeUid: any) => {
//     let { entries } =
//       (await state?.location?.FullPage?.stack
//         ?.ContentType(contentTypeUid)
//         .Entry.Query()
//         .addParam("include_metadata", "true")
//         .addParam("include_publish_details", "true")
//         .find()) || {};
//     entries = entries.map((entry: any) => {
//       const transformedPublishDetails = transformPublishDetails(
//         entry.publish_details,
//         publishingEnvs
//       );
//       console.log(transformedPublishDetails, "dsddd");
//       return { ...entry, publish_details: transformedPublishDetails };
//     });
//     setEntriesData(entries);

//     console.log(entries);
//   };

//   useEffect(() => {
//     ContentstackAppSDK.init().then(async (appSdk) => {
//       const config = await appSdk?.getConfig();
//       setState({
//         config,
//         location: appSdk?.location,
//         appSdkInitialized: true,
//       });
//       const { content_types } =
//         (await appSdk?.location?.FullPage?.stack?.getContentTypes()) || {};

//       const { locales } =
//         (await appSdk?.location?.FullPage?.stack?.getLocales()) || {};
//       console.log(locales);
//       setLocales(locales);
//       // console.log(locales);
//       // const locale_columns = locales.map((locale: any) => ({
//       //   Header: locale.code,
//       //   accessor: locale.code,
//       //   id: locale.code,
//       //   columnWidthMultiplier: 1.5,
//       // }));
//       // const updated_columns = [...columns, ...locale_columns];
//       // console.log(updated_columns);
//       // setColumns(updated_columns);
//       let { environments } =
//         (await appSdk?.location?.FullPage?.stack?.getEnvironments()) || {};
//       console.log(environments);
//       environments = environments.reduce((acc: any, env: any) => {
//         acc[env.uid] = env.name;
//         return acc;
//       }, {});
//       console.log(environments);
//       setPublishingEnvs(environments);
//       setContentTypes(content_types);
//     });
//   }, []);

//   useEffect(() => {
//     if (!state.appSdkInitialized) return;
//     let dropdownOptions: any = [];
//     contentTypes?.forEach((contentType: any) => {
//       dropdownOptions.push({
//         label: contentType?.title,
//         value: contentType?.uid,
//       });
//     });
//     setContentTypeOptions(dropdownOptions);
//   }, [contentTypes]);

//   useEffect(() => {
//     if (!Object.keys(selectedContentType).length) return;
//     getEntriesOfAContentType(selectedContentType?.value);
//   }, [selectedContentType]);

//   useEffect(() => {
//     entriesData?.forEach(
//       (_: any, index: any) => (itemStatusMap[index] = "loaded")
//     );
//   }, [entriesData]);

//   const handleDropdownChange = (e: any) => {
//     setSelectedContentType(e);
//   };

//   let itemStatusMap: any = {};

//   return (
//     <div className="full-page">
//       <div className="full-page-container">
//         <div className="full-page-header">
//           <Select
//             options={contentTypeOptions}
//             value={selectedContentType}
//             onChange={handleDropdownChange}
//             placeholder="Select Content Type"
//             selectLabel="Content Type"
//           />
//         </div>
//         <div className="full-page-body">
//           <InfiniteScrollTable
//             data={entriesData}
//             columns={columns}
//             uniqueKey={"uid"}
//             totalCounts={entriesData.length}
//             fetchTableData={() => {}}
//             loadMoreItems={() => {}}
//             itemStatusMap={itemStatusMap}
//             canResize
//             v2Features={{
//               isNewEmptyState: true,
//               pagination: true,
//             }}
//             rowPerPageOptions={[30, 50, 100]}
//             onChangePagination={(params: any) => {
//               console.log(params);
//             }}
//             //minBatchSizeToFetch={30}
//             canSearch
//           />
//         </div>
//       </div>
//     </div>
//   );
// };
// export default FullPageExtension;

import "./styles.scss";

import { useEffect, useMemo, useState } from "react";

import ContentstackAppSDK from "@contentstack/app-sdk";
import { InfiniteScrollTable } from "@contentstack/venus-components";
import { Select } from "@contentstack/venus-components";

const FullPageExtension = () => {
  const [state, setState] = useState<any>({
    config: {},
    location: {},
    appSdkInitialized: false,
  });

  const [contentTypes, setContentTypes] = useState<any[]>();
  const [contentTypeOptions, setContentTypeOptions] = useState<any[]>([]);
  const [selectedContentType, setSelectedContentType] = useState<any>("");
  const [entriesData, setEntriesData] = useState<any[]>([]);
  const [currentPageData, setCurrentPageData] = useState<any[]>([]);
  const [publishingEnvs, setPublishingEnvs] = useState<any[]>([]);
  const [locales, setLocales] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    pageSize: 30,
    page: 1,
  });
  const [totalEntries, setTotalEntries] = useState(0);

  const columns = useMemo(
    () => [
      {
        Header: "Title",
        accessor: "title",
        columnWidthMultiplier: 1.9,
        disableResizing: false,
        width:400
      },
      {
        Header: "UID",
        accessor: "uid",
        id: "uid",
        columnWidthMultiplier: 1.5,
        width:225
      },
      ...locales.map((locale) => ({
        Header: locale.code,
        accessor: (obj: any) =>
          (
            obj.publish_details.find((pd: any) => pd.locale === locale.code)
              ?.environments || []
          ).join(", "),
        id: locale.code,
        columnWidthMultiplier: 2,
      })),
    ],
    [locales]
  );

  const transformPublishDetails = (
    publishDetails: any,
    publishingEnvs: any
  ) => {
    const grouped = publishDetails.reduce((acc: any, detail: any) => {
      const { locale, environment, version } = detail;
      if (!acc[locale]) {
        acc[locale] = { locale, environments: [] };
      }
      acc[locale].environments.push(
        publishingEnvs[environment] + "-" + version
      );
      return acc;
    }, {});

    return Object.values(grouped);
  };

  const getEntriesOfAContentType = async (
    contentTypeUid: any,
    page: number,
    pageSize: number
  ) => {
    const response = await state?.location?.FullPage?.stack
      ?.ContentType(contentTypeUid)
      .Entry.Query()
      .addParam("include_metadata", "true")
      .addParam("include_publish_details", "true")
      .find();

    let { entries } = response || {};
    const count = entries.length;
    entries = entries.map((entry: any) => {
      const transformedPublishDetails = transformPublishDetails(
        entry.publish_details,
        publishingEnvs
      );
      return { ...entry, publish_details: transformedPublishDetails };
    });

    const currentPageEntries = entries.slice(0, 30);
    setCurrentPageData(currentPageEntries);
    setEntriesData(entries);
    console.log(count);
    setTotalEntries(count); // Update the total count of entries
  };

  useEffect(() => {
    ContentstackAppSDK.init().then(async (appSdk) => {
      const config = await appSdk?.getConfig();
      setState({
        config,
        location: appSdk?.location,
        appSdkInitialized: true,
      });
      const { content_types } =
        (await appSdk?.location?.FullPage?.stack?.getContentTypes()) || {};

      const { locales } =
        (await appSdk?.location?.FullPage?.stack?.getLocales()) || {};
      setLocales(locales);

      let { environments } =
        (await appSdk?.location?.FullPage?.stack?.getEnvironments()) || {};
      environments = environments.reduce((acc: any, env: any) => {
        acc[env.uid] = env.name;
        return acc;
      }, {});
      setPublishingEnvs(environments);
      setContentTypes(content_types);
    });
  }, []);

  useEffect(() => {
    if (!state.appSdkInitialized) return;
    let dropdownOptions: any = [];
    contentTypes?.forEach((contentType: any) => {
      dropdownOptions.push({
        label: contentType?.title,
        value: contentType?.uid,
      });
    });
    setContentTypeOptions(dropdownOptions);
  }, [contentTypes]);

  useEffect(() => {
    if (!Object.keys(selectedContentType).length) return;
    getEntriesOfAContentType(
      selectedContentType?.value,
      pagination.page,
      pagination.pageSize
    );
  }, [selectedContentType, pagination]);

  useEffect(() => {
    entriesData?.forEach(
      (_: any, index: any) => (itemStatusMap[index] = "loaded")
    );
  }, [entriesData]);

  const handleDropdownChange = (e: any) => {
    setSelectedContentType(e);
  };

  const handlePaginationChange = ({ pageSize, page }: any) => {
    setPagination({ pageSize, page });
  };

  let itemStatusMap: any = {};

  return (
    <div className="full-page">
      <div className="full-page-container">
        <div className="full-page-header">
          <Select
            options={contentTypeOptions}
            value={selectedContentType}
            onChange={handleDropdownChange}
            placeholder="Select Content Type"
            selectLabel="Content Type"
          />
        </div>
        <div className="full-page-body">
          <InfiniteScrollTable
            data={currentPageData}
            columns={columns}
            uniqueKey={"uid"}
            totalCounts={totalEntries} // Use totalEntries for totalCounts
            fetchTableData={({ startIndex, endIndex }: any) => {
               setCurrentPageData(entriesData.slice(startIndex,endIndex))
            }}
            loadMoreItems={(params: any) => {
              console.log(params);
            }}
            // itemStatusMap={itemStatusMap}
            canResize
            v2Features={{
              isNewEmptyState: true,
              pagination: true,
            }}
            rowPerPageOptions={[30, 50, 100]}
            onChangePagination={({ page, pageSize }: any) => {
              const startIndex = (page - 1) * pageSize;
              const endIndex = page * pageSize;

              setCurrentPageData(entriesData.slice(startIndex, endIndex));
            }}
            canSearch
            isResizable
            
          />
        </div>
      </div>
    </div>
  );
};

export default FullPageExtension;
