/*
 *
 * HomePage
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { isEmpty } from "lodash";
import { Header } from "@buffetjs/custom";
import {
  ContainerFluid,
  InputSearch,
  GlobalContext
} from "strapi-helper-plugin";

import pluginId from "../../pluginId";

// Plugin's component
import EntriesNumber from "../../components/EntriesNumber";
import List from "../../components/List";
import PluginInputFile from "../../components/PluginInputFile";
import { EntriesWrapper, Wrapper } from "./components";

import { getData, onDrop } from "./actions";
import selectHomePage from "./selectors";
import reducer from "./reducer";
import saga from "./saga";

export class HomePage extends React.Component {
  static contextType = GlobalContext;

  componentDidMount() {
    this.props.getData();
  }

  renderInputSearch = () => (
    <InputSearch
      autoFocus
      name="search"
      onChange={this.props.onSearch}
      placeholder="importer.HomePage.InputSearch.placeholder"
      style={{ marginTop: "-11px" }}
      value={this.props.search}
    />
  );

  render() {
    const { formatMessage } = this.context;

    return (
      <ContainerFluid className="container-fluid">
        <Wrapper>
          <Header
            title={{
              label: formatMessage({
                id: "importer.HomePage.title"
              })
            }}
            content={formatMessage({
              id: "importer.HomePage.description"
            })}
          />
        </Wrapper>
        <PluginInputFile
          name="files"
          onDrop={this.props.onDrop}
          showLoader={this.props.uploadFilesLoading}
        />
        <EntriesWrapper>
          <EntriesNumber number={this.props.entriesNumber} />
        </EntriesWrapper>
        <List data={this.props.uploadedFiles} />
      </ContainerFluid>
    );
  }
}

HomePage.defaultProps = {
  uploadedFiles: []
};

HomePage.propTypes = {
  getData: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  onDrop: PropTypes.func.isRequired,
  uploadedFiles: PropTypes.arrayOf(PropTypes.object),
  uploadFilesLoading: PropTypes.bool.isRequired
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getData,
      onDrop
    },
    dispatch
  );
}

const mapStateToProps = selectHomePage();

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = strapi.injectReducer({
  key: "homePage",
  reducer,
  pluginId
});
const withSaga = strapi.injectSaga({ key: "homePage", saga, pluginId });

export default compose(withReducer, withSaga, withConnect)(HomePage);
