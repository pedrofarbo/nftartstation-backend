import { NextFunction, Request, Response } from 'express';

import { ArtistForm } from '../../models/artistForm.model';
import { Invite } from '../../models/invite.model';
import Mail from "../../mail";
import { config } from './../../config';

export const approve = (req: Request, res: Response, next: NextFunction) => {
    if (config.keyMaster != req.query.token) {
        return res
            .status(403)
            .send({ error: 'Access denied! Please call the support to access this resource.' });
    }

    return ArtistForm.findByPk(req.params.formId)
        .then((artistForm: ArtistForm | null) => res.json(artistForm))
        .catch(next);
};

export const decline = (req: Request, res: Response, next: NextFunction) => {
    if (config.keyMaster != req.query.token) {
        return res
            .status(403)
            .send({ error: 'Access denied! Please call the support to access this resource.' });
    }

    ArtistForm.findByPk(req.params.formId)
        .then((artistForm: any | null) => {

            if (artistForm.status != 'new') {
                return res
                    .status(403)
                    .send({ error: 'Error! This form is already declined.' });
            }

            const data = artistForm.dataValues;
            data.status = 'declined';

            artistForm.save(data);

            try {
                const mailData = {
                    from: 'rafael@nftartstation.com',  // sender address
                    to: data.email,   // list of receivers
                    subject: 'Reply: Artist Form Submission - ' + data.name + ' | NFTartstation',
                    html:

                        `<html>

                <h3>Result of your application:</h3>
             
                <br />

                <b>Declined.</b>

                <br />

                <p>Unfortunately you don't reach the minimum requeriments to sell arts in our marketplace, please try again in the next year.</p>
                
                <br />
            </html>`,
                    attachments: [] // format [{path: 'BASE64 IMAGE HERE'}, {path: 'AND HERE'}] etc... 
                };

                Mail.from = mailData.from;
                Mail.to = mailData.to;
                Mail.subject = mailData.subject;
                Mail.message = mailData.html;
                Mail.attachments = mailData.attachments;

                Mail.sendMail();

                res.json({ formId: data.id, approved: 'false' });
            } catch (err) {
                console.error(err);
            }
        })
        .catch(next);
};

export const submit = (req: Request, res: Response, next: NextFunction) => {
    Invite.findOne({ where: { inviteCode: req.body.inviteCode, active: true } }).then((invite: any) => {
        if (invite != null && invite.active) {
            req.body.createdDate = new Date();
            req.body.invitedBy = invite.userName ? invite.userName : 'NFTartstation';
            req.body.inviteCode = invite.inviteCode;

            try {
                const data = JSON.stringify(req.body, function (key, value) {
                    if (value === '' || value === "") {
                        return null;
                    }

                    // otherwise, leave the value unchanged
                    return value;
                });

                const dataJson = JSON.parse(data);

                ArtistForm.create(dataJson)
                    .then((artistForm: ArtistForm) => {
                        const approvalUrl = 'http://localhost:8000/api/artist/form/' + artistForm.id + '/approve?token=' + config.keyMaster;
                        const declineUrl = 'http://localhost:8000/api/artist/form/' + artistForm.id + '/decline?token=' + config.keyMaster;

                        const mailData = {
                            from: artistForm.email,  // sender address
                            to: 'rafael@nftartstation.com; pedro@nftartstation.com',   // list of receivers
                            subject: 'Artist Form Submission - ' + artistForm.name + ' | NFTartstation',
                            html:

                                `<html>
                            <h1>This is a test email</h1>
                            
                            <br />

                            <div>This artist is been invited by ${artistForm.invitedBy}</div>

                        <h3>About the artist:</h3>
                        
                        <div><b>Name:</b> ${artistForm.name}</div>
                        <div><b>Email:</b> ${artistForm.email}</div>
                        <div><b>Location:</b> ${artistForm.location}</div>
                        
                        <br />
                        <div><b>Bio:</b> ${artistForm.bio}</div>
                        <br />
    
                        <div><b>Website:</b> ${artistForm.website}</div>
                        <div><b>Instagram:</b> ${artistForm.instagramUrl}</div>
                        <div><b>Facebook:</b> ${artistForm.facebookUrl}</div>
                        <div><b>Youtube:</b> ${artistForm.youtubeUrl}</div>
                        <div><b>Discord:</b> ${artistForm.discordUrl}</div>
                        <div><b>Twitter:</b> ${artistForm.twitterUrl}</div>
                        
                        <br />

                        <div>The artist portifolio is in attachments.</div>
                        
                        <br />

                        <div>To <b>Approve</b> this form <a href=${approvalUrl}>Click here<a/></div>
                        <div>To <b>Decline</b> this form <a href=${declineUrl}>Click here<a/></div>
                    </html>`,
                            attachments: artistForm.portifolio // format [{path: 'BASE64 IMAGE HERE'}, {path: 'AND HERE'}] etc... 
                        };

                        Mail.from = mailData.from;
                        Mail.to = mailData.to;
                        Mail.subject = mailData.subject;
                        Mail.message = mailData.html;
                        Mail.attachments = mailData.attachments;

                        Mail.sendMail();

                        invite.active = false;

                        invite.save(invite);

                        res.json(artistForm);
                    })
                    .catch((err: any) => {
                        return res
                            .status(403)
                            .send({ code: '31', error: 'Sorry, you already have one opened submission for review! Wait for our reply in your email.' });
                    });
            } catch (err) {
                console.log(err);
            }
        } else {
            return res
                .status(403)
                .send({ code: '32', error: 'Sorry, but your invite is not valid!' });
        }
    });


}

