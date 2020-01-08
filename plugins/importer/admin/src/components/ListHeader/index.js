/**
 *
 * ListHeader
 *
 */

import React from "react";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";

import StyledLi from "./StyledLi";

function ListHeader({ changeSort, sort }) {
  const titles = [
    "hash",
    "name",
    "updated",
    "size",
    // 'related',
    "",
    ""
  ];

  const shouldDisplaySort = title =>
    (sort === `${title}:ASC` && "icon") ||
    (sort === `${title}:DESC` && "iconDesc") ||
    "";

  return (
    <StyledLi>
      <div className="listHeader">
        <div>
          <div />
          <div className={shouldDisplaySort("type")}>
            <FormattedMessage id="upload.ListHeader.type" />
            <span />
          </div>
        </div>
        {titles.map((title, key) => {
          if (title !== "") {
            return (
              <div key={key} className={shouldDisplaySort(title)}>
                <FormattedMessage id={`upload.ListHeader.${title}`} />
                <span />
              </div>
            );
          }

          return <div key={key} />;
        })}
      </div>
    </StyledLi>
  );
}

ListHeader.defaultProps = {
  changeSort: () => {}
};

ListHeader.propTypes = {
  changeSort: PropTypes.func
};

export default ListHeader;
