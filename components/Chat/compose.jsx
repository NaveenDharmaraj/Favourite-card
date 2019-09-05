import React, { cloneElement,Fragment } from 'react';
import {
  Image,
  Form,
  Input,
  Dropdown,
} from 'semantic-ui-react'
const friendOptions = [
    {
      key: 'Jenny Hess',
      text: 'Jenny Hess',
      value: 'Jenny Hess',
      image: { avatar: true, src: 'https://react.semantic-ui.com/images/avatar/small/rachel.png' },
    },
    {
      key: 'Elliot Fu',
      text: 'Elliot Fu',
      value: 'Elliot Fu',
      image: { avatar: true, src: 'https://react.semantic-ui.com/images/avatar/small/lindsay.png' },
    },
    {
      key: 'Stevie Feliciano',
      text: 'Stevie Feliciano',
      value: 'Stevie Feliciano',
      image: { avatar: true, src: 'https://react.semantic-ui.com/images/avatar/small/matthew.png' },
    },
    {
      key: 'Christian',
      text: 'Christian',
      value: 'Christian',
      image: { avatar: true, src: 'https://react.semantic-ui.com/images/avatar/small/jenny.jpg' },
    },
    {
      key: 'Matt',
      text: 'Matt',
      value: 'Matt',
      image: { avatar: true, src: 'https://react.semantic-ui.com/images/avatar/small/matt.jpg' },
    },
    {
      key: 'Justen Kitsune',
      text: 'Justen Kitsune',
      value: 'Justen Kitsune',
      image: { avatar: true, src: 'https://react.semantic-ui.com/images/avatar/small/christian.jpg' },
    },
]
class chatHistory extends React.Component {
    render() {
        return (
            <Fragment>
            <div className="chatContent">
                <div class="mesgs">
                    <div class="msg_history">
                        <div className="recipients">
                            <div className="lbl">
                                To
                            </div>
                            <div className="inputWraper">
                            <Dropdown
                                clearable
                                fluid
                                multiple
                                search
                                selection
                                options={friendOptions}
                                placeholder='Type a name or multiple names...'
                            />
                            </div>
                        </div>

                        {/* chat history if one recipient*/}
                        <div class="outgoing_msg">
                            <div class="sent_msg">
                                <p>Hey Sophia, nice to see you are here!</p>
                            </div>
                        </div>

                        <div class="incoming_msg">
                            <div class="incoming_msg_img"> <Image src="https://ptetutorials.com/images/user-profile.png" alt="sunil"/> </div>
                            <div class="received_msg">
                                <div class="received_withd_msg">
                                    <p>Test which is a new approach to have all
                                        solutions</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="dateTime">12:24 AM</div>

                        <div class="outgoing_msg">
                            <div class="sent_msg">
                                <p>Test which is a new approach to have all
                                solutions</p>
                            </div>
                        </div>
                        <div class="incoming_msg">
                            <div class="incoming_msg_img"> <Image src="https://ptetutorials.com/images/user-profile.png" alt="sunil"/> </div>
                            <div class="received_msg">
                                <div class="received_withd_msg">
                                    <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris bibendum massa a sollicitudin finibus. Sed sagittis risus volutpat turpis feugiat, sed efficitur felis dapibus. Nunc euismod felis ac ornare accumsan. Ut magna tellus, laoreet et augue id, tincidunt pharetra elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec mauris est, ultrices ac convallis a, luctus ac est. Ut id tempor urna.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="outgoing_msg">
                            <div class="sent_msg">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris bibendum massa a sollicitudin finibus. Sed sagittis risus volutpat turpis feugiat, sed efficitur felis dapibus. </p>

                                </div>
                            </div>
                        <div class="incoming_msg">
                            <div class="incoming_msg_img"> <Image src="https://ptetutorials.com/images/user-profile.png" alt="sunil"/> </div>
                            <div class="received_msg">
                                <div class="received_withd_msg">
                                <p>We work directly with our designers and suppliers,
                                    and sell direct to you, which means quality, exclusive
                                    products, at a price anyone can afford.</p>
                                </div>
                            </div>
                        </div>
                        <div class="outgoing_msg">
                            <div class="sent_msg">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris bibendum massa a sollicitudin finibus. Sed sagittis risus volutpat turpis feugiat, sed efficitur felis dapibus. </p>

                                </div>
                            </div>
                        <div class="incoming_msg">
                            <div class="incoming_msg_img"> <Image src="https://ptetutorials.com/images/user-profile.png" alt="sunil"/> </div>
                            <div class="received_msg">
                                <div class="received_withd_msg">
                                <p>We work directly with our designers and suppliers,
                                    and sell direct to you, which means quality, exclusive
                                    products, at a price anyone can afford.</p>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                
            </div>
            <div className="chatFooter">
                <Form>
                    <Form.Field>
                    <input placeholder='Type a message…' />
                    </Form.Field>
                </Form>
            </div>
        </Fragment>
        );
    }
}
export default chatHistory