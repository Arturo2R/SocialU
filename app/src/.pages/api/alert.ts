import { NextApiRequest, NextApiResponse } from 'next';

const password = "eyquecomovalavaina";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { chatId = -4174848790, message } = req.query;

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token !== password) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (!message) {
        return res.status(400).json({ success: false, error: 'Missing message' });
    }

    try {
        // Send the alert notification to Telegram
        await fetch(`https://api.telegram.org/bot5951810455:AAHoOOE8F0Zjuhbw2PqwtcNhndl8hW4vlYU/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
            }),
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Failed to send alert notification:', error);
        res.status(500).json({ success: false, error: 'Failed to send alert notification' });
    }
}
