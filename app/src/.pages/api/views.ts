import { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';

import { Timestamp, FieldValue } from 'firebase-admin/firestore'
import { PATH } from '../../constants';

let serviceAccount = require("../../socialu-c62e6-firebase-adminsdk-taev9-0f08a59956.json");

// Initialize the Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://socialu-c62e6-default-rtdb.firebaseio.com"
    });
}

const firestore = admin.firestore();
const PASSWORD = 'eyquecomovalavaina'; // Set your desired password here

interface ViewsApi {
    id: string;
    feedView: string;
    userId: string;
    password: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // if (req.method !== 'DELETE') {
    //     return res.status(405).json({ newView:true, error: 'Method Not Allowed' });
    // }

    const { id, feedView, password, userId }: ViewsApi = req.query;
    console.log(feedView, id, password, userId)
    if (req.method === 'POST') {
        if (password !== PASSWORD) {
            return res.status(401).json({ newView:false, error: 'Unauthorized' });
        }
        if (feedView === 'false' || feedView === 'true'){
        try {
            if (id) {
                const postRef = firestore.collection(PATH).doc(id)
                const viewRef = postRef.collection('views').doc(userId);
                const transformedFeedView =  feedView === "true" ? true: false
                if (transformedFeedView) {
                    // check if the user has already seen the post checking the userID inside the post views collection
                    const doc = await viewRef.get();
                    if (!doc.exists) {
                        await viewRef.set({
                            userId,
                            viewedAt: Timestamp.now(),
                        });
                        
                        // sum +1 to the views counter in the post
                        await postRef.update({
                            viewsCounter: FieldValue.increment(1)
                        });
                    } else {
                        return res.status(200).json({ newView:false, message: 'Document already viewed' });
                    }
                    return res.status(200).json({ newView:true, message: 'Document viewed successfully' });
                } else {
                    // create a new document in the "views" collection
                    await postRef.collection('views').add({
                        userId,
                        viewedAt: Timestamp.now(),
                    });

                    await postRef.update({
                        viewsCounter: FieldValue.increment(1)
                    });

                    return res.status(200).json({ newView:true, message: 'Document viewed successfully' });

                }
                
            }
            
        } catch (error) {
            console.error('Error deleting document(s):', error);
            return res.status(500).json({ newView:false, error: 'Internal Server Error' });
        }
    }
    } else {
        return res.status(400).json({newView: false, error: 'wrong method'})
    }
}