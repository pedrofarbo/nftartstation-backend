import { NextFunction, Request, Response } from 'express';

import { ArtistForm } from '../../models/artistForm.model';
import { emailConfig } from '../../emailConfig';
import { Invite } from '../../models/invite.model';

export const approve = (req: Request, res: Response, next: NextFunction) => {
    return ArtistForm.findByPk(req.params.ArtistFormId)
        .then((artistForm: ArtistForm | null) => res.json(artistForm))
        .catch(next);
};

export const decline = (req: Request, res: Response, next: NextFunction) => {
    return ArtistForm.findByPk(req.params.ArtistFormId)
        .then((artistForm: ArtistForm | null) => res.json(artistForm))
        .catch(next);
};

export const submit = (req: Request, res: Response, next: NextFunction) => {
    Invite.findByPk(req.body.inviteId).then((invite: any) => {
        if (invite != null && invite.active) {
            ArtistForm.create(req.body)
                .then((artistForm: ArtistForm) => {
                    console.log(artistForm);

                    const approvalUrl = 'http://localhost:8000/api/artist/form/' + artistForm.id + '/approve';
                    const declineUrl = 'http://localhost:8000/api/artist/form/' + artistForm.id + '/decline';

                    const mailData = {
                        from: artistForm.email,  // sender address
                        to: 'rafael@nftartstation.com; pedro@nftartstation.com',   // list of receivers
                        subject: 'Artist Form Submission - ' + artistForm.name + ' | NFTartstation',
                        html:

                            `<html>
                            <h1>This is a test email</h1>
                            
                            <br />

                            <div>This artist is been invited by ${invite.invitedBy}</div>

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
    
                        <div>The artist portifolio is in attachments.</div>
                        
                        <div>To <b>Approve</b> this form <a href=${approvalUrl}>Click here<a/></div>
                        
                        <br />
                        
                        <div>To <b>Decline</b> this form <a href=${declineUrl}>Click here<a/></div>
                    </html>`,
                        attachments: artistForm.portifolio // format [{path: 'BASE64 IMAGE HERE'}, {path: 'AND HERE'}] etc... 
                    };

                    emailConfig().transponder().sendMail(mailData, (error: any, info: any) => {
                        if (error) {
                            return console.log(error);
                        }
                    });

                    res.json(artistForm)
                })
                .catch(next);
        } else {
            return res
			.status(403)
			.send({ error: 'Sorry, but your invite is not valid!' });
        }
    });


}

