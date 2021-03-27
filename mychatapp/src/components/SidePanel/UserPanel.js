import React from 'react';
import { Dropdown, Grid, Header, Icon } from 'semantic-ui-react';
import { auth } from '../../services/firebase';

class UserPanel extends React.Component {

    state = {
        user: this.props.currentUser
    }

    dropDownOptions = () => [
        {
            key: 'user',
            text: (
                <span>
                    Signed in as <strong>{this.state.user && this.state.user.displayName}</strong>
                </span>
            ),
            disabled: true
        },
        {
            key: 'signout',
            text: <span onClick={this.handleSingOut}>Sign out</span>
        }
    ]

    handleSingOut = () => {
        auth()
        .signOut()
        .then(() => console.log('User signedOut! '));
    }
    render() {
        const { user } = this.state;
        return(
            <Grid>
                <Grid.Column>
                    <Grid.Row style={{padding: '1.2em', margin: 0}}>
                    <Header inverted floated='left' as='h2'>
                        <Icon name='code' />
                        <Header.Content>Chatty</Header.Content>
                    </Header>
                    </Grid.Row>
                    <Header style={{ padding: '0.25em'}} as='h4' inverted>
                        <Dropdown trigger={<span>{user && user.displayName}</span>}
                        options={this.dropDownOptions()}
                        />
                    </Header>
                </Grid.Column>
            </Grid>
        )
    }
}

export default UserPanel;