/**
 *
 * Li
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { CopyToClipboard } from "react-copy-to-clipboard";
import moment from "moment";

import { IcoContainer, PopUpWarning } from "strapi-helper-plugin";
import FileIcon from "../FileIcon";
import { StyledLi, Truncate, Wrapper, Checked } from "./components";

/* eslint-disable react/no-string-refs */
class Li extends React.Component {
  state = { isOpen: false, copied: false };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.copied !== this.state.copied && this.state.copied) {
      setTimeout(() => {
        this.setState({ copied: false });
      }, 3000);
    }
  }

  handleClick = e => {
    e.preventDefault();
    const aTag = document.getElementById(this.props.item.hash);
    aTag.click();
  };

  renderLiCopied = () => (
    <StyledLi withCopyStyle>
      <div>
        <Checked>
          <div />
        </Checked>
        <div>
          <FormattedMessage id="upload.Li.linkCopied" />
        </div>
      </div>
    </StyledLi>
  );

  render() {
    const { item } = this.props;

    if (this.state.copied) {
      return this.renderLiCopied();
    }

    const icons = [
      // {
      //   icoType: item.private ? 'lock' : 'unlock',
      //   onClick: () => {},
      // },
      {
        icoType: "eye",
        onClick: this.handleClick
      },
      {
        icoType: "trash",
        onClick: () => this.setState({ isOpen: true })
      }
    ];

    return (
      <CopyToClipboard
        text={item.url}
        onCopy={() => this.setState({ copied: true })}
      >
        <StyledLi>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "none" }}
            id={item.hash}
          >
            nothing
          </a>
          <Wrapper>
            <div>
              <div />
              <FileIcon fileType={item.ext} />
            </div>
            {["hash", "name", "updatedAt", ""].map((value, key) => {
              if (value === "updatedAt") {
                return (
                  <Truncate key={key}>
                    {moment(item.updatedAt || item.updated_at).format(
                      "YYYY/MM/DD - HH:mm"
                    )}
                  </Truncate>
                );
              }

              if (value !== "") {
                return <Truncate key={key}>{item[value]}</Truncate>;
              }

              return <IcoContainer key={key} icons={icons} />;
            })}
          </Wrapper>
          <PopUpWarning
            isOpen={this.state.isOpen}
            onConfirm={() => {}}
            toggleModal={() => this.setState({ isOpen: false })}
          />
        </StyledLi>
      </CopyToClipboard>
    );
  }
}

Li.defaultProps = {
  item: {
    type: "pdf",
    hash: "1234",
    name: "avatar.pdf",
    updated: "20/11/2017 19:29:54",
    size: "24 B",
    relatedTo: "John Doe"
  }
};

Li.propTypes = {
  item: PropTypes.object
};

export default Li;
