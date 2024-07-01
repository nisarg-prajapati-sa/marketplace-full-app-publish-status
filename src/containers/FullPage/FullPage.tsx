import "./styles.scss";

import { useEffect, useMemo, useState } from "react";

import ContentstackAppSDK from "@contentstack/app-sdk";
import {
  Button,
  Icon,
  InfiniteScrollTable,
} from "@contentstack/venus-components";
import { Select } from "@contentstack/venus-components";
import { spawn } from "child_process";
import Dashboard from "./Dashboard";
import { Route, Routes } from "react-router-dom";
import EntryView from "./EntryView";

const FullPageExtension = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/entry/:contentType/:entryUid" element={<EntryView />} />
    </Routes>
  );
};

export default FullPageExtension;
