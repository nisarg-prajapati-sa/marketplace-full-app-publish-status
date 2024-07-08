import ContentstackAppSDK from "@contentstack/app-sdk";
import {
  Button,
  Icon,
  PageHeader,
  PageLayout,
} from "@contentstack/venus-components";
import { forEach } from "lodash";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import PublishDetail from "./PublishDetail";

const EntryView = (props: any) => {
  const navigate = useNavigate();
  const { contentType, entryUid } = useParams();
  console.log();
  const [state, setState] = useState<any>({
    config: {},
    location: {},
    appSdkInitialized: false,
  });
  const [locales, setLocales] = useState<any[]>([]);
  const [environments, setEnvironments] = useState<any[]>([]);
  const [environmentsMapping, setEnvironmentsMapping] = useState(null);
  const [selectedLocale, setSelectedLocale] = useState<any>(null);
  useEffect(() => {
    ContentstackAppSDK.init().then(async (appSdk) => {
      const config = await appSdk?.getConfig();
      setState({
        config,
        location: appSdk?.location,
        appSdkInitialized: true,
      });
      const { locales } =
        (await appSdk?.location?.FullPage?.stack?.getLocales()) || {};
      setLocales(locales);

      let { environments } =
        (await appSdk?.location?.FullPage?.stack?.getEnvironments()) || {};
      const environmentsMapping = environments.reduce((acc: any, env: any) => {
        acc[env.uid] = env.name;
        return acc;
      }, {});

      locales.forEach((locale: any) => {});
      setEnvironmentsMapping(environmentsMapping);
      setEnvironments(environments);
      console.log(locales);
      console.log(environments);
    });
  }, []);

  return (
    <div className="entry-detail-view">
      <React.Fragment key=".0">
        <div>
          <div className="navigation-button">
            <Button
              buttonType="secondary"
              icon="BackArrow"
              onClick={() => {
                navigate("/full-page");
              }}
              size="small"
            >
              Back
            </Button>
          </div>
          <div className="layout-container">
            <PageLayout
              content={{
                component: (
                  <PublishDetail
                    selectedLocale={selectedLocale}
                    environments={environments}
                    environmentsMapping={environmentsMapping}
                    appSDKLocation={state.location}
                    contentType={contentType}
                    entryUid={entryUid}
                  />
                ),
              }}
              header={{
                component: (
                  <PageHeader
                    content=""
                    title={{
                      label: selectedLocale
                        ? ` Locale : ${selectedLocale?.name} - ${selectedLocale?.code}`
                        : "Publish Status",
                    }}
                  />
                ),
              }}
              //   leftSidebar={{
              //     component: (
              //       <Sidebar
              //         locales={locales}
              //         selectedLocale={selectedLocale}
              //         setSelectedLocale={setSelectedLocale}
              //       />
              //     ),
              //   }}
              type="list"
              version="v2"
            />
          </div>
        </div>
      </React.Fragment>
    </div>
  );
};

export default EntryView;
