import React, { cloneElement, Fragment } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import {
    Image,
    Form,
} from 'semantic-ui-react'
class chatHistory extends React.Component {
    items = [];
    loading = false;
    hasMore = true;
    scrollParentRef = React.createRef();
    ref = React.createRef();

    constructor() {
        super();
        this.items = [];
    }
    loadMoreItems = (p) => {
        console.log("Load more called!" + p);
        if (this.loading) {
            return;
        }
        this.hasMore = false;
        this.loading = true;
        this.items.push("Item " + this.items.length);
        this.loading = false;
        this.hasMore = true;
    }
    render() {
        let self = this;
        //     return <InfiniteScroll
        //     pageStart={0}
        //     initialLoad={true}
        //     loadMore={this.loadMoreItems.bind(this)}
        //     hasMore={self.hasMore}
        //     threshold={250}
        //     isReverse={true}
        //     loader={<div className="loader" key={0}>Loading...</div>}
        //     useWindow={false}
        //     useCapture={true}
        //     // ref = {()=>self.scrollParentRef}
        //     // getScrollParent={() => this.scrollParentRef}
        // >
        //     {self.items.map((msg) => (
        //         <div className="outgoing_msg" key={msg}>
        //             <div className="sent_msg">
        //                 <p>{msg} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris bibendum massa a sollicitudin finibus. Sed sagittis risus volutpat turpis feugiat, sed efficitur felis dapibus. </p>
        //             </div>
        //         </div>
        //     ))}
        // </InfiniteScroll>;
        return (
            <Fragment>
                <div className="chatContent">
                    <div className="mesgs" style={{ height: 700, overflow: 'auto' }} ref={this.scrollParentRef} onScroll={(event) => { }}>
                        <div className="msg_history" ref={(ref) => this.scrollRef = ref}>
                            <InfiniteScroll
                                pageStart={0}
                                initialLoad={true}
                                loadMore={this.loadMoreItems.bind(this)}
                                hasMore={self.hasMore}
                                threshold={250}
                                isReverse={true}
                                loader={<div className="loader" key={0}>Loading...</div>}
                                useWindow={false}
                                useCapture={true}
                                getScrollParent={() => { self.scrollParentRef }}
                            >
                                {self.items.map((msg) => (
                                    <div className="outgoing_msg" key={msg}>
                                        <div className="sent_msg">
                                            <p>{msg} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris bibendum massa a sollicitudin finibus. Sed sagittis risus volutpat turpis feugiat, sed efficitur felis dapibus. </p>
                                        </div>
                                    </div>
                                ))}
                            </InfiniteScroll>
                            {/* <div style={{height:700,overflow:'auto'}}> */}
                            <div className="outgoing_msg">
                                <div className="sent_msg">
                                    <p>Hey Sophia, nice to see you are here!</p>
                                </div>
                            </div>

                            <div className="incoming_msg">
                                <div className="incoming_msg_img"> <Image src="https://ptetutorials.com/images/user-profile.png" alt="sunil" /> </div>
                                <div className="received_msg">
                                    <div className="received_withd_msg">
                                        <p>Test which is a new approach to have all
                                        solutions</p>
                                    </div>
                                </div>
                            </div>

                            <div className="dateTime">12:24 AM</div>

                            <div className="outgoing_msg">
                                <div className="sent_msg">
                                    <p>Test which is a new approach to have all
                                solutions</p>
                                </div>
                            </div>
                            <div className="incoming_msg">
                                <div className="incoming_msg_img"> <Image src="https://ptetutorials.com/images/user-profile.png" alt="sunil" /> </div>
                                <div className="received_msg">
                                    <div className="received_withd_msg">
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris bibendum massa a sollicitudin finibus. Sed sagittis risus volutpat turpis feugiat, sed efficitur felis dapibus. Nunc euismod felis ac ornare accumsan. Ut magna tellus, laoreet et augue id, tincidunt pharetra elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec mauris est, ultrices ac convallis a, luctus ac est. Ut id tempor urna.
                                    </p>
                                    </div>
                                </div>
                            </div>
                            <div className="outgoing_msg">
                                <div className="sent_msg">
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris bibendum massa a sollicitudin finibus. Sed sagittis risus volutpat turpis feugiat, sed efficitur felis dapibus. </p>

                                </div>
                            </div>
                            <div className="incoming_msg">
                                <div className="incoming_msg_img"> <Image src="https://ptetutorials.com/images/user-profile.png" alt="sunil" /> </div>
                                <div className="received_msg">
                                    <div className="received_withd_msg">
                                        <p>We work directly with our designers and suppliers,
                                            and sell direct to you, which means quality, exclusive
                                    products, at a price anyone can afford.</p>
                                    </div>
                                </div>
                            </div>

                            {/* </div> */}
                            {/*
                        
                        <div className="incoming_msg">
                            <div className="incoming_msg_img"> <Image src="https://ptetutorials.com/images/user-profile.png" alt="sunil" /> </div>
                            <div className="received_msg">
                                <div className="received_withd_msg">
                                    <p>We work directly with our designers and suppliers,
                                        and sell direct to you, which means quality, exclusive
                                    products, at a price anyone can afford.</p>
                                </div>
                            </div>
                        </div> */}
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