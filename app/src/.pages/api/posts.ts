import { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { id, password } = req.query;
    const { ids } = req.body;

    if (password !== PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
        if (ids && Array.isArray(ids)) {
            // Delete multiple documents from the "publicPosts" collection
            const batch = firestore.batch();
            ids.forEach((docId: string) => {
                const docRef = firestore.collection('publicPosts').get();
                batch.delete(docRef);
            });
            await batch.commit();

            return res.status(200).json({ message: 'Documents deleted successfully' });
        } else if (id) {
            // Delete a single document from the "publicPosts" collection
            await firestore.collection('publicPosts').doc(id as string).delete();

            return res.status(200).json({ message: 'Document deleted successfully' });
        } else {
            return res.status(400).json({ error: 'Bad Request' });
        }
    } catch (error) {
        console.error('Error deleting document(s):', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}