import { Card } from "semantic-ui-react";
import { UserActivity } from "../../app/models/profile.ts";

interface Props {
    activity: UserActivity;
}

export default function ActivityCard({activity}: Props) {
    return (
        <Card>
            <Card.Content>
                <Card.Header>{activity.title}</Card.Header>
                <Card.Description>{activity.category}</Card.Description>
            </Card.Content>
        </Card>
    )
}