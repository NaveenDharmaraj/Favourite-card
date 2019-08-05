import React from 'react';
import {
    Tab,
} from 'semantic-ui-react';
import Chart from '../charity/Charts';
import Maps from '../charity/Maps';

const panes = [
    { menuItem: 'About', render: () =>
        <Tab.Pane attached={false}>
            <p>Lorem ipsum dolor sit amet, quod solum vitae cu sed, praesent disputando duo at. Stet altera ridens ei eos, unum clita omittantur qui id. Mel cu facer facilis. Hinc aeque ei pro, clita fuisset elaboraret ne sed, ei quo nibh recteque instructior. Appetere ullamcorper usu ne. Dicant nostrud menandri at mel, diceret probatus cu sit.</p>
            <p>Lorem ipsum dolor sit amet, quod solum vitae cu sed, praesent disputando duo at. Stet altera ridens ei eos, unum clita omittantur qui id. Mel cu facer facilis. Hinc aeque ei pro, clita fuisset elaboraret ne sed, ei quo nibh recteque instructior. Appetere ullamcorper usu ne. Dicant nostrud menandri at mel, diceret probatus cu sit.</p>
        </Tab.Pane> 
    },
    { menuItem: 'Revenue and expenses', render: () => <Tab.Pane attached={false}><Chart /></Tab.Pane> },
    { menuItem: 'Worldwide locations', render: () => <Tab.Pane attached={false}><Maps /></Tab.Pane> },
    { menuItem: 'Receiving organizations', render: () => <Tab.Pane attached={false}>Tab 4 Content</Tab.Pane> },
  ]
  
class ProfileDetails extends React.Component {
    render() {
        return (
            <div className="charityTab">
            <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
            </div>
        )
    }
}

export default ProfileDetails;
