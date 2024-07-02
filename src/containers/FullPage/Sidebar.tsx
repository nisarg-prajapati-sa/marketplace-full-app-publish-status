import { Icon, ListRow, Search } from "@contentstack/venus-components";
import React, { useCallback, useEffect, useState } from "react";
import { debounce } from "../../common/utils/functions";

const Sidebar = ({ locales, setSelectedLocale }: any) => {
//   let mockLocales: any[] = [];

//   for (let i = 0; i < 100; i++) {
//     mockLocales.push({
//       code: `locale_${i}`,
//       name: `locale_name_${i}`,
//     });
//   }
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLocales, setFilteredLocales] = useState(locales);
  const handleSearch = useCallback(
    debounce((query: any) => {
      setFilteredLocales(
        locales.filter((locale: any) =>
          `${locale.name} - ${locale.code}`
            .toLowerCase()
            .includes(query.toLowerCase())
        )
      );
    }, 300),
    [locales]
  );
  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  return (
    <div className="sidebar" style={{ textAlign: "center" }}>
      <div className="search-bar-sidebar">
        <Search
          placeholder="Search for locale"
          type="secondary"
          value={searchQuery}
          onChange={(e: any) => setSearchQuery(e)}
        />
      </div>
      <div className="locale-list-sidebar">
        {filteredLocales.map((locale: any) => (
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
