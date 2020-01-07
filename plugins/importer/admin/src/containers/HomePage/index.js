/*
 *
 * HomePage
 *
 */

import React, { memo } from "react";
// import PropTypes from 'prop-types';
import pluginId from "../../pluginId";

const HomePage = () => {
  return (
    <div>
      <h1>{pluginId}&apos;s HomePage</h1>
      <input
        type="file"
        id="importee"
        name="importee"
        accept="image/png, image/jpeg"
      />
      <button>IMPORTeeee!!!!</button>
    </div>
  );
};

export default memo(HomePage);
