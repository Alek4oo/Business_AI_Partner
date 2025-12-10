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

export default router;
