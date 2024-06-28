import { Card, Grid, GridColumn, Image, Loader, Tab, TabPane } from "semantic-ui-react";
import { useStore } from "../../app/stores/store.ts";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface Props {
    username: string;
}

export default observer(function ProfileActivities({username}: Props) {
    const {profileStore} = useStore();
    const {loadUserActivities, userActivities, loadingActivities} = profileStore;
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        loadUserActivities(username, 'past');
    }, [loadUserActivities, username]);

    useEffect(() => {
        let predicate;
        switch (activeTab) {
            case 1:
                predicate = 'future';
                break;
            case 2:
                predicate = 'hosting';
                break;
            default:
                predicate = 'past';
                break;
        }
        loadUserActivities(username, predicate as string);
    }, [loadUserActivities, activeTab, username]);

    const handleTabChange = (activeIndex: number) => {
        setActiveTab(activeIndex);
    };


    const panes = [
        {menuItem: 'Past Events'},
        {menuItem: 'Future Events'},
        {menuItem: 'Hosted Events'},
    ]

    return (
        <TabPane>
            <Grid>
                <Grid.Column width={16}>
                    <Tab
                        menu={{secondary: true, pointing: true}}
                        panes={panes}
                        onTabChange={(_e, data) => handleTabChange(data.activeIndex as number)}
                    />
                </Grid.Column>
                <GridColumn width={16}>
                    {loadingActivities ? (
                        <Loader active inline='centered' />
                    ) : (
                        <Card.Group itemsPerRow={4}>
                            {userActivities.map((activity) => (
                                <Card as={Link} to={`/activities/${activity.id}`} target='_blank'
                                      key={activity.id}>
                                    <Image
                                        src={`/assets/categoryImages/${activity.category}.jpg`}
                                        fluid
                                    />
                                    <Card.Content>
                                        <Card.Header>{activity.title}</Card.Header>
                                        <Card.Meta
                                            style={{padding: 4}}>{format(activity.date!, 'dd MMM yyyy')}
                                        </Card.Meta>
                                    </Card.Content>
                                </Card>
                            ))}
                        </Card.Group>
                    )}
                </GridColumn>
            </Grid>
        </TabPane>
    )
})