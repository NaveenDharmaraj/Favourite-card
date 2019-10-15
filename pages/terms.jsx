import React from 'react';
import {
    Container,
    Header,
    Grid,
    List,
    Segment,
} from 'semantic-ui-react';

import Layout from '../components/shared/Layout';
import '../static/less/terms.less';

function TermsConditions() {
    return (
        <Layout>
            <div className="terms-header-image">
                <Container>
                    <div className="banner-heading">
                        <Header as="h3">
                            Terms and Conditions of Use
                        </Header>
                    </div>
                </Container>
            </div>
            <div className="terms-chimp-full">
                <Container>
                    <div className="terms-chimp-sub-text">
                        <p>Welcome to the Charitable Impact website (the "Site").</p>
                    </div>
                    <div className="chimp-box-text">
                        <p>By using the Site, which is part of the systems and services we provide, or by making a donation through our parts of our systems, you are agreeing to be bound by these terms and conditions ("Terms of Use") and all applicable laws and regulations.</p>
                        <p>IF YOU DO NOT AGREE WITH ANY PART OF THESE TERMS OF USE, YOU MUST IMMEDIATELY DISCONTINUE ANY USE OF THE CHARITABLE IMPACT SYSTEM AND THE SERVICES.</p>
                        <p>You confirm that you have the legal authority and capacity to accept these Terms of Use.</p>
                    </div>
                    <div className="chimp-text">
                        <p>Charitable Impact is made up of CHIMP: Charitable Impact Foundation (Canada) a charity registered with the Canada Revenue Agency (the "Foundation"), CHIMP Technology Inc. ("CHIMP Tech") and CHIMP Services Inc. ("CHIMP ServiceCo"). In these Terms of Use, the Foundation, CHIMP Tech and CHIMP ServiceCo are collectively referred to as the "Charitable Impact Collective".</p>
                        <p>The “Charitable Impact System” is the Site owned by CHIMP Tech, together with any technology proprietary to or licensed to CHIMP Tech and used by a User, Community Account, Giving Group or One-Time Donor.</p>
                        <p>Subject to the creation of an Impact Account, a User (a Person who accepts a Charitable Impact Account Agreement) is permitted access to the Charitable Impact System (in accordance with the terms and conditions in the Charitable Impact Account Agreement) and to use an Impact  Account for the limited purpose of making Donations, making recommendations regarding Disbursements and Transfers, creating of or joining to a Giving Group Account, posting, searching and/or uploading certain information and reviewing certain information posted by one or more other Users, Qualified Recipients, Community Account or Giving Group Members of the Charitable Impact Collective on the Charitable Impact System and is able to receive additional services and/or premium services offered by one or more of the Charitable Impact Collective from time to time (such permitted access and ability to receive services collectively referred to as the "Services").</p>
                        <p>The Foundation is a non-share capital corporation incorporated under the Canada Corporations Act and classified by Canada Revenue Agency as a registered charity with Registration #845528827RR0001 and designated as a public foundation under Section 149.1 of the Income Tax Act (Canada), has audited financial statements since its fiscal year end 2011 and has been continued under the Canada Not-For-Profit Corporations Act.</p>
                
                    </div>
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
                                <List.Item><a href="#impact_account">Impact Account</a></List.Item>
                                <List.Item><a href="#giving_groups">Giving Groups</a></List.Item>
                                <List.Item><a href="#community_account">Community Account</a></List.Item>
                                <List.Item><a href="#qualified_recipients">Qualified Recipients</a></List.Item>
                                <List.Item><a href="#one_time_donors">One-Time Donors</a></List.Item>
                                <List.Item><a href="#intellectual_property">Intellectual Property Ownership</a></List.Item>
                                <List.Item><a href="#use_of_information">Use of Information and Ownership</a></List.Item>
                                <List.Item><a href="#use_of_charitable_system">Use of the Charitable Impact  System</a></List.Item>
                                <List.Item><a href="#impact_marks">Use of the Charitable Impact Marks</a></List.Item>
                                <List.Item><a href="#disclaimers">Disclaimers</a></List.Item>
                            </List>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={8} computer={5}>
                            <List>
                                <List.Item><a href="#limitation_of_liability">Limitation of Liability</a></List.Item>
                                <List.Item><a href="#indemnity">Indemnity</a></List.Item>
                                <List.Item><a href="#cookies">Cookies</a></List.Item>
                                <List.Item><a href="#third_party_sites">Third Party Internet Sites</a></List.Item>
                                <List.Item><a href="#ability_to_accept_terms">Ability to Accept Terms of Use</a></List.Item>
                                <List.Item><a href="#privacy_policy">Privacy Policy</a></List.Item>
                                <List.Item><a href="#amendments_to_terms">Amendments to Terms of Use/Assignment</a></List.Item>
                                <List.Item><a href="#general">General</a></List.Item>
                                {/* <List.Item><a href="#">Content/Reserved Rights</a></List.Item> */}
                            </List>
                        </Grid.Column>
                    </Grid>
                </Container>
            </div>
            <div id="impact_account" className="blue-bg-section">
                <Container>
                    <Header as="h1">Impact Account</Header>
                    <p>A Charitable Impact Account allows a User to use a wide assortment of the Services available on and through the Charitable Impact System and to make charitable donations (a "Donation") to their Impact Account, to make recommendations regarding the transfer of funds (a "Transfer") from their Impact Account to one or more accounts on the Charitable Impact System and to make recommendations regarding disbursements (a "Disbursement") from their Impact Account to registered charities and/or other entities classified as "qualified donees" under the Income Tax Act (Canada) which have been approved by the Foundation as eligible donees (such charities and other entities referred to as "Qualified Recipient(s)").</p>
                    <p>
                    Anyone wishing to become a User and create an Impact Account must provide certain information to the Charitable Impact Collective and enter into a Charitable Impact Account Agreement with the Charitable Impact Collective. The Charitable Impact Account Agreement (the “Agreement”) is posted on the Site at
                        <a href="/account-agreement">
                        &nbsp;charitableimpact.com/account-agreement.
                        </a>
                        The Agreement must be reviewed and agreed to by you before you can become a User and create your own Charitable Impact Account.
                    </p>
                    <div className="back-top"><a href="#top">Back to top</a></div>
                </Container>
            </div>
            <div id="giving_groups" className="white-bg">
                <Container>
                    <Header as="h1">Giving Groups</Header>
                    <p>The Charitable Impact System encourages Users and other interested people to form and/or participate in designated groups on the Charitable Impact System for the purpose of Disbursing to Qualified Recipients as a group and to use the Charitable Impact System and the Services as a group (a "Giving Group"). Users and non-Users may participate in a Giving Group but you must be a User and agree to the Agreement before you start your own Giving Group. Subject to the approval of the Charitable Impact Collective and the Agreement, a User may establish a Giving Group Account.</p>
                    <div className="back-top"><a href="#top">Back to top</a></div>
                </Container>
            </div>
            <div id="community_account" className="blue-bg-section">
                <Container>
                    <Header as="h1">Community Account</Header>
                    <p>A Community Account allows a company, employer, organization or other person or entity (a "Community") to use a wide assortment of Services available on and through the Charitable Impact System and to make Donations to Community Accounts, Transfers to Impact Accounts and Giving Group Accounts and Disbursements to Qualified Recipients.</p>
                    <p>
                    Any Community wishing to become approved to use the Charitable Impact System, the Services, and to make Donations, Transfers and Disbursements must provide certain information to the Charitable Impact Collective and enter into a Charitable Impact Account Agreement with the Charitable Impact Collective. The Charitable Impact Account Agreement (the “Agreement”) is posted on the Site at
                        <a href="/account-agreement">
                        &nbsp;charitableimpact.com/account-agreement
                        </a>
                        The Agreement must be reviewed and approved by a Community before it can become a Community and create its own Community Account.
                    </p>
                    <div className="back-top"><a href="#top">Back to top</a></div>
                </Container>
            </div>
            <div id="qualified_recipients" className="white-bg">
                <Container>
                    <Header as="h1">Qualified Recipients</Header>
                    <p>A Qualified Recipient Account allows a Qualified Recipient to use a wide assortment of Services made available by the Charitable Impact Collective (whether on and through the Charitable Impact System or through other means) and to receive approved Disbursements from an Impact Account, a Giving Group Account, a Community Account and/or from a One-Time Donor.</p>
                    <p>
                    Any Qualified Recipient wishing to become approved  to use the Charitable Impact System and the Services must provide certain information to the Charitable Impact Collective and enter into a Charitable Impact Account Agreement with the Foundation. The Charitable Impact Account Agreement (the “Agreement”) is posted on the Site at 
                        <a href="/account-agreement">
                        &nbsp;charitableimpact.com/account-agreement.
                        </a>
                        The Agreement must be reviewed and approved by the Qualified Recipient before it can create its own Qualified Recipient Account.
                    </p>
                    <div className="back-top"><a href="#top">Back to top</a></div>
                </Container>
            </div>
            <div id="one_time_donors" className="blue-bg-section">
                <Container>
                    <Header as="h1">One-Time Donors</Header>
                    <p>The Charitable Impact System allows a person other than a User to make an approved Donation to a Qualified Recipient or to a Giving Group and to use limited parts of the Services and functionality of the Charitable Impact  System (such person a "One-Time Donor").</p>
                    <p>Upon any Donation made by a One-Time Donor to a Qualified Recipient or to a Giving Group an electronic record of such Donation will be made available to the One-Time Donor via email or other means of communication selected by the Charitable Impact Collective. Neither a One-Time Donor nor any other person may offer and/or accept any tangible benefit or privilege in return for a Donation to any Qualified Recipient or to any Giving Group.</p>
                    <div className="back-top"><a href="#top">Back to top</a></div>
                </Container>
            </div>
            <div id="intellectual_property" className="white-bg">
                <Container>
                    <Header as="h1">Intellectual Property Ownership</Header>
                    <p>CHIMP Tech either owns the intellectual property rights, including copyright, or has acquired the necessary permissions, in the information, including all text, HTML (hypertext markup language) code, multimedia clips, images, graphics, icons, JavaScript code and the selection and arrangement of the content of the Charitable Impact System (collectively the "Information"). Unauthorized use by you of the Information may violate copyright, trademark, and other laws. Charitable Impact and the Charitable Impact logo and related names displayed on the Charitable Impact System are the trademarks, service marks or registered trademarks of CHIMP Tech. Except as provided for under these Terms of Use, any reproduction of any of these marks without the express written consent of CHIMP Tech is strictly prohibited. Except as expressly granted, nothing contained herein shall be construed as conferring any license or right to you under any intellectual property or rights proprietary to the Charitable Impact Collective.</p>
                    <div className="back-top"><a href="#top">Back to top</a></div>
                </Container>
            </div>
            <div id="use_of_information" className="blue-bg-section">
                <Container>
                    <Header as="h1">Use of Information and Ownership</Header>
                    <p>CHIMP Tech grants you a limited license to display, print, download and use the Information provided that you abide by these Terms of Use, do not modify the Information in any manner, plainly display all copyright and other proprietary notices in the same form and manner as on the original and display a statement that the Information is used solely with permission of CHIMP Tech.</p>
                    <div className="back-top"><a href="#top">Back to top</a></div>
                </Container>
            </div>
            <div id="use_of_charitable_system" className="white-bg">
                <Container>
                    <Header as="h1">Use of the Charitable Impact  System</Header>
                    <p>You agree not to use the Charitable Impact  System or the Information for any commercial use, without the prior written authorization of the Charitable Impact  Collective. Without limiting the generality of the foregoing, prohibited commercial uses include use of the Charitable Impact  System or the Information for the primary purpose of gaining advertising or subscription revenue and/or the sale of advertising on any third party website without the Charitable Impact Collective’s express approval. Prohibited commercial uses do not include using certain Information expressly designated by the Charitable Impact Collective ("Designated Information") in news releases or on third party websites provided that the primary purpose of using the Designated Information is any use that the Charitable Impact Collective expressly authorizes in writing and is not to gain advertising revenue or compete with the Charitable Impact Collective.</p>
                    <p>You agree that you will comply with any request by the Charitable Impact Collective that you take down any Information or Designated Information you post on any website.</p>
                    <div className="back-top"><a href="#top">Back to top</a></div>
                </Container>
            </div>
            <div id="impact_marks" className="blue-bg-section">
                <Container>
                    <Header as="h1">Use of the Charitable Impact Marks</Header>
                    <p>Subject to your compliance with these Terms of Use, the Charitable Impact  Collective grants you a limited, non-exclusive, royalty free, terminable license to use the Charitable Impact trademarks made available by the Charitable Impact Collective (the "Charitable Impact  Marks") in association with your Impact Account, Community Account, Giving Group Account or Qualified Recipient Account and in strict compliance with the Charitable Impact Marks use guidelines (the "Guidelines") as may be posted on the Site from time to time. When using the Charitable Impact Marks you agree to comply with the Guidelines and with all instructions, standards of quality, trademark specifications and other conditions supplied by the Charitable Impact Collective from time to time.</p>
                    <p>You acknowledge and agree that you have no rights, title, or interest in or to the Charitable Impact  Marks, nor any part thereof, except the use of the same as herein set out and that nothing in these Terms of Use shall be construed as an assignment or grant to you of any right, title, or interest in or to the Charitable Impact  Marks and that all goodwill relating to the Charitable Impact Marks shall accrue to and be the property of the Charitable Impact Collective.</p>
                    <div className="back-top"><a href="#top">Back to top</a></div>
                </Container>
            </div>
            <div id="disclaimers" className="white-bg">
                <Container>
                    <Header as="h1">Disclaimers</Header>
                    <p>THE CHARITABLE IMPACT COLLECTIVE, TO THE FULLEST EXTENT PERMITTED BY LAW, DISCLAIMS ANY AND ALL WARRANTIES, EITHER EXPRESS OR IMPLIED, STATUTORY OR OTHERWISE, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT OF THIRD PARTIES' RIGHTS, AND FITNESS FOR PARTICULAR PURPOSE. THE CHARITABLE IMPACT COLLECTIVE MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND INCLUDING, WITHOUT LIMITATION ANY REPRESENTATIONS OR WARRANTIES ABOUT THE ACCURACY, RELIABILITY, COMPLETENESS, CURRENCY OR TIMELINESS OF THE CHARITABLE IMPACT SYSTEM OR THE SERVICES AND YOU ACKNOWLEDGE AND AGREE THAT THE CHARITABLE IMPACT SYSTEM AND THE SERVICES ARE PROVIDED ON AN "AS IS" BASIS. THE CHARITABLE IMPACT COLLECTIVE DOES NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR ANY PRODUCT OR SERVICE ADVERTISED OR OFFERED BY A THIRD PARTY THROUGH THE CHARITABLE IMPACT SYSTEM OR THE SERVICES OR ANY HYPERLINKED WEBSITE OR FEATURED IN ANY BANNER OR OTHER ADVERTISING AND THE CHARITABLE IMPACT COLLECTIVE WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND A USER, A GIVING GROUP MEMBER, A QUALIFIED RECIPIENT OR ANY THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES.</p>
                    <div className="back-top"><a href="#top">Back to top</a></div>
                </Container>
            </div>
            <div id="limitation_of_liability" className="blue-bg-section">
                <Container>
                    <Header as="h1">Limitation of Liability</Header>
                    <p>YOU ACKNOWLEDGE THAT ANY USE OF OR RELIANCE ON THE CHARITABLE IMPACT SYSTEM OR ON THE SERVICES AND/OR YOUR MAKING OF OR RECEIVING ANY DONATION IS COMPLETELY AT YOUR OWN RISK. YOU AGREE THAT THE CHARITABLE IMPACT COLLECTIVE SHALL NOT BE RESPONSIBLE OR LIABLE FOR ANY LOSS, DAMAGES, CLAIMS OR LIABILITIES WHATSOEVER (INCLUDING WITHOUT LIMITATION, DIRECT, INDIRECT, SPECIAL, PUNITIVE OR CONSEQUENTIAL DAMAGES OR DAMAGES FOR HARM TO BUSINESS, LOSS OF INFORMATION OR PROGRAMS OR DATA, LOSS OF PROFIT, LOSS OF SAVINGS OR LOSS OF REVENUE), ARISING FROM OR IN CONNECTION WITH THE USE OF OR ACCESS TO, OR THE INABILITY TO USE OR ACCESS, THE CHARITABLE IMPACT SYSTEM, THE SERVICES AND/OR ANY INFORMATION STORED, PROVIDED OR OTHERWISE COMMUNICATED BETWEEN YOU AND THE CHARITABLE IMPACT COLLECTIVE (WHETHER ARISING IN CONTRACT, TORT, NEGLIGENCE, EQUITY, COMMON LAW OR OTHERWISE) EVEN IF THE CHARITABLE IMPACT COLLECTIVE HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE OR LOSS. THE CHARITABLE IMPACT COLLECTIVE ASSUMES NO LIABILITY OR RESPONSIBILITY FOR ANY (I) PERSONAL INJURY, PROPERTY, BODILY, OR MATERIAL DAMAGE OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF THE CHARITABLE IMPACT SYSTEM, THE SERVICES OR YOUR MAKING OR RECEIVING ANY DONATION, (II) ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION STORED THEREIN, (III) ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM THE CHARITABLE IMPACT SYSTEM, (IV) ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE WHICH MAY BE TRANSMITTED TO OR THROUGH THE CHARITABLE IMPACT SYSTEM, AND/OR (V) ANY ERRORS OR OMISSIONS IN ANY INFORMATION, INCLUDING WITHOUT LIMITATION THE CONTENT OF THE CHARITABLE IMPACT SYSTEM.</p>
                    <div className="back-top"><a href="#top">Back to top</a></div>
                </Container>
            </div>
            <div id="indemnity" className="white-bg">
                <Container>
                    <Header as="h1">Indemnity</Header>
                    <p>You agree to indemnify and hold harmless the Charitable Impact Collective, and its affiliates, and its and their officers, directors, agents, partners and employees from and against any and all claims, demands, liabilities, costs, expenses or damages whatsoever including without limitation legal fees and disbursements on a solicitor and own client basis, resulting directly or indirectly, from your access to or your use of the Charitable Impact System, your use of, reliance on, publication, communication or distribution of any Information, your use of the Services, your making or receiving any Donation or your violation of any law or regulation.</p>
                    <div className="back-top"><a href="#top">Back to top</a></div>
                </Container>
            </div>
            <div id="cookies" className="blue-bg-section">
                <Container>
                    <Header as="h1">Cookies</Header>
                    <p>The Charitable Impact System may utilize "cookies" and other tracking technologies. A "cookie" is a small text file that may be used, for example, to collect information about Internet activity. Some cookies and other technologies may serve to recall personal information previously indicated by a user. Most browsers allow you to control cookies, including whether or not to accept them and how to remove them. You may set most browsers to notify you if you receive a cookie, or you may choose to block cookies with your browser, but please note that if you choose to erase or block your cookies, certain portions of the Charitable Impact System may become inaccessible.</p>
                    <div className="back-top"><a href="#top">Back to top</a></div>
                </Container>
            </div>
            <div id="third_party_sites" className="white-bg">
                <Container>
                    <Header as="h1">Third Party Internet Sites</Header>
                    <p>The Charitable Impact System contains links to third party websites that are not under the control of the Charitable Impact Collective. You understand that the Charitable Impact Collective provides these links as a convenience only and the inclusion of such links does not imply that the Charitable Impact  Collective endorses or accepts any responsibility for the content or uses of such.</p>
                    <div className="back-top"><a href="#top">Back to top</a></div>
                </Container>
            </div>
            <div id="ability_to_accept_terms" className="blue-bg-section">
                <Container>
                    <Header as="h1">Ability to Accept Terms of Use</Header>
                    <p>You affirm that you are either more than the age of majority in your jurisdiction of residence, or an emancipated minor, or possess legal parental or guardian consent, and are fully able and competent to enter into the terms, conditions, obligations, affirmations, representations and warranties set forth in these Terms of Use.</p>
                    <div className="back-top"><a href="#top">Back to top</a></div>
                </Container>
            </div>
            <div id="privacy_policy" className="white-bg">
                <Container>
                    <Header as="h1">Privacy Policy</Header>
                    <p>The Privacy Policy posted on the Site forms part of these Terms of Use. You agree to be bound by the Privacy Policy. The Privacy Policy can be viewed at Privacy Policy.</p>
                    <div className="back-top"><a href="#top">Back to top</a></div>
                </Container>
            </div>
            <div id="amendments_to_terms" className="blue-bg-section">
                <Container>
                    <Header as="h1">Amendments to Terms of Use/Assignment</Header>
                    <p>The Charitable Impact Collective may, in its sole discretion, modify or revise these Terms of Use from time to time without notice and you agree to be bound by such modifications or revisions. You should visit this page periodically to review these Terms of Use. Nothing in these Terms of Use shall be deemed to confer any third party rights or benefits. You may not assign your rights, obligations or liabilities under these Terms of Use without our express written consent, which may be withheld at our sole discretion. We may assign these Terms of Use and its rights and obligations without your consent or notice to you.</p>
                    <div className="back-top"><a href="#top">Back to top</a></div>
                </Container>
            </div>
            <div id="general" className="white-bg">
                <Container>
                    <Header as="h1">General</Header>
                    <p>These Terms of Use and the use of this Charitable Impact System shall be governed by the laws of British Columbia, Canada. You irrevocably submit to the exclusive jurisdiction of the courts located in the Province of British Columbia. The Charitable Impact Collective makes no representations that the Charitable Impact System or the Services are available for use in other locations. Those who access or use the Charitable Impact System from other jurisdictions do so at their own volition and are responsible for compliance with local law. If any provision hereof is held by a court of competent jurisdiction to be invalid, it shall be severed and the remaining provisions shall remain in full force without being invalidated in any way. You agree that no joint venture, partnership, employment, or agency relationship exists between you and the Charitable Impact Collective as a result of these Terms of Use or your use of this Charitable Impact System or the Services. The Charitable Impact Collective shall be excused from performance under these Terms of Use if the Charitable Impact Collective is prevented, forbidden or delayed from performing, or omits to perform, any act or requirement under these Terms of use by reason of: (a) any provision of any present or future law or regulation, (b) any act or omission of a third party, or (c) any act of God, emergency condition, war, computer or telecommunications or other technological failure or other circumstances beyond the control of the Charitable Impact Collective. The terms, provisions, covenants, and conditions contained in these Terms of Use which, by their terms, require their performance after the expiration or other termination of these Terms of Use will be and remain enforceable notwithstanding the expiration or other termination of these Terms of Use for any reason whatsoever.</p>
                    <div className="back-top"><a href="#top">Back to top</a></div>
                </Container>
            </div>
            {/* <div className="blue-bg-section">
                <Container>
                    <a name="top"></a>
                    <Header as="h1">Content/Reserved Rights</Header>
                    <p>Copyright © 2017 CHIMP Technology Inc. of Vancouver, British Columbia, Canada. All rights reserved.</p>
                    
                    <div className="back-top"><a href="#top">Back to top</a></div>
                </Container>
            </div> */}
        </Layout>
    );
}

export default TermsConditions;
