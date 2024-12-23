import '../../assets/styles/profilepage.css';

function ProfilePage() {
    return (
        <div id="wrapper">
            <div id="profileDesign">
                Profile
            </div>
            <div id="stackedColumns">
                <div className="column" id="likedDesign">
                    Liked
                </div>
                <div className="column" id="dislikedDesign">
                    Disliked
                </div>
                <div className="column" id="watchedDesign">
                    Watched
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;

