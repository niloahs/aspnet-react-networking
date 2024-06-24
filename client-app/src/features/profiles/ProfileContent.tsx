import { Tab, TabPane } from "semantic-ui-react";
import ProfilePhotos from "./ProfilePhotos.tsx";
import { observer } from "mobx-react-lite";
import { Profile } from "../../app/models/profile.ts";
import ProfileFollowings from "./ProfileFollowings.tsx";
import { useStore } from "../../app/stores/store.ts";

interface Props {
    profile: Profile;
}

export default observer(function ProfileContent({profile}: Props) {
    const {profileStore} = useStore();

    const panes = [
        {menuItem: 'About', render: () => <TabPane>About Content</TabPane>},
        {menuItem: 'Photos', render: () => <ProfilePhotos profile={profile} />},
        {menuItem: 'Events', render: () => <TabPane>Events Content</TabPane>},
        {menuItem: 'Followers', render: () => <ProfileFollowings />},
        {menuItem: 'Following', render: () => <ProfileFollowings />},
    ];
    return (
        <Tab
            menu={{fluid: true, vertical: true}}
            menuPosition='right'
            panes={panes}
            onTabChange={(_e, data) => profileStore.setActiveTab(data.activeIndex as number)}
        />
    )
})