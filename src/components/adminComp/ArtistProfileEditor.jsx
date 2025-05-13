import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Firebase/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase/firebaseConfig';
import { Box, Typography, Button, Alert } from '@mui/material';
import ArtistStudioSettings from '../UserComp/ArtistStudioSettings';

const ArtistProfileEditor = () => {
    const { user, currentUser } = useAuth();
    const [artistData, setArtistData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saveError, setSaveError] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        const fetchArtistData = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    // Initialize bobgo_address if missing
                    if (!data.bobgo_address) {
                        data.bobgo_address = {
                            street_address: '',
                            city: '',
                            zone: '',
                            country: 'ZA',
                            code: '',
                            phone: '',
                            company: '',
                            pickup_instructions: ''
                        };
                    }
                    setArtistData(data);
                }
            } catch (error) {
                console.error('Error fetching artist data:', error);
                setSaveError('Failed to load artist profile');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchArtistData();
        }
    }, [user]);

    if (loading) return <Box>Loading...</Box>;

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>Artist Profile Management</Typography>
            
            {saveError && <Alert severity="error" sx={{ mb: 2 }}>{saveError}</Alert>}
            {saveSuccess && <Alert severity="success" sx={{ mb: 2 }}>Profile updated!</Alert>}

            {artistData && (
                <ArtistStudioSettings 
                    artistData={artistData}
                    onSaveSuccess={() => {
                        setSaveSuccess(true);
                        setTimeout(() => setSaveSuccess(false), 3000);
                    }}
                    onSaveError={(error) => setSaveError(error)}
                />
            )}
        </Box>
    );
};

export default ArtistProfileEditor;
