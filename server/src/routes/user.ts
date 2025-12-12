import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get Profile
router.get('/profile', authenticateToken, async (req: any, res) => {
    try {
        const profile = await prisma.userProfile.findUnique({
            where: { userId: req.user.userId },
            include: { user: { select: { name: true, email: true } } }
        });

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        // Transform to match frontend expected format if needed
        // But frontend expects UserProfile which is mostly what we stored
        const response = {
            name: profile.user.name,
            email: profile.user.email,
            businessIdea: profile.businessIdea,
            capital: profile.capital,
            experience: profile.experience,
            location: profile.location,
            teamSize: profile.teamSize
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Create/Update Profile
router.post('/profile', authenticateToken, async (req: any, res) => {
    try {
        const { businessIdea, capital, experience, location, teamSize } = req.body;
        const userId = req.user.userId;

        const profile = await prisma.userProfile.upsert({
            where: { userId },
            update: {
                businessIdea,
                capital,
                experience,
                location,
                teamSize
            },
            create: {
                userId,
                businessIdea,
                capital,
                experience,
                location,
                teamSize
            }
        });

        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save profile' });
    }
});

// Get Settings
router.get('/settings', authenticateToken, async (req: any, res) => {
    try {
        const settings = await prisma.settings.findUnique({
            where: { userId: req.user.userId }
        });
        // Return defaults if no settings found
        res.json(settings || { darkMode: true, notifications: true, publicProfile: false, twoFactor: false });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// Update Settings
router.post('/settings', authenticateToken, async (req: any, res) => {
    try {
        const { darkMode, notifications, publicProfile, twoFactor } = req.body;
        const userId = req.user.userId;

        const settings = await prisma.settings.upsert({
            where: { userId },
            update: { darkMode, notifications, publicProfile, twoFactor },
            create: { userId, darkMode, notifications, publicProfile, twoFactor }
        });

        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save settings' });
    }
});

export default router;
