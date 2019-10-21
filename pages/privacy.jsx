import React from 'react';
import {
    Container,
    Button,
    Header,
    Grid,
    List,
    Segment,
} from 'semantic-ui-react';

import Layout from '../components/shared/Layout';
import '../static/less/privacy.less';

function AboutYourPrivacy() {
    return (
        <Layout>

            <div className="aboutyourprivacy-header-image">
                <Container>
                    <div className="banner-heading">
                        <Header as="h3">
                            About your privacy
                        </Header>
                    </div>
                </Container>
            </div>
            
            <div className="white-bg-section">
                <Container>
                    <p>Welcome to the Charitable Impact website (the "Site"). The Website is operated by CHIMP Technology Inc. and allows you to use and receive various services offered by CHIMP Services Inc. and CHIMP: Charitable Impact Foundation (Canada). For ease of reference, CHIMP Technology Inc., CHIMP Services Inc. and CHIMP: Charitable Impact Foundation (Canada) are collectively referred to as the "Charitable Impact  Collective", "we", "our" or "us".</p>
                    <p>This privacy policy (the “Policy”) outlines the privacy practices and procedures of each member of the Charitable Impact Collective concerning the information obtained through use of this Site or otherwise provided by you in dealing with the Charitable Impact Collective.</p>
                    <p>
                        Your privacy is very important to us. We are dedicated to protecting your privacy and safeguarding your personal information. This Policy and any related information is available at all times on our Site, or upon request to our Privacy Officer (
                        <a href="mailto:privacy@charitableimpact.com">
                                privacy@charitableimpact.com
                        </a>
                                ).
                    </p>
                    <p>At the Charitable Impact Collective for individual and group giving we consider all information that you provide to us or that can be linked to you through your use of the Site to be your personal information and personal information of the group’s members. For corporate giving, all information that you provide to us or that can be linked to the corporate donor through your use of the Charitable Impact Collective is considered information about the corporate donor and is not considered to be personal information, except, where applicable, any employee’s email or other electronic address provided to us in connection with the corporate donation.</p>
                    <p>Our policies and practices have been designed to comply with the Personal Information Protection and Electronic Documents Act (Canada) and all provincial statutes that regulate the treatment of Personal Information in the private and public sectors. This Policy applies to individuals who access our Site. This Policy may change over time. We may add, change or remove portions of this Policy when we feel it is appropriate. Such changes become effective upon posting, so please check the Site regularly for any updates.</p>
                    <p>By accessing this Site or otherwise using the services of the Charitable Impact Collective, you agree that any personal information that you may provide or that may be generated from your use of the Site, or use of services of the Charitable Impact Collective, may be collected, used, stored and disclosed as described in this Policy.</p>
                </Container>
            </div>
            
            <div id="top" className="Jump-full">
                <Container>
                    <Header as="h1">
                        Jump to a section
                    </Header>
                    <Grid>
                        <Grid.Column mobile={16} tablet={8} computer={5}>
                            <List>
                                <List.Item><a href="#five_privacy_principles">Our Five Privacy Principles</a></List.Item>
                                <List.Item><a href="#why_we_collect_personal_info">Why We Collect and Use Personal Information</a></List.Item>
                                <List.Item><a href="#consent_to_use_info">Consent To Use Personal Information</a></List.Item>
                                <List.Item><a href="#sharing_personal_info_with_others">Sharing Personal Information With Others</a></List.Item>
                                <List.Item><a href="#keeping_info_accurate">Keeping Information Accurate</a></List.Item>
                            </List>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={8} computer={5}>
                            <List>
                                <List.Item><a href="#how_we_safeguard_info">How We Safeguard Personal Information</a></List.Item>
                                <List.Item><a href="#freedom_of_info_request">Freedom of Information Requests</a></List.Item>
                                <List.Item><a href="#dispute_resolution">Dispute Resolution</a></List.Item>
                                <List.Item><a href="#jurisdiction">Jurisdiction</a></List.Item>
                                <List.Item><a href="#contact_info">Contact Information</a></List.Item>
                            </List>
                        </Grid.Column>
                    </Grid>
                </Container>
            </div>
            <div id="five_privacy_principles" className="blue-bg-section">
                <Container>
                    <Header as="h1">Our Five Privacy Principles</Header>
                    <p>The Charitable Impact Collective is committed to maintaining the accuracy, confidentiality and security of your personal information. As part of this commitment, the Charitable Impact Collective has adopted the following five principles, based on the values set by the Canadian Standards Association's Model Code for the Protection of Personal Information.</p>
                    <div className="five-privacy-principles">
                        <List as="ol">
                            <List.Item as="li" className="Principles_list">Accountability - the Charitable Impact Collective is responsible for maintaining and protecting the personal information under its control and shall designate one or more individuals to be accountable for compliance with these principles;</List.Item>
                            <List.Item as="li" className="Principles_list">Safeguards - we shall protect your personal information using security safeguards that are appropriate to the sensitivity level of the personal information received;</List.Item>
                            <List.Item as="li" className="Principles_list">Openness - the Charitable Impact Collective will provide information to you about our policies and procedures relating to the management of personal information that is under our control;</List.Item>
                            <List.Item as="li" className="Principles_list">
                                Individual's Access - On written request to our Privacy Officer
                                (
                                <a href="mailto:privacy@charitableimpact.com">
                                    privacy@charitableimpact.com
                                </a>
                                ), you will be informed of the existence, use and disclosure of the personal information that is under our control, and you will be given access to that personal information, subject to applicable laws. You are entitled to challenge the accuracy and completeness of any personal information and request that it be amended, if appropriate; and
                            </List.Item>
                            <List.Item as="li" className="Principles_list">
                                Enquiries or Complaints - any questions or enquiries you may have concerning compliance with our privacy policies and procedures may be addressed to our Privacy Officer at
                                <a href="mailto:privacy@charitableimpact.com">
                                &nbsp;privacy@charitableimpact.com.
                                </a>
                            </List.Item>
                        </List>
                    </div>
                    <div className="back-top"><a href="#top">Back to top</a></div>
                </Container>
            </div>
            <div id="why_we_collect_personal_info" className="personal_information">
                <Container>
                    <div className="white-bg-text">
                        <Header as="h1">Why We Collect and Use Personal Information</Header>
                        <p>Collecting personal information about you is essential to our being able to provide the services offered by the Charitable Impact Collective. While the personal information we collect may come directly from you, it may also be provided by our affiliates, agents or other third parties to whom you have given your consent to provide us with your personal information. The Charitable Impact Collective collects, uses and discloses personal information it receives in accordance with this Policy.</p>
                        <p>Personal information may be used:</p>
                        <div className="why-we-collect">
                            <List as="ul">
                                <List.Item as="li" className="ersonal_information-list">to determine eligibility for services;</List.Item>
                                <List.Item as="li" className="ersonal_information-list">to process Impact Account applications and provide requested information or services;</List.Item>
                                <List.Item as="li" className="ersonal_information-list">to understand and assess your needs and offer products and services to meet those needs;</List.Item>
                                <List.Item as="li" className="ersonal_information-list">to offer value added services to you from the Charitable Impact  Collective;</List.Item>
                                <List.Item as="li" className="ersonal_information-list">for billing and accounting services relating to our services;</List.Item>
                                <List.Item as="li" className="ersonal_information-list">for communication, service and administration;</List.Item>
                                <List.Item as="li" className="ersonal_information-list">for internal, external and regulatory audit purposes; or</List.Item>
                                <List.Item as="li" className="ersonal_information-list">to comply with legal and regulatory requirements, including tax reporting requirements</List.Item>
                            </List>
                        </div>
                    </div>
                    <div className="personal_information-text">
                        <p>as required or permitted by applicable law.</p>
                        <p>Your personal information may be shared between various members of the Charitable Impact Collective as reasonably necessary in connection with our services.</p>
                        <p>Personal information may also be used for other purposes, subject to the Charitable Impact Collective obtaining your prior consent for such use.</p>
                        <p>The Charitable Impact Collective retains personal information only as long as we are required to for our business relationship or as required by Federal or Provincial laws, subject to reasonable industry practices for records retention. The Charitable Impact Collective has appropriate procedures in place with respect to the destruction, deletion and disposition of personal information when it is no longer required by the Charitable Impact Collective, subject to applicable law.</p>
                        <div className="back-top"><a href="#top">Back to top</a></div>
                    </div>
                </Container>
            </div>
            <div id="consent_to_use_info" className="blue-bg-section">
                <Container>
                    <Header as="h1">Consent To Use Personal Information</Header>
                    <p>By submitting personal information to us, you hereby consent to the collection, use and disclosure of your personal information in accordance with this Policy.</p>
                    <p>In addition to the consent that you provide under this Policy through accessing the Site, consent may be obtained in various ways. We may obtain your express consent or we may determine that consent has been implied by the circumstances. Express consent could be in writing (for example in a signed consent, email or application form), or verbally in person or over the telephone. When we receive personal information from you that enables us to provide you with a requested product or service, your consent to allow us to deal with that personal information in a reasonable manner would be implied.</p>
                    <p>Providing us with your personal information is always your choice. When you request services from us, we ask that you provide information that enables us to respond to your request. In doing so, you consent to our collection, use and disclosure to appropriate third parties of such personal information for these purposes. You also authorize us to use and retain this personal information for as long as it may be required for the purposes described above. Your consent remains valid even after the termination of our relationship with you, unless you provide us with written notice that such consent is withdrawn. By withdrawing your consent, or not providing it in the first place, you may limit or even prevent us from being able to provide you with the products or services desired.</p>
                    <p>There are also legal exceptions where we will not need to obtain consent or explain the purposes for the collection, use or disclosure of personal information. For example, this exception would apply if we must comply with applicable laws, a court order or regulatory demands.</p>
                    <div className="back-top"><a href="#top">Back to top</a></div>
                </Container>
            </div>
            <div id="sharing_personal_info_with_others" className="white-bg">
                <Container>
                    <Header as="h1">Sharing Personal Information With Others</Header>
                    <p>We are not in the business of selling, renting or otherwise providing client lists or personal information to others. Your contact information will not be made publicly available on the Site. However, in providing our services, we may need to disclose the personal information we collect to affiliates, subsidiaries, successors, business partners, donees and other service providers or agents who perform various functions for us (such as third party payment processing companies). The Charitable Impact Collective may anonymize the information you provide to perform statistical analysis and market research which may be used by the Charitable Impact Collective or by other third parties.</p>
                    <p>As the Charitable Impact Collective continues to develop and grow, we may buy, merge, or sell parts of our business. As our businesses consist primarily of client relationships, information regarding the particular accounts or services being purchased or sold could include personal information and be one of the transferred business assets.</p>
                    <p>In certain circumstances, we may be required or permitted to provide personal information to third parties for legal or regulatory purposes.</p>
                    <p>We may also use this personal information to assess your future needs and to offer the products and services that may best meet those needs or to conduct market research.</p>
                    <p>When you make a disbursement to a registered charity or any qualified recipient listed with Charitable Impact we will only disclose your Personal Information and your identity to that registered charity or qualified recipient when you want us to do so.</p>
                    <p>If you use our referral service to inform others about the Charitable Impact Collective, the information you provide to us will only be used to send an automatically-generated email message. The Charitable Impact Collective will not retain, use or disclose that information for any purpose other than as required or permitted by applicable law.</p>
                    <p>If you participate in an organizational matching program, details on your gift and request for matching will be disclosed to that organization.</p>
                    <div className="back-top"><a href="#top">Back to top</a></div>
                </Container>
            </div>
            <div id="keeping_info_accurate" className="blue-bg-section">
                <Container>
                    <Header as="h1">Keeping Information Accurate</Header>
                    <p>It is important that your personal information is accurate and complete. Having accurate information about you enables us to give you the best possible service. You have the right to access, verify and amend the information we have about you. We rely on you to keep us informed of any changes, such as a change of email, address, your legal name or any other circumstances. You can update this information on the Site at the Account Settings page for your Impact Account.</p>
                    <p>Despite our best efforts, errors sometimes do occur. If you identify any personal information that is out-of-date, incorrect or incomplete, let us know and we will make the corrections promptly and use every reasonable effort to communicate these changes to other parties who may have inadvertently received incorrect or out-of-date personal information from us. Please ensure that your Account Settings information for your Impact Account is up-to-date, correct and complete at all times.</p>
                    <div className="back-top"><a href="#top">Back to top</a></div>
                </Container>
            </div>
            <div id="how_we_safeguard_info" className="white-bg">
                <Container>
                    <Header as="h1">How We Safeguard Personal Information</Header>
                    <p>At the Charitable Impact Collective, we employ physical, electronic and procedural safeguards to protect our systems and all personal information under our control against unauthorized access and use. All safety and security measures are appropriate to the sensitivity level of the information collected.</p>
                    <p>Our service providers and agents are contractually required to maintain the confidentiality of your personal information, and may not use the information for any unauthorized purpose.</p>
                    <div className="back-top"><a href="#top">Back to top</a></div>
                </Container>
            </div>
            <div id="freedom_of_info_request" className="blue-bg-section">
                <Container>
                    <Header as="h1">Freedom of Information Requests</Header>
                    <p>If you are making a donation to any organization or institution that is subject to either federal or provincial public sector "freedom of information" or "access to information" legislation, then please note that information concerning your donation may be disclosed to third parties pursuant to the procedures available under those laws.</p>
                    <div className="back-top"><a href="#top">Back to top</a></div>
                </Container>
            </div>
            <div id="dispute_resolution" className="white-bg">
                <Container>
                    <Header as="h1">Dispute Resolution</Header>
                    <p>If there is a dispute between you and the Charitable Impact Collective regarding your personal information or this Policy, you agree to use reasonable efforts to resolve such dispute with the Charitable Impact Collective informally and to consult and negotiate with the Charitable Impact Collective in good faith to reach a fair and equitable solution. If the dispute is not resolved through an informal process within thirty (30) days, either party may consult the Privacy Commissioner of Canada or a relevant provincial privacy commissioner.</p>
                    <div className="back-top"><a href="#top">Back to top</a></div>
                </Container>
            </div>
            <div id="jurisdiction" className="blue-bg-section">
                <Container>
                    <Header as="h1">Jurisdiction</Header>
                    <p>Information on the Site may be located in or accessed from outside of Canada or sent to others outside of Canada. Please note that any personal information that is outside of Canada may be subject to access by law enforcement and government authorities having jurisdiction in those countries in which the information is located. We will use reasonable efforts to ensure all personal information is protected, but cannot ensure that the laws of other countries will offer the same level of protection as Canadian laws. By submitting personal information to us, you hereby consent to the transmission, processing and/or storage of personal information outside of Canada.</p>
                    <div className="back-top"><a href="#top">Back to top</a></div>
                </Container>
            </div>
            <div id="contact_info" className="white-bg">
                <Container>
                    <div className="contact-info-section">
                        <Header as="h1">Contact Information</Header>
                        <p>Please contact our Privacy Officer to obtain further information about our policies and procedures or if you have any unresolved enquiries or concerns. Our Privacy Officer can be contacted as follows:</p>
                        <List>
                            <List.Item>Mail: Suite 1250 - 1500 West Georgia St., Vancouver, BC, Canada, V6G 2Z6</List.Item>
                            <List.Item>Attention: Privacy Officer</List.Item>
                            <List.Item>
                                Email:
                                <a href="mailto:privacy@charitableimpact.com">
                                    privacy@charitableimpact.com
                                </a>
                            </List.Item>
                        </List>
                    </div>
                    <div className="back-top"><a href="#top">Back to top</a></div>
                </Container>
            </div>
        </Layout>
    );
}
export default AboutYourPrivacy;
