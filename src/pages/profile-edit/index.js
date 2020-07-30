/* @flow */

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { graphql } from "react-apollo";
import { flowRight as compose } from "lodash";
import { withRouter } from "react-router-dom";
// import _ from "lodash";

import defaultCover from "../../resources/image/cover.png";
import defaultAvatar from "../../resources/image/avatar.png";
import Icon from "../../components/icon";
import { qGetUserByUsername, qGetUserActivity } from "../../graphql/query";
import { toggleAuthModal } from "../../redux/actions";
import "./index.scss";

const Img = "https://via.placeholder.com/150";

type Country = {
  id: number,
  name: string,
  country_code: string,
  dial_code: number,
}

type City = {
  id: number,
  name: string,
}

type User = {
  id: number,
  username: string,
  email: string,
  first_name: string,
  last_name: string,
  photo?: string,
  cover_image?: string,
  level: number,
  country: Country,
  city: City,
}

type State = {
  isLoggedin: boolean,
  editEmail: boolean,
  editLocation: boolean,
  editSiteURL: boolean,
  location: string,
  url_site: string,
  user: ?User
};

class EditProfile extends React.Component<any, State> {
  state: State = {
    isLoggedin: false,
    editEmail: false,
    editLocation: false,
    editSiteURL: false,
    location: `New York, United States`,
    url_site: `https://medium.com`,
    user: this.props.user.getUserByUsername
  };

  componentWillReceiveProps = async nextProps => {
    if (nextProps !== this.props) {
      const user: ?User = await nextProps.user.getUserByUsername;
      await this.setState({ user });
    }
  };

  render() {
    const { username } = this.props.match.params;
    let {
      editEmail,
      editLocation,
      editSiteURL,
      location,
      user,
      url_site
    } = this.state;

    if (!username) return null;

    // const user: ?User = this.props.user.getUserByUsername;
    const activity = this.props.activity.getUserActivity;
    if (!user || !activity) {
      return (
        <div className="not-found">
          <h3>{"This profile is not available"}</h3>
        </div>
      );
    }

    return (
      <div className="profile-edit">
        <div className="banner">
          <Link className="btn-actions" to={`/profile/${user.username}`}>
            <Icon className="icon" name="save" size={24} />
            Save Changes
          </Link>
          <Link className="btn-actions" to={`/profile/${user.username}`} >
            <Icon className="icon" name="delete" size={24} />
            Delete
          </Link>
          <Link to={""} className="btn-actions btn-edit">
            <Icon className="icon" name="edit" size={24} />
            Editing Profile
          </Link>
        </div>
        <div className="content">
          <div className="profile-ctn">
            <div className="actions">
              <Link className="btn-back" to={`/profile/${username}`} >
                <Icon className="icon" name="arrow_left" size={24} />
              </Link>
            </div>
            <div className="info">
              <div className="uploads">
                <div className="upload-bg">
                  <div className="bg-cover">
                    <img src={defaultCover} alt="" />
                    <div className="upload-title">
                      <div className="description">
                        <p className="text">Upload New</p>
                        <p className="text">Background Picture</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="upload-avatar">
                  <div className="up-avt">
                    <div className="bg-cover">
                      <img src={defaultAvatar} alt="" />
                      <div className="up-avt-ctn">
                        <div className="description">
                          <p className="text">Upload New</p>
                          <p className="text">Profile Picture</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="write-description">
                <textarea placeholder="About Me..." rows={6} />
              </div>

              <div className="contact">
                <div className="line">
                  <Icon className="icon" name="open_link" size={24} />

                  {editSiteURL ? (
                    <input
                      className="input-text"
                      autoFocus
                      value={url_site || ""}
                      onKeyPress={e =>
                        e.key === "Enter" &&
                        this.setState({ editSiteURL: false })
                      }
                      onChange={e => {
                        this.setState({
                          url_site: e.target.value
                        });
                      }}
                      onBlur={() => this.setState({ editSiteURL: false })}
                    />
                  ) : (
                    <>
                      <a href={`mailto:${url_site}`} className="link">
                        {url_site}
                      </a>
                      <Icon
                        className="icon"
                        name="edit"
                        size={18}
                        onClick={() => this.setState({ editSiteURL: true })}
                      />
                    </>
                  )}
                </div>

                <div className="line">
                  <Icon className="icon" name="mail" size={24} />

                  {editEmail ? (
                    <input
                      className="input-text"
                      autoFocus
                      value={user.email || ""}
                      onKeyPress={e =>
                        e.key === "Enter" && this.setState({ editEmail: false })
                      }
                      onChange={e => {
                        this.setState({
                          user: { ...user, email: e.target.value }
                        });
                      }}
                      onBlur={() => this.setState({ editEmail: false })}
                    />
                  ) : (
                    <>
                      <a href={`mailto:${user.email}`} className="link">
                        {user.email}
                      </a>
                      <Icon
                        className="icon"
                        name="edit"
                        size={18}
                        onClick={() => this.setState({ editEmail: true })}
                      />
                    </>
                  )}
                </div>

                <div className="line">
                  <Icon className="icon" name="location" size={24} />
                  {!editLocation && (
                    <>
                      <span className="label lb-location">{location}</span>
                      <Icon
                        className="icon"
                        name="edit"
                        size={18}
                        onClick={() => this.setState({ editLocation: true })}
                      />
                    </>
                  )}

                  {editLocation && (
                    <input
                      className="input-text"
                      autoFocus
                      onKeyPress={e =>
                        e.key === "Enter" &&
                        this.setState({ editLocation: false })
                      }
                      value={location || ""}
                      onChange={e => {
                        this.setState({ location: e.target.value });
                      }}
                      onBlur={() => this.setState({ editLocation: false })}
                    />
                  )}
                </div>
              </div>

              <div className="photos">
                <div className="line">
                  <Icon className="icon" name="photo" size={24} />
                  <span className="label">{"Visible Photos and video"}</span>
                </div>
                <div className="list-photos">
                  <div className="photo-item">
                    <img src={Img} alt="" />
                    <Link to="#" className="btn-hide">Hide</Link>
                  </div>
                  <div className="photo-item">
                    <img src={Img} alt="" />
                    <Link to="#" className="btn-hide">Hide</Link>
                  </div>
                  <div className="photo-item">
                    <img src={Img} alt="" />
                    <Link to="#" className="btn-hide">Hide</Link>
                  </div>
                  <div className="photo-item">
                    <img src={Img} alt="" />
                    <Link to="#" className="btn-hide">Hide</Link>
                  </div>
                  <div className="photo-item">
                    <img src={Img} alt="" />
                    <Link to="#" className="btn-hide">Hide</Link>
                  </div>
                  <div className="photo-item">
                    <img src={Img} alt="" />
                    <Link to="#" className="btn-hide">Hide</Link>
                  </div>
                  <div className="photo-item">
                    <img src={Img} alt="" />
                    <Link to="#" className="btn-hide">Hide</Link>
                  </div>
                  <div className="photo-item">
                    <img src={Img} alt="" />
                    <Link to="#" className="btn-hide">Hide</Link>
                  </div>
                  <div className="photo-item">
                    <img src={Img} alt="" />
                    <Link to="#" className="btn-hide">Hide</Link>
                  </div>
                  <div className="photo-item">
                    <img src={Img} alt="" />
                    <Link to="#" className="btn-hide">Hide</Link>
                  </div>
                  <div className="photo-item">
                    <img src={Img} alt="" />
                    <Link to="#" className="btn-hide">Hide</Link>
                  </div>
                  <div className="photo-item">
                    <img src={Img} alt="" />
                    <Link to="#" className="btn-hide">Hide</Link>
                  </div>
                  <div className="photo-item">
                    <img src={Img} alt="" />
                    <Link to="#" className="btn-hide">Hide</Link>
                  </div>
                  <div className="photo-item">
                    <img src={Img} alt="" />
                    <Link to="#" className="btn-hide">Hide</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoggedin: state.auth.loggedin
  };
}

export default compose(
  graphql(qGetUserByUsername, {
    name: "user",
    options: props => ({
      variables: { username: props.match.params.username || "" }
    })
  }),
  graphql(qGetUserActivity, {
    name: "activity",
    options: props => ({
      variables: { username: props.match.params.username || "" }
    })
  }),
  connect(mapStateToProps, { toggleAuthModal })
)(withRouter(EditProfile));
