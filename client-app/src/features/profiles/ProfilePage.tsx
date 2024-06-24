import { Grid, GridColumn } from "semantic-ui-react";
import ProfileHeader from "./ProfileHeader.tsx";
import ProfileContent from "./ProfileContent.tsx";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useStore } from "../../app/stores/store.ts";
import { useEffect } from "react";
import LoadingComponent from "../../app/layout/LoadingComponents.tsx";

export default observer(function ProfilePage() {
    const {username} = useParams<{ username: string }>();
    const {profileStore} = useStore();
    const {loadingProfile, loadProfile, profile, setActiveTab} = profileStore;

    useEffect(() => {
        loadProfile(username);
        return () => {
            setActiveTab(0);
        }
    }, [loadProfile, username, setActiveTab]);

    if (loadingProfile) {
        return <LoadingComponent content='Loading profile...' />
    }

    return (
        <Grid>
            <GridColumn width={16}>
                {profile &&
                    <>
                        <ProfileHeader profile={profile} />
                        <ProfileContent profile={profile} />
                    </>
                }
            </GridColumn>
        </Grid>
    )
})