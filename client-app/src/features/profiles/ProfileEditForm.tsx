import { useState } from "react";
import { Button, Grid, GridColumn, Header, TabPane } from "semantic-ui-react";
import { Form, Formik } from "formik";
import MyTextArea from "../../app/common/form/MyTextArea.tsx";
import MyTextInput from "../../app/common/form/MyTextInput.tsx";
import { useStore } from "../../app/stores/store.ts";
import * as Yup from "yup";
import { Profile } from "../../app/models/profile.ts";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../app/layout/LoadingComponents.tsx";

export default observer(function ProfileEdit() {
    const [isEditing, setIsEditing] = useState(false);
    const {profileStore} = useStore();
    const {profile, isCurrentUser, loading} = profileStore;
    const {userStore} = useStore();

    const handleSubmit = async (values: Partial<Profile>) => {
        const username = userStore.user?.username;
        if (username) {
            await profileStore.updateProfile(username, values);
            setIsEditing(false);
        } else {
            console.error("Username not found");
        }
    };
    
    const validationSchema = Yup.object({
        displayName: Yup.string().required("Display Name is required")
    });

    return (
        (isCurrentUser && isEditing) ? (
            <Formik
                initialValues={{displayName: profile?.displayName, bio: profile?.bio}}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({isValid, dirty}) => (
                    <TabPane>
                        {loading && <LoadingComponent content='Updating profile...' />}
                        <Grid>
                            <GridColumn width={16}>
                                <Header floated='left' icon='edit'
                                        content={`Edit Profile`}
                                />
                                <Form className='ui form'>
                                    <MyTextInput name='displayName' placeholder='Display Name' />
                                    <MyTextArea name='bio' placeholder='Bio' rows={3} />
                                    <Button floated='right'
                                            basic
                                            positive
                                            type='submit'
                                            disabled={!dirty || !isValid || loading}
                                            content='Update Profile'
                                    />
                                    <Button floated='right'
                                            basic
                                            negative
                                            onClick={() => setIsEditing(false)}
                                            content='Cancel'
                                            disabled={loading}
                                    />
                                </Form>
                            </GridColumn>
                        </Grid>
                    </TabPane>
                )}
            </Formik>
        ) : (
            <TabPane>
                <Grid>
                    <GridColumn width={16}>
                        <Header floated='left' icon='user circle'
                                content={`About ${profile?.displayName}`}
                        />
                        {isCurrentUser && (
                            <Button onClick={() => setIsEditing(true)} basic floated={'right'}
                                    content='Edit Profile' />
                        )}
                    </GridColumn>
                    <GridColumn width={16}>
                        {profile?.bio}
                    </GridColumn>
                </Grid>
            </TabPane>
        )
    )
})