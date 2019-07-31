import React, { Fragment } from 'react';
import {
    Button,
    Header,
    Form,
    Grid,
} from 'semantic-ui-react';
function CreateComponent(props) {
    const {
        handleSubmit,
    } = props;
    return (
        <Fragment>
            <Grid.Column className="left-bg"></Grid.Column>
            <Grid.Column>
                <div className="login-form-wraper">
                    <div className="reg-header">
                        <Header as="h3">Create your Impact Account. </Header>
                        <Header as="h4">
                            By clicking ‘Create your Impact Account’, you acknowlege that you have read the
                            <a>Privacy Policy</a>
                            , and agree to the
                            <a>Terms & Conditions</a>
                            and
                            <a>Account Agreement</a>
                            .
                        </Header>
                    </div>
                    <Form>
                        <div className="create-btn-wraper">
                            <Button type="submit" onClick={handleSubmit} primary>Create your Impact Account</Button>
                        </div>
                    </Form>
                </div>
            </Grid.Column>
        </Fragment>
    );
}

export default CreateComponent;
