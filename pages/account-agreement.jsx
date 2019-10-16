import React from 'react';
import {
    Container,
    Button,
    Header,
    Grid,
    List,
    Segment,
} from 'semantic-ui-react';
import getConfig from 'next/config';

import Layout from '../components/shared/Layout';
import '../static/less/account_agreement.less';

const { publicRuntimeConfig } = getConfig();
const {
    CORP_DOMAIN,
} = publicRuntimeConfig;

function ChimpAccountAgreement() {
    return (
        <Layout>
            <div className="chimp_account_banner">
                <Container>
                    <div className="banner-heading">
                        <Header as="h3">
                        Charitable Impact Account Agreement
                        </Header>
                    </div>
                </Container>
            </div>
            <div className="chimp_account_full">
                <Container>
                    <div className="chimp_account_banner_text">
                        <p>
                            This Charitable Impact Account Agreement (the <span className="bold"> "Agreement"</span>) is a legal agreement between you, when you become a user of the Charitable Impact System, and the Charitable Impact Collective (as defined in this Agreement). In this Agreement, the Charitable Impact Collective shall be referred to as the<span className="bold">"Charitable Impact Collective"</span>,<span className="bold">"we"</span>,<span className="bold">"our"</span> or <span className="bold">"us"</span> and you shall be referred to as <span className="bold">"you"</span> or as a <span className="bold">"User"</span>.</p>
                    </div>
                </Container>
            </div>
            <div className="chimp_account_box_full">
                <Container>
                    <div class="chimp_account_box">
                        <p>
                        By clicking the AGREE button, the SIGN UP button, or by using the Charitable Impact System or the Services we provide or by making a Donation, you accept the terms and conditions set out in this Agreement and confirm that you have authority to enter into this Agreement and authority to perform the obligations of a User set out herein.
                        </p>
                    </div>
                </Container>
            </div>
            <div className="blue-bg-section">
                <Container>
                    <Header as="h1">1. Definitions</Header>
                    <p>1.1 In this Agreement,</p>
                    <p><strong>"Account"</strong> means an account established with the Foundation by you, or your predecessor, where applicable, in accordance with this Agreement, but does not include a Charitable Investment Account;</p>
                    <p><strong>"Account Identification"</strong> means the identification name(s), number(s) and/or password(s) that we authorize you to use which enable you to access your Account, use the Services, make Donations and Transfers, and recommend or receive Disbursements;</p>
                    <p><strong>"Administrator"</strong> means a User designated by a Community, Giving Group, or Qualified Recipient and authorized by us to act as an administrator as contemplated in paragraphs 7.3, 9.2 and 10.4.;</p>
                    <p><strong>"Auditor"</strong> means the auditor, or public accountant, of the Foundation from time to time, which is currently Deloitte LLP. At any given time, the Foundation may appoint another firm of chartered professional accountants to act as the auditor. If another firm is appointed, "Auditor" shall mean that firm;</p>
                    <p><strong>"Charitable Impact Collective”</strong> means the Foundation, CHIMP ServiceCo and CHIMP Tech, collectively;</p>
                    <p><strong>"Charitable Impact System"</strong> means the website located at charitableimpact.com owned by CHIMP Tech together with any technology proprietary to or licensed to CHIMP Tech and used by a User, Community, Giving Group, Qualified Recipient or One-Time Donor;</p>
                    <p><strong>"Charitable Investment Account"</strong> means an account established with the Foundation by you, or your predecessor, where applicable, as contemplated in this Agreement under a Charitable Investment Account Agreement;</p>
                    <p><strong>"Charitable Investment Account Agreement"</strong> means an agreement under which you, or your predecessor, where applicable, establish a Charitable Investment Account;</p>
                    <p><strong>"CHIMP ServiceCo"</strong> means CHIMP Services Inc.;</p>
                    <p><strong>"CHIMP Tech"</strong> means CHIMP Technology Inc.;</p>
                    <p><strong>"Community"</strong> means a User who, on behalf of an existing or contemplated group of Users, has entered into this Agreement with the Charitable Impact Collective to use the Charitable Impact System and the Services, to make Donations, to make recommendations regarding Disbursements, to give instructions regarding Transfers, to create a Community Giving Program, and to enable one or more members of the Charitable Impact Collective to provide additional and/or premium services to the Community from time to time, and “Communities” has a corresponding meaning;</p>
                    <p><strong>"Community Giving Program"</strong> means a program created by a Community Administrator using a Community Account to create a Community Transfer and matching policy for Community Members, create Giving Group matching or Transfer policies, send content to and communicate with Community Members, and to collect data about participation in and the impact of the giving program using the Charitable Impact System and the Services;</p>
                    <p><strong>"Default Instruction"</strong> means a notice given in writing by the User or a Designated Advisor in the manner determined by the Foundation, instructing the Foundation to make a Transfer to another Impact Account and/or Giving Group Account. However, if there is no Account to which the Transfer can be made and if no such Account is opened within thirty (30) days of the time when the Default Instruction otherwise becomes operative, the funds will be retained in the Account, subject to Section 8;</p>
                    <p><strong>"Default Recommendation"</strong> means a notice given in writing by the User or a Designated Advisor in the manner determined by the Foundation, recommending a Qualified Recipient, to which the remaining assets in the Charitable Impact Account are to be Disbursed if no valid subsequent recommendation has been made;</p>
                    <p><strong>"Designated Advisor"</strong> means the Person designated as such and described below in Section 6;</p>
                    <p><strong>"Disbursement"</strong> or <strong>"Disburse"</strong> means a disbursement to a Qualified Recipient authorized by the Foundation and includes any single or multiple authorized disbursement(s) from an Impact Account, a Giving Group Account or a Community Account to a Qualified Recipient. For purposes of this Agreement, a Transfer is not a Disbursement;</p>
                    <p><strong>"Disbursement Request"</strong> means a request made by us as contemplated in paragraph 8.1 of this Agreement;</p>
                    <p><strong>"Donations"</strong> includes any funds, monies, securities and other property donated to the Foundation by a User or other Person including a One-Time Donor for credit to an Account maintained by the Foundation;</p>
                    <p><strong>"Foundation"</strong> means CHIMP: Charitable Impact Foundation (Canada), a charity registered with Canada Revenue Agency.The Foundation is a non-share capital corporation that was originally incorporated under the Canada Corporations Act, Income Tax Act (Canada), has had audited financial statements since its fiscal year-end 2011 and has continued under the Canada Not-for-profit Corporations Act.;</p>
                    <p><strong>"Giving Group"</strong> means a group of Users, One-Time Donors and other Persons who have formed and/or participated in a designated group using the Charitable Impact  System consistent with this Agreement, the purpose of which is to Disburse or Transfer funds as a group and to use the Charitable Impact System and certain services as a group, as described below in Section 9;</p>
                    <p><strong>"License"</strong> means the license referred to in Section 2 of this Agreement;</p>
                    <p><strong>"Member"</strong> means a Person who Transfers funds to an account for the credit of, or participates in, a Community or Giving Group and may include you;</p>
                    <p><strong>"Minimum Disbursement"</strong> means a Disbursement referred to in paragraph 8.1 of this Agreement;</p>
                    <p><strong>"One-Time Donor"</strong> means a Person other than a User or a Community who makes a Donation to the Foundation for credit to an account of a Qualified Recipient and/or for credit to the account of a Giving Group, on or through the Charitable Impact  System;</p>
                    <p><strong>"Person"</strong> means an individual, a corporation, a partnership, a trust, an unincorporated organization, and the executors, administrators or other legal representatives of an individual;</p>
                    <p><strong>"Privacy Policy"</strong> means the policy which is available for review on the Charitable Impact System referred to in paragraph 3.1 of this Agreement;</p>
                    <p><strong>"Profile"</strong> means the profile generated in the Charitable Impact System based on the information provided to us, and for Qualified Recipients information made publically available about you from the Canada Revenue Agency.</p>
                    <p><strong>"Qualified Recipient"</strong> means a registered charity and/or other entity classified at the relevant time as a "qualified donee" under the Income Tax Act (Canada) which has been approved by us as an eligible donee, and includes the Foundation;</p>
                    <p><strong>"Services"</strong> means, after the creation of your Charitable Impact Account, your permitted access to the Charitable Impact System and use of your Impact Account for the limited purpose of making Donations, making recommendations regarding Disbursements and giving instructions regarding Transfers, receiving Disbursements, the creation of or joining a Giving Group Account, posting, searching and/or uploading certain information and reviewing certain information posted by one or more members of the Charitable Impact Collective, other Users, Qualified Recipients, Communities or Giving Group Members on the Charitable Impact System and may include additional services and/or premium services offered by one or more members of the Charitable Impact Collective from time to time;</p>
                    <p><strong>"Termination Notice"</strong> means a notice given pursuant to paragraph 13.1 of this Agreement;</p>
                    <p><strong>"Transfer"</strong> or <strong>"Transferred"</strong> means any transfer of funds or other assets from or to one or more accounts on the Charitable Impact System;</p>
                    <p><strong>"User"</strong> means you, after you have entered into this Agreement with the Charitable Impact Collective, or your successor, your permitted assign, or your heir, executor, administrator or other legal representative, as the context may require or permit, and includes other Persons who are Users, as the context may require or permit; and</p>
                </Container>
            </div>
            <div className="white-bg">
                <Container>
                    <Header as="h1">2. Site License</Header>
                    <p>
                        2.1 The Charitable Impact System is owned by CHIMP Tech. Upon your acceptance of this Agreement, you are granted a non-transferable, non-exclusive, limited license to use the Charitable Impact System (with no right to sublicense on your part) (the 
                        <strong>
                            "License"
                        </strong>
                        ), on the terms set out in this Agreement.
                    </p>
                    <p>2.2 We reserve all rights not explicitly granted herein. The License granted to you in this Agreement is non-exclusive. Nothing in this Agreement shall be construed as limiting in any manner our marketing or distribution activities or the licensing of the Charitable Impact System by us to any other Person.</p>
                    <p>2.3 You agree not to:</p>
                    <div className="site-licence">
                        <List as="ul" className="alphabetList">
                            <List.Item as="li" className="Principles_list">use, copy, republish or distribute any confidential information about, or any part of, the Charitable Impact System, or cause or permit any Person to use, copy, republish or distribute such information about, or part of, the Charitable Impact System, except as expressly permitted under this Agreement;</List.Item>
                            <List.Item as="li" className="Principles_list">loan, sell, rent, lease, timeshare, sublicense, grant a security interest in, or otherwise attempt to transfer or assign your License to the Charitable Impact System, in whole or in part to any Person;</List.Item>
                            <List.Item as="li" className="Principles_list">directly or indirectly attempt in any way to rewrite, reorganize, reproduce, decompile, disassemble, reverse engineer or translate the Charitable Impact System, create derivative works thereof, or circumvent any usage or other restrictions imposed by us; or</List.Item>
                            <List.Item as="li" className="Principles_list">remove, alter or modify any proprietary notices or labels from the Charitable Impact System.</List.Item>
                        </List>
                    </div>
                    <p>2.4 You agree that this Agreement does not grant you any rights to use any of our trademarks or trade names, or the trademark or trade names of our licensors. All such trademarks remain the property of their respective owner.</p>
                </Container>
            </div>
            <div className="blue-bg-section">
                <Container>
                    <Header as="h1">3. Information, Privacy and Access</Header>
                    <p>3.1 You agree as follows:</p>
                    <div className="information-privacy">
                        <List as="ul" className="alphabetList">
                            <List.Item as="li" className="Principles_list">to provide us with accurate and complete information as may be required so that we may complete your User Profile and issue official charitable donation tax receipts in compliance with the <i>Income Tax Act</i> (Canada) and its regulations for eligible Donations to the Foundation;</List.Item>
                            <List.Item as="li" className="Principles_list">to notify us of any change in the information that you provided to us within ten (10) days of such change becoming known to you;</List.Item>
                            <List.Item as="li" className="Principles_list">
                                you consent to our (and our agents’ and contractors’) use and storage of any information you provide to us provided that we will use such information in accordance with the Privacy Policy as amended from time to time which is available for review on the Charitable Impact System or at
                                <a href="/privacy">
                                &nbsp;charitableimpact.com/privacy
                                </a>
                                &nbsp;(the
                                <strong>"Privacy Policy"</strong>
                                );
                            </List.Item>
                            <List.Item as="li" className="Principles_list">we have the right, but not the obligation, to verify any information you disclose to us;</List.Item>
                            <List.Item as="li" className="Principles_list">all information you provide to us under this Agreement is true, accurate and complete and you acknowledge and agree that we may disclose such information to the Canada Revenue Agency as required by law;</List.Item>
                            <List.Item as="li" className="Principles_list">to take all reasonable steps to prevent any unauthorized Person from accessing your Account Identification including, without limitation:</List.Item>
                            <div className="account-privacy">
                                <List.List as="ul">
                                    <List.Item as="li"> maintaining your Account Identification in strict confidence; and</List.Item>
                                    <List.Item as="li">ensuring that access to your Account is turned/logged off when not in use by you;</List.Item>
                                </List.List>
                            </div>
                            <List.Item as="li">we, in our sole discretion, may:</List.Item>
                            <List.List as="ul">
                                <List.Item as="li" className="Principles_list">refuse to establish a Profile and/or an Account for you or any other Person;</List.Item>
                                <List.Item as="li" className="Principles_list">refuse to allow you or any other Person to make a Donation to the Foundation for credit to an Account;</List.Item>
                                <List.Item as="li" className="Principles_list">refuse to allow you or any other Person to Transfer funds to or from an Account;</List.Item>
                                <List.Item as="li" className="Principles_list">refuse to allow any User or other Person to participate in a Community or Giving Group;</List.Item>
                                <List.Item as="li" className="Principles_list">refuse to allow a One-Time Donor to make a Donation to the Foundation for credit to a Qualified Recipient Account; or</List.Item>
                                <List.Item as="li" className="Principles_list">terminate your Account and/or your access to the Charitable Impact System, if we reasonably believe that you or any unauthorized Person that accesses your Account or the Charitable Impact System through you has misused your Account or the Charitable Impact System;</List.Item>
                            </List.List>
                        </List>
                    </div>
                    <p>3.2 From time to time, other Users, Giving Group Members, Communities, Qualified Recipients and Persons other than members of the Charitable Impact Collective may post content and/or comments to the Charitable Impact System. You acknowledge and agree that we are not responsible for nor do we necessarily endorse any content and/or comments posted.</p>
                    <p>3.3  We want people to use Charitable Impact to express their giving and to share initiatives that are important to them, but not at the expense of the safety and well-being of others or the integrity of the Charitable Impact Collective. You therefore agree not to engage in the conduct described below (or to facilitate or support others in doing so):</p>
                    <p>You may not use our products to do or share anything:</p>
                    <List as="ul" className="alphabetList">
                        <List.Item as="li" className="Principles_list">that is unlawful, misleading, discriminatory or fraudulent;</List.Item>
                        <List.Item as="li" className="Principles_list">infringes or violates someone's rights, including their intellectual property.</List.Item>
                    </List>
                    <p>We can remove or restrict access to content that is in violation of these provisions.</p>
                    <p>3.4 The Privacy Policy (charitableimpact.com/privacy) and Terms of Use (charitableimpact.com/terms-of-use) form part of this Agreement and you agree to be bound by both.</p>
                </Container>
            </div>
            <div className="white-bg">
                <Container>
                    <Header as="h1">4. Charitable Impact Collective Obligations</Header>
                    <p>4.1 Upon receipt of the required information from you and subject to your compliance with this Agreement, we agree that:</p>
                    <div className="site-licence">
                        <List as="ul" className="alphabetList">
                            <List.Item as="li" className="Principles_list">we may establish an Account and a Profile for you and provide you with the Account Identification to enable you to use the Services;</List.Item>
                            <List.Item as="li" className="Principles_list">we will maintain appropriate records for each Account;</List.Item>
                            <List.Item as="li" className="Principles_list">we may provide you with information from time to time regarding the Charitable Impact System and the Services;</List.Item>
                            <List.Item as="li" className="Principles_list">we will maintain confidentiality of any information that you provide us in a manner that is consistent with applicable legislation and in accordance with our Privacy Policy;</List.Item>
                            <List.Item as="li" className="Principles_list">we will make a report of all Donations, Disbursements, Transfers and administrative costs relating to your Account available to you, Members of your Community or Giving Group, and Administrators or other designated persons;</List.Item>
                            <List.Item as="li" className="Principles_list">our financial statements will be subject to an annual audit by the Auditor;</List.Item>
                            <List.Item as="li" className="Principles_list">we will use the Donations in a way that is consistent with the laws governing registered charities in Canada;</List.Item>
                            <List.Item as="li" className="Principles_list">we will provide you or any other Person who makes a Donation to the Foundation with an electronic copy of an official charitable donation tax receipt showing the eligible amount of the Donations and containing prescribed information in accordance with the Regulations under the <i>Income Tax Act.</i></List.Item>
                        </List>
                    </div>
                </Container>
            </div>
            <div className="blue-bg-section">
                <Container>
                    <Header as="h1">5. Donations</Header>
                    <p>5.1 The balance in your Account at any given time shall consist of the fair market value of all assets held in your Account at such time less the value at the relevant time of all Disbursements and Transfers made in accordance with Section 7 of this Agreement and less all amounts deducted in accordance with paragraph 5.4 of this Agreement prior thereto.</p>
                    <p>5.2 All Donations made to your Account shall be given to the Foundation by you or by the Person who made such Donations irrevocably and shall become the property of the Foundation and the Foundation will hold such Donations in its normal corporate capacity.</p>
                    <p>5.3 The Foundation may invest the assets held in the Accounts at the Foundation's sole and unfettered discretion, and may retain assets received on a Transfer or from a Donor, in the Foundation's sole and unfettered discretion. Any income received or earned or gains realized from such investments shall be the Foundation's property and shall be applied to the Foundation's administrative costs, including its out-of-pocket costs, or shall be otherwise used by the Foundation for charitable purposes. Without limiting the generality of the foregoing, the Foundation shall not be obligated to invest any of the assets held in your Account in any particular manner to achieve any particular investment result and you and your Designated Advisor, on your own behalf and on behalf of your heirs, executors, representatives, administrators, successors and permitted assigns, release the Foundation from any claims you or they may have with respect to the investment of the funds in your Account and waive any claims that you or they may have in that regard. Assets whose purpose is to achieve a particular investment result may be held in a Charitable Investment Account outside the Account.</p>
                    <p>5.4 All administrative costs incurred by the Foundation in furtherance of obtaining, disbursing, transferring or otherwise handling Donations, Disbursements and/or Transfers and administering and/or investing funds associated to the Account, may be deducted from the funds or other assets held in the Account, as the case may be. Without limiting the generality of the foregoing, the Foundation may deduct from the funds or other assets held in such Account, reimbursements for amounts that it has paid and a reasonable fee for its services.</p>
                    <p>
                        5.5 The governing principle underlying all investment and administrative policies relating to Accounts is to protect the underlying financial value of the assets in the Account and to provide liquidity such that recommendations with regard to Disbursements made by Users, Designated Advisors, Community Administrators and Giving Group Administrators can be fulfilled on demand. The Foundation will notify the holder of the Account, the Designated Advisor, the Community Administrator or the Giving Group Administrator, as the case may be, if it intends to increase the fees or costs that are deducted from the Account over those outlined at
                        &nbsp;<a href={`${CORP_DOMAIN}/fees/`}>charitableimpact.com/fees.</a>
                    </p>
                    <p>Neither you nor any other Person may receive any tangible benefit or privilege in return for, or as a result of, making a Donation.</p>
                                
                </Container>
            </div>
            <div className="white-bg">
                <Container>
                    <Header as="h1">6. Designated Advisors</Header>
                    <p>6.1 For each individual User Account (the “Impact Account”), a person, who may be the User, shall be designated as the Designated Advisor. The initial Designated Advisor shall be the User who creates the Impact Account. The User may also designate another Person as the Designated Advisor. The User or the Person so designated shall cease to be the Designated Advisor on his or her death, or on retiring and so advising the Foundation and the User (where applicable and where the User is not the Designated Advisor) in writing.</p>
                    <p>6.2 The User, or the retiring Designated Advisor, as the case may be, may designate a replacement, by giving notice in writing to the Foundation and the User, where applicable.</p>
                    <p>6.3 A Designated Advisor who is not the User shall have the same rights and duties with respect to the Impact Account as if the Designated Advisor were the User. In particular, a Designated Advisor shall be entitled to receive information and have access and may make recommendations and give instructions to the Foundation, unless the User revokes the designation and advises the Foundation otherwise in writing. For greater certainty, a User may designate another Person to be a Designated Advisor and continue to be a Designated Advisor. In case of uncertainty, the Foundation may rely on and act on recommendations and/or instructions from the User rather than those of other Designated Advisors.</p>
                    <p>6.4 If a User dies and there is no Designated Advisor for the Account, the executors or other personal representatives of the User may act as the Designated Advisor. If at any time the Foundation reasonably believes there is no Designated Advisor for an Account and is unable, after reasonable efforts, to contact the User or the Designated Advisor who was last designated according to the Foundation's records, paragraph 13.1 will apply.</p>
                </Container>
            </div>
            <div className="blue-bg-section">
                <Container>
                    <Header as="h1">7. Disbursements and Transfers</Header>
                    <p>7.1 Funds or other assets may be Disbursed from an Account only to Qualified Recipients but can be Transferred to other Accounts. Funds or other assets can be Transferred from your Account to your Charitable Investment Account, but no recommendations for Disbursements may be made from a Charitable Investment Account. Funds or other assets may be Transferred from your Charitable Investment Account to an Account from which Disbursements may be made.</p>
                    <p>7.2 A User, Designated Advisor, or Administrator may submit to us recommendations regarding Disbursements from an Account to Qualified Recipients and may submit to us instructions regarding Transfers from your Account to another Account or from your Charitable Investment Account to an Account. However, while we will strictly follow instructions regarding Transfers, we retain ultimate discretion and authority to make or not make Disbursements and we are not bound by any recommendations. If there is no Account to which the Transfer can be made, and if no such Account is opened within thirty (30) days of our receipt of the instructions for Transfer, we will put the funds or other assets back into the account of the Transferor.</p>
                    <p>7.3 We fully consider the recommendations made by Users, Designated Advisors, and Administrators. However, in order to comply with applicable legal requirements, the Foundation retains the final discretion and authority with regard to Disbursements. Disbursements from your Account shall be made at such times, in such amounts, in such ways and for such purposes as we may determine in our sole and unfettered discretion.</p>
                    <p>7.4 After any Disbursement or Transfer is made from your Account, an electronic record of such Disbursement or Transfer will be made available to you on the Charitable Impact System.</p>
                    <p>7.5 Notwithstanding any of the other provisions of this Agreement, when a Transfer is made from one or more Accounts on the Charitable Impact System, the Charitable Impact Collective will have no obligation to ensure that the holder of the Account to which the Transfer has been made will recommend that the Foundation Disburse funds to a particular Qualified Recipient. When funds or other assets in a Giving Group Account are applied to a campaign or to a movement, the Giving Group Administrator or other designated person dealing with the Giving Group Account will have total discretion and the Charitable Impact Collective will have no obligation to the Giving Group Members or to a particular campaign or movement with respect to such application.</p>
                    <p>7.6 A User or Designated Advisor may give a Default Instruction or a Default Recommendation to the Foundation. If a valid Default Recommendation is in effect at the relevant time, the Foundation will take it into account in deciding when and how to make a Disbursement to a Qualified Recipient. If a valid Default Instruction is in effect at the relevant time, the Foundation will act in accordance with that Instruction, subject to the other provisions of this Section 7 and in particular paragraphs 7.2, 7.3 and 7.5.</p>
                    <p>7.7 Neither you nor any other Person may receive any tangible benefit or privilege in return for a Disbursement or Transfer from any Account. No Disbursement or Transfer from any Account may be used to discharge or satisfy a legally enforceable obligation of any Person.</p>
                    <p>7.8 Upon the termination of an Account, we will Disburse any funds or other assets remaining in the Account in our sole and unfettered discretion to one or more Qualified Recipients, which may include us, subject to any valid Default Recommendation.</p>
                </Container>
            </div>
            <div className="white-bg">
                <Container>
                    <Header as="h1">8. Minimum Account Activity</Header>
                    <p>8.1 The Charitable Impact Collective has a mandate to facilitate Donations for the good of the charitable sector and not simply for the issuance of Donation tax receipts. Consequently, while we plan to encourage Donations to the Foundation, we simultaneously will encourage Users, Designated Advisors, and Administrators to Disburse funds or other assets to Qualified Recipients so they can be used for charitable programming and activities that advance causes and communities.</p>
                    <p>
                        In order to encourage Disbursements, if in any period of twelve (12) consecutive months the total Disbursements from your Account are less than five percent (5%) of the Donations and Transfers received in your Account in the same period or the average value of the net assets held in your Account at the end of each month during the previous twelve (12) consecutive months, whichever is greater, we may contact you to request (a
                        <strong>
                        &nbsp;"Disbursement Request"
                        </strong>
                        ) that you recommend a Disbursement (a
                        <strong>
                        &nbsp;"Minimum Disbursement"
                        </strong>
                        ) to one or more Qualified Recipients. A Minimum Disbursement means five percent (5%) of the greater of:
                    </p>
                    <div className="site-licence">
                        <List as="ul" className="alphabetList">
                            <List.Item as="li"> the total of the Donations and Transfers received in your Account in the previous twelve (12) consecutive months less all Disbursements and Transfers made in that period; and</List.Item>
                            <List.Item as="li">the average of the value of the net assets held in your Account at the end of each month during the previous twelve (12) consecutive months, less all Disbursements and Transfers made in that period.</List.Item>
                        </List>
                    </div>
                    <p>
                        8.2 In addition to Charitable Impact Collective's mandate described in paragraph 8.1, the Foundation has adopted policies to comply with applicable tax law and the disbursement quota requirements for public foundations in the
                        <i>
                            Income Tax Act.
                        </i>
                    </p>
                    <p>8.3 Transfers made to other Accounts during the relevant twelve (12)-month period will be reflected in the Disbursement calculations of the destination Account. However, if it appears to the Foundation that Transfers are being made with the intention of avoiding Minimum Disbursement requirements, we retain the right to make Disbursement Requests at our discretion.</p>
                    <p>8.4 If you do not respond to our Disbursement Request within sixty (60) days, the Foundation may Disburse, in the Foundation's sole and unfettered discretion, the Minimum Disbursement from your Account to one or more Qualified Recipients, including the Foundation for its own use, subject to any valid Default Recommendation that is in effect.</p>
                    <p>8.5 Notwithstanding paragraph 8.1 of this Agreement, an Account must maintain a minimum activity level of at least one Disbursement for each period of twelve (12) consecutive months, starting with the second such period that ends after the creation of the Account, based on receipt of a recommendation contemplated in paragraph 7.2 of this Agreement. Failure to maintain a minimum activity level may result in termination of the Impact Account.</p>
                    <p>8.6 The rights of the Foundation as set out in this section 8 including, without limitation, the right to make a Disbursement Request and the right to make a Minimum Disbursement are at the sole and unfettered discretion of the Foundation. Failure by the Foundation to exercise of any of its rights under this section 8 shall not be construed to be a waiver of any other right contained in this Agreement.</p>
                </Container>
            </div>
            <div className="blue-bg-section">
                <Container>
                    <Header as="h1">9. Giving Groups</Header>
                    <p>9.1 We recognize that giving together as a group enables donors to better identify a specific cause they wish to support and to organize with a larger number of like-minded donors. We want to create and promote these opportunities through Giving Groups, campaigns, movements and other, more expanded means of collective giving.</p>
                    <p>9.2 Users may create Giving Groups using the Charitable Impact System and invite other Users, One-Time Donors and other Persons to become Giving Group Members. The creator of the Giving Group is by default the Giving Group Administrator and may designate another member of the Giving Group as an Administrator. Each Giving Group may have one or more Administrators.</p>
                    <p>9.3 Giving Groups may Transfer and Disburse funds at the sole individual discretion of each Giving Group Administrator.</p>
                    <p>9.4 A Giving Group may participate in a particular movement, a particular campaign, or a particular expanded means of organizing Giving Groups, campaigns and movements, using the Charitable Impact System.</p>
                    <p>9.5 A Giving Group will have only one Giving Group Account, although records will be maintained by the Charitable Impact Collective for campaigns, movements and other, more expanded means of organizing Giving Groups.</p>
                    <p>9.6 Where a Giving Group participates in a campaign or movement, a Giving Group Member designated by the Giving Group may deal with the Charitable Impact Collective to receive information and have access relating to the campaign or movement from the Charitable Impact System. The member so designated need not be the Giving Group Administrator.</p>
                </Container>
            </div>
            <div className="white-bg">
                <Container>
                    <Header as="h1">10. Qualified Recipients</Header>
                    <p>10.1 Funds or other assets may be Disbursed from an Account only to Qualified Recipients, which may include you.</p>
                    <p>10.2 While we will try to accommodate your preferred method of receiving a Disbursement, all Disbursements will be made in accordance with our standard Disbursement policy then in effect.</p>
                    <p>10.3 After a Disbursement is made to you, an electronic record of such Disbursement will be made available to you on the Charitable Impact System.</p>
                    <p>10.4 The Person employed or otherwise retained by you to create your Qualified Recipient Profile will be your first administrator (the “Qualified Recipient Administrator”) for purposes of this Agreement. You may designate additional Persons to act as your Qualified Recipient Administrator or change your Qualified Recipient Administrator after giving us notice in writing of such designation or change. You confirm that your Qualified Recipient Administrator is authorized to act for and bind you in all matters pertaining to this Agreement. The Person employed or otherwise retained by you to create your Qualified Recipient Profile must have an Account prior to establishing your Qualified Recipient Profile.</p>
                    <p>10.5 Upon creation of your Qualified Recipient Profile and during the term of this Agreement, you are permitted to upload or post your trademark, logo or other identifying mark (the “Qualified Recipient Mark”) to the Charitable Impact System.</p>
                    <p>10.6 If you upload or post your Qualified Recipient Mark to the Charitable Impact System, you grant us a limited, non-exclusive, royalty free license to use that Qualified Recipient Mark to provide the Services to you, and to Users, Members, other Qualified Recipients and other Persons through the Charitable Impact System and through other means of communication.</p>
                    <p>10.7 We agree that all goodwill and ownership rights arising out of our use of the Qualified Recipient Mark shall accrue solely to you. We shall not assert any claim to any goodwill or ownership of the Qualified Recipient Mark by virtue of our licensed use thereof, nor will we dispute or impugn the validity of the Qualified Recipient Mark or the rights of the Qualified Recipient thereto.</p>
                    <p>10.8 We shall not, during or subsequent to the term of this Agreement, adopt, use, or attempt to register any trade-mark, official mark, trade name or domain name confusingly similar with or so nearly resembling the Qualified Recipient Mark as to be likely confused with the Qualified Recipient Mark.</p>
                    <p>10.9 As a Qualified Recipient, you represent to the Charitable Impact Collective that you own and control the use of the Qualified Recipient Mark. If any third party makes any claim, demand, suit or otherwise, against any of the Charitable Impact Collective because of or arising out of our use, in strict accordance with this Agreement, of the Qualified Recipient Mark, we shall promptly notify you in writing. Thereupon, you shall, if requested by us, retain counsel of your own choosing to defend any such claim, demand or suit and you shall indemnify the Charitable Impact Collective from such claim, demand or suit and you shall pay all costs and expenses of defending any such claim, demand or suit.</p>
                    <p>10.10 Each of the Charitable Impact Collective and the Qualified Recipient expressly agree that the parties intend by this Agreement to establish the relationship of licensor and licensee with respect to the Qualified Recipient Mark and that it is not the intention of either party to establish a fiduciary relationship, or to undertake a joint venture or to make the Charitable Impact Collective in any sense an employee, affiliate, associate or partner of the Qualified Recipient with respect to the Qualified Recipient Mark.</p>
                </Container>
            </div>
            <div className="blue-bg-section">
                <Container>
                    <Header as="h1">11. Indemnity and Remedies</Header>
                    <p>11.1 You agree to indemnify and hold harmless the Charitable Impact Collective, each member thereof and their affiliates, and our and their officers, directors, agents, partners and employees from and against any and all claims, demands, liabilities, costs, expenses or damages whatsoever including without limitation legal fees and disbursements on a solicitor and own client basis, resulting directly or indirectly from:</p>
                    <div className="information-privacy">
                        <List as="ul" className="alphabetList">
                            <List.Item as="li" className="Principles_list">your access to or use of the Charitable Impact System and/or use of the Services;</List.Item>
                            <List.Item as="li" className="Principles_list">any breach by you under this Agreement;</List.Item>
                            <List.Item as="li" className="Principles_list">any unauthorized alteration, modification, adjustment or enhancement made by you to the Charitable Impact System;</List.Item>
                            <List.Item as="li" className="Principles_list">the misuse of an Account Identification, an Account or information recorded in a Profile by you; or</List.Item>
                            <List.Item as="li" className="Principles_list">your violation of any law or regulation.</List.Item>
                        </List>
                    </div>
                    <p>11.2 You agree that, in addition to any other rights or remedies we may have for any breach of this Agreement, we have the right to seek an injunction or other equitable relief in any court of competent jurisdiction enjoining a threatened or actual breach of this Agreement by you.</p>
                    <p>11.3 The Charitable Impact Collective agrees to indemnify and hold harmless you and your heirs, executors, representatives, administrators, successors and permitted assigns from and against any and all claims, demands, liabilities, costs, expenses or damages whatsoever including without limitation legal fees and disbursements, resulting directly or indirectly from:</p>
                    <div className="information-privacy">
                        <List as="ul" className="alphabetList">
                            <List.Item as="li" className="Principles_list">any breach by the Charitable Impact Collective under this Agreement;</List.Item>
                            <List.Item as="li" className="Principles_list">the misuse by Charitable Impact Collective of an Account Identification, an Account or information recorded in a Profile; or</List.Item>
                            <List.Item as="li" className="Principles_list">any violation by the Charitable Impact Collective or any law or regulation relating to this Agreement.</List.Item>
                        </List>
                    </div>
                </Container>
            </div>
            <div className="white-bg">
                <Container>
                    <Header as="h1">12. Amendment of Terms</Header>
                    <p>12.1 You acknowledge that we may from time to time to amend, revise or otherwise modify any term of this Agreement in our sole discretion. We will post a revised version of the Agreement on the Charitable Impact System. Your continued use of the Charitable Impact System and/or Services shall be evidence of your acceptance of any such modified terms and conditions of this Agreement.</p>
                </Container>
            </div>
            <div className="blue-bg-section">
                <Container>
                    <Header as="h1">13. Termination</Header>
                    <p>
                        13.1 Either party may terminate this Agreement for any reason by giving the other party a written termination notice (the
                        <strong>
                            "Termination Notice"
                        </strong>
                            ). After receipt of a Termination Notice, if there are any funds, monies or assets in your Account, such funds, monies or assets shall be Disbursed in accordance with Section 7 of this Agreement. If at any time the Foundation reasonably believes that there is no Designated Advisor and is unable, after reasonable efforts, to contact the User or the Designated Advisor who was last designated for the Impact Account according to the Foundation's records, the Foundation may terminate this Agreement by giving notice in accordance with Section 14 of this Agreement or, at its option, may make such Disbursements and/or such Transfers as it determines in its full and unfettered discretion, including Disbursements to itself for its own use, if it is a Qualified Recipient at that time, subject to any valid Default Recommendation.
                    </p>
                </Container>
            </div>
            <div className="white-bg">
                <Container>
                    <Header as="h1">14. Notice</Header>
                    <p>
                        14.1 Any notice required or permitted to be given to us under this Agreement shall be in writing and shall be effective and deemed to have been received upon its delivery by courier to #1250 – 1500 West Georgia St., Vancouver, BC, Canada, V6G 2Z6 or delivery by electronic mail to <u>notice@charitableimpact.com.</u>
                    </p>
                </Container>
            </div>
            <div className="blue-bg-section">
                <Container>
                    <Header as="h1">15. Survival</Header>
                    <p>15.1 All provisions of this Agreement which, by their nature, are intended to survive termination of this Agreement will continue in full force and effect, notwithstanding the termination of this Agreement for any reason.</p>
                </Container>
            </div>
            <div className="white-bg">
                <Container>
                    <Header as="h1">16. Assignment</Header>
                    <p>16.1 You will not assign this Agreement, either directly or indirectly, without our prior written consent, which we may withhold for any reason in our sole and unfettered discretion.</p>
                </Container>
            </div>
            <div className="blue-bg-section">
                <Container>
                    <Header as="h1">17. Governing Law</Header>
                    <p>17.1 This Agreement will be governed by and construed in accordance with the laws of the Province of British Columbia and the laws of Canada applicable therein. The Courts of the Province of British Columbia will have exclusive jurisdiction to hear and make any judicial determination on any issue arising with respect to this Agreement. The parties expressly exclude the UN Convention on Contracts for the International Sale of Goods as amended, replaced or re-enacted from time to time. The parties have required that this Agreement and all documents relating thereto be drawn up in English. <i>Nous avons demandé que cette convention ainsi que tous les documents qui s'y rattachent soient rédigés en anglais.</i></p>
                </Container>
            </div>
            <div className="white-bg">
                <Container>
                    <Header as="h1">18. Severability</Header>
                    <p>18.1 If a court of competent jurisdiction concludes that any provision of this Agreement is illegal, invalid or unenforceable, then it shall be severed from this Agreement and the remaining provisions shall remain in full force and effect.</p>
                </Container>
            </div>
            <div className="blue-bg-section">
                <Container>
                    <Header as="h1">19. Enurement</Header>
                    <p>19.1 The Agreement will be for the benefit of and binding upon your heirs, executors, representatives, administrators, successors and permitted assigns.</p>
                </Container>
            </div>
            <div className="white-bg">
                <Container>
                    <Header as="h1">20. Entire Agreement</Header>
                    <p>20.1 This Agreement constitutes the entire understanding between the parties hereto and supersedes all previous communications, representations and understandings, oral or written, between the parties with respect to the subject matter of this Agreement.</p>
                    <p>In addition to accepting the terms and conditions set out in this Agreement by clicking the "Agree button, the Sign Up" button, or by using the Charitable Impact System or the Services provided by the Charitable Impact Collective or by making a Donation, when you communicate with the Charitable Impact Collective by using its website or other technology involving the Charitable Impact System as contemplated in this Agreement, those communications will be considered to be made "in writing" to the extent required for purposes of this Agreement.</p>
                </Container>
            </div>
        </Layout>
    );
}

export default ChimpAccountAgreement;
