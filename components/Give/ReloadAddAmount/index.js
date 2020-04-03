import React, { } from 'react'
import _ from 'lodash';
import '../../../static/less/giveFlows.less';

function ReloadAddAmount(props) {
    const { gifttype, reviewBtnFlag } = props;
    if (gifttype === 0 && !reviewBtnFlag) {
       return(
            <div className="noteDefault">
                <div className="noteWraper">
                    <span className="leftImg">
                        <span className="notifyDefaultIcon">
                        </span>
                    </span>
                    <span className="noteContent"><a href="#">Reload</a> your Impact Account to send this gift </span>
                </div>
            </div>
        )
    }
    else if (reviewBtnFlag) {
       return(
            <div><p className="errorNote">There is not enough money in your account to send this gift.<a href="#"> Add money</a> to continue</p></div>
        )
    }

}

export default ReloadAddAmount;
