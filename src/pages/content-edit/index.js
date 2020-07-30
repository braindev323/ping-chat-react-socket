import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
// import { graphql } from "react-apollo";
import { flowRight as compose } from "lodash";
import { withRouter } from "react-router-dom";
import _ from "lodash";

// import defaultCover from "../../resources/image/cover.png";
// import Avatar from "../../components/avatar";
import Icon from "../../components/icon";
// import Post from "../../components/post";
import Composer from "../../components/composer";
// import { formatNumber, formatDate } from "../../utils";
// import { qGetUserByUsername, qGetUserActivity } from "../../graphql/query";
import {
  PostType,
} from '../../constants';
import { toggleAuthModal } from "../../redux/actions";
import "./index.scss";

type State = {
  isLoggedin: boolean,
  me: ?User
};

const defaultValues = {
  title: 'What is Lorem Ipsum?',
  description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including `,
  type: PostType.Unknown,
  original_url: 'https://lipsum.com/',
  category_id: -1,
  gammatags: [],
  images: [],
  videos: [],
  location: null,
  link: '',

  showImageImporter: false,
  showVideoImporter: false,
  showVideoCapture: false,
  videoDurationLimited: false,
  gammatag: '',
  newGammatag: '',
  active_menu: -1,
  selectedImage: 0,
  uploading: false,
}

class ContentEdit extends React.Component<any, State> {
  state: State = {
    isLoggedin: false,
    me: null
  };

  static getDerivedStateFromProps(props: any, state: State) {
    return {
      isLoggedin: props.isLoggedin,
      me: props.me,
    }
  }

  componentDidMount() {
    const { isLoggedin, me } = this.state;
    if (!isLoggedin && !me) {
      this.props.toggleAuthModal(true);
    }
  }

  render() {
    // const { postId } = this.props.match.params;
    const { posts, me, isLoggedin } = this.state;

    // const user: ?User = this.props.user.getUserByUsername;
    // const activity = this.props.activity.getUserActivity;

    // if (!user || !activity) {
    //   return (
    //     <div className="not-found">
    //       <h3>{"This profile is not available"}</h3>
    //     </div>
    //   );
    // }

    const backUrl = me && _.get(me, "username") ? `/profile/${me.username}` : "/";

    return (
      <div className="profile-edit">
        <div className="content">
          <div className="profile-ctn">
            <div className="actions">
              <Link className="btn-back" to={backUrl}>
                <Icon className='icon' name='arrow_left' size={24} />
              </Link>
            </div>
            <div className="info">
              {isLoggedin && me && <Composer defaultValues={defaultValues} onIssue={post => this.setState({ posts: _.concat([post], posts) })} />}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoggedin: state.auth.loggedin,
    me: state.auth.me
  };
}

export default compose(
  // graphql(qGetUserByUsername, {
  //   name: "user",
  //   options: props => ({
  //     variables: { postId: props.match.params.postId || "" }
  //   })
  // }),
  // graphql(qGetUserActivity, {
  //   name: "activity",
  //   options: props => ({
  //     variables: { postId: props.match.params.postId || "" }
  //   })
  // }),
  connect(mapStateToProps, { toggleAuthModal })
)(withRouter(ContentEdit));
