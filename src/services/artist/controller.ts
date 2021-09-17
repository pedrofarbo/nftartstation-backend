import { NextFunction, Request, Response } from 'express';

import { ArtistForm } from '../../models/artistForm.model';
import { Invite } from '../../models/invite.model';
import Mail from "../../mail";
import { config } from './../../config';
import { User } from '../../models';

export const approve = (req: Request, res: Response, next: NextFunction) => {
    if (config.keyMaster != req.query.token) {
        return res
            .status(403)
            .send({ error: 'Access denied! Please call the support to access this resource.' });
    }

    return ArtistForm.findByPk(req.params.formId)
        .then((artistForm: any | null) => {

            if (artistForm.status != 'new') {
                return res
                    .status(403)
                    .send({ error: 'Error! This form is already reviewed.' });
            }

            const data = artistForm.dataValues;
            artistForm.status = 'approved';
            artistForm.reviewerUser = 'NFTartstation';
            artistForm.reviewerDate = new Date();

            artistForm.save(artistForm);

            User.findByPk(data.userId).then(async (user: any | null) => {
                user.username = data.username;
                user.avatar = data.avatar;
                user.inviteCode = data.inviteCode;
                user.artist = true;
                user.name = data.name;
                user.email = data.email;
                user.location = data.location;
                user.bio = data.bio;
                user.website = data.website;
                user.instagramUrl = data.instagramUrl;
                user.facebookUrl = data.facebookUrl;
                user.youtubeUrl = data.youtubeUrl;
                user.discordUrl = data.discordUrl;
                user.twitterUrl = data.twitterUrl;

                user.save(user);

                let invites: any = [];

                for (let i: number = 0; i < config.inviteTimes; i++) {
                    const inviteBody = { inviteCode: Math.floor(Math.random() * 10000000).toString(), active: true, userId: data.userId, username: user.username ? user.username : user.publicAddress, createdDate: new Date() };

                   await Invite.create(inviteBody)
                        .then((invite: any) => {
                            const dataInvite = invite.dataValues;
                            invites.push(dataInvite);
                        })
                }

                if (invites.length > 0) {
                    try {
                        const mailData = {
                            from: 'rafael@nftartstation.com',  // sender address
                            to: data.email,   // list of receivers
                            subject: 'Reply: Artist Form Submission - ' + data.name + ' | NFTartstation',
                            html:

                                `<html>
        
                        <h3>Result of your application:</h3>
                     
                        <br />
        
                        <b>Approved.</b>
        
                        <br />
        
                        <p>Congratulations you reach the requeriments to sell arts in our marketplace. Welcome aboard!</p>
    
                        <p>You recieve two codes for invite your friends to our community of artists, you can see below:</p>
    
                        <li>${invites[0].inviteCode}</li>
                        <li>${invites[1].inviteCode}</li>
                        
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

                        res.json({ formId: data.id, approved: true });
                    } catch (err) {
                        console.error(err);
                    }
                }
            })

        })
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
                    .send({ error: 'Error! This form is already reviewed.' });
            }

            const data = artistForm.dataValues;
            artistForm.status = 'declined';
            artistForm.reviewerUser = 'NFTartstation';
            artistForm.reviewerDate = new Date();

            artistForm.save(artistForm);

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
            req.body.invitedBy = invite.username ? invite.username : 'NFTartstation';
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
                        const approvalUrl = config.basePath + 'api/artist/form/' + artistForm.id + '/approve?token=' + config.keyMaster;
                        const declineUrl = config.basePath + 'api/artist/form/' + artistForm.id + '/decline?token=' + config.keyMaster;

                        const mailData = {
                            from: artistForm.email,  // sender address
                            to: 'pedro@nftartstation.com',   // list of receivers
                            subject: 'Artist Form Submission - ' + artistForm.name + ' | NFTartstation',
                            html:

                                `<html>
                            <h1>This is a test email</h1>
                            
                            <br />

                            <div>This artist is been invited by ${artistForm.invitedBy}</div>

                        <h3>About the artist:</h3>

                        <div><b>Username:</b> ${artistForm.username}</div>
                        <div><b>Name:</b> ${artistForm.name}</div>
                        <div><b>Email:</b> ${artistForm.email}</div>
                        <div><b>Location:</b> ${artistForm.location}</div>
                        
                        <br />
                        <div><b>Bio:</b> ${artistForm.bio}</div>
                        <br />
    
                        <div><b>Website:</b> ${artistForm.website ? artistForm.website : 'No inputed'}</div>
                        <div><b>Instagram:</b> ${artistForm.instagramUrl ? artistForm.instagramUrl : 'No inputed'}</div>
                        <div><b>Facebook:</b> ${artistForm.facebookUrl ? artistForm.facebookUrl : 'No inputed'}</div>
                        <div><b>Youtube:</b> ${artistForm.youtubeUrl ? artistForm.youtubeUrl : 'No inputed'}</div>
                        <div><b>Discord:</b> ${artistForm.discordUrl ? artistForm.discordUrl : 'No inputed'}</div>
                        <div><b>Twitter:</b> ${artistForm.twitterUrl ? artistForm.twitterUrl : 'No inputed'}</div>
                        
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

