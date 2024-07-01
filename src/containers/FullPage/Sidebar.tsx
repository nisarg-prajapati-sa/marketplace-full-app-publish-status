import { Icon, ListRow, Search } from "@contentstack/venus-components";
import React from "react";

const Sidebar = ({ locales, setSelectedLocale }: any) => {
  return (
    <div className="sidebar" style={{ textAlign: "center" }}>
      <div className="search-bar-sidebar">
        <Search placeholder="Search for locale" type="secondary" />
      </div>
      <div className="locale-list-sidebar">
        {locales.map((locale: any) => (
          <ListRow
            active={false}
            content={`${locale.name} - ${locale.code}`}
            leftIcon={<Icon icon="Language" size="medium" version="v2" />}
            //newEntryIcon
            onClick={() => {
              setSelectedLocale({
                code: locale.code,
                name: locale.name,
              });
            }}
            version="v2"
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
