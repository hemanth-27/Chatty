import './App.css';
import ColorPanel from './Colorpanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './Metapanel/MetaPanel';
import { Grid } from 'semantic-ui-react';
import { connect} from 'react-redux';

const App = ( {currentUser, currentChannel, isPrivateChannel } ) => (
      <div className='App'>
        <Grid columns='equal'>
        <ColorPanel/>
        <SidePanel 
        key={currentUser && currentUser.uid}
        currentUser={currentUser}
        />
        <Grid.Column style={{marginLeft: 320}}>
          <Messages 
          key={currentChannel && currentChannel.id}
          currentChannel={currentChannel}
          currentUser={currentUser}
          isPrivateChannel={isPrivateChannel}
          />
        </Grid.Column>
        <Grid.Column width={4}>
          <MetaPanel/>
        </Grid.Column>
      </Grid>
      </div>
)

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel
})

export default connect(mapStateToProps)(App);
