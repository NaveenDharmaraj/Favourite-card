import React, { } from 'react';

function ReloadAddAmount(props) {
    const {
        giftType,
        reviewBtnFlag,
    } = props;
    if (giftType === 0 && !reviewBtnFlag) {
        return (
            // eslint-disable-next-line react/jsx-filename-extension
            <div className="noteDefault">
                <div className="noteWraper">
                    <span className="leftImg">
                        <span className="notifyDefaultIcon" />
                    </span>
                    <span className="noteContent"><a href="#">Reload</a> your Impact Account to send this gift </span>
                </div>
            </div>
        );
    }
    if (reviewBtnFlag) {
        return (
            <div><p className="errorNote">There is not enough money in your account to send this gift.<a href="#"> Add money</a> to continue</p></div>
        );
    }
    return null;
}
export default ReloadAddAmount;
