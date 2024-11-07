import { useState, useEffect } from 'react';
import { Rating } from 'react-simple-star-rating';
import { useAuth } from "../../auth/useAuth";

const URL = import.meta.env.VITE_API_URL;

const InputUserRating = ({ teacherid, israted, reservationid }: { teacherid: string; israted: number; reservationid: string;}) => {
    const { user } = useAuth();
    const [isReadonly, setIsReadonly] = useState(false); 
    useEffect(() => {
        if (israted != 0) {
            setIsReadonly(true);
        }
    }, [israted]);

    const handleRating = async (value: number) => {
        try {
            const response = await fetch(`${URL}teachers/update-rating/${teacherid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify({ newRating: value, reservationid: reservationid })
            });

            if (!response.ok) {
                throw new Error(`Failed to update rating: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Rating updated successfully:', data);

            setIsReadonly(true); // Set to readonly after successful rating update
        } catch (error) {
            console.error('Error updating rating:', error);
        }
    };

    const selectedColor = israted === 0 ? '#FFD700' : '#008000';
    return (
        <Rating
            initialValue={israted}
            readonly={isReadonly} 
            size={20}
            fillColor={selectedColor}
            emptyColor="#ccc"
            allowFraction={true}
            onClick={handleRating} 
        />
    );
};

export default InputUserRating;
