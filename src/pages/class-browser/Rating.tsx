
import { Rating } from 'react-simple-star-rating';

const UserRating = ({ rating }: { rating: number }) => {
    return (
        <Rating
            initialValue={rating}
            readonly={true}
            size={20}
            fillColor="#008000"
            emptyColor="#ccc"
            allowFraction={true}

        />
    );
};

export default UserRating;