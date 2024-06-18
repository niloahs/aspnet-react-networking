import { Form, Formik } from "formik";
import { Button, Header, Segment } from "semantic-ui-react";
import { useEffect, useState } from "react";
import { useStore } from "../../../app/stores/store.ts";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ActivityFormValues } from "../../../app/models/activity.ts";
import LoadingComponent from "../../../app/layout/LoadingComponents.tsx";
import * as Yup from 'yup';
import MyTextInput from "../../../app/common/form/MyTextInput.tsx";
import MyTextArea from "../../../app/common/form/MyTextArea.tsx";
import MySelectInput from "../../../app/common/form/MySelectInput.tsx";
import { categoryOptions } from "../../../app/common/options/categoryOptions.ts";
import MyDateInput from "../../../app/common/form/MyDateInput.tsx";
import { v4 as uuid } from 'uuid';


export default observer(function ActivityForm() {

        const {activityStore} = useStore();
        const {
            createActivity,
            updateActivity,
            loadActivity,
            loadingInitial
        } = activityStore;
        const {id} = useParams();
        const navigate = useNavigate();

        const [activity, setActivity] = useState<ActivityFormValues>(
            new ActivityFormValues());

        const validationSchema = Yup.object({
            title: Yup.string().required('An activity title is required.'),
            description: Yup.string().required('An activity description is required.'),
            category: Yup.string().required('Category is required.'),
            date: Yup.string().required('Date is required.').nullable(),
            venue: Yup.string().required('Venue is required.'),
            city: Yup.string().required('City is required.')
        })

        useEffect(() => {
            if (id) loadActivity(id).then(activity => setActivity(new ActivityFormValues(activity)));
        }, [id, loadActivity]);

        function handleFormSubmit(activity: ActivityFormValues) {
            if (!activity.id) {
                let newActivity = {
                    ...activity,
                    id: uuid()
                };
                createActivity(newActivity).then(() => navigate(`/activities/${newActivity.id}`));
            } else {
                updateActivity(activity).then(() => navigate(`/activities/${activity.id}`));
            }
        }

        if (loadingInitial) return <LoadingComponent content='Loading activity...' />

        return (
            <Segment clearing>
                <Header content={'Activity Details'} sub color='teal' />
                <Formik
                    validationSchema={validationSchema}
                    enableReinitialize={true}
                    initialValues={activity}
                    onSubmit={(values) => handleFormSubmit(values)}>
                    {({handleSubmit, isValid, isSubmitting, dirty}) => (
                        <Form className={'ui form'} onSubmit={handleSubmit} autoComplete={'off'}>
                            <MyTextInput name={'title'} placeholder={'Title'} />

                            <MyTextArea rows={3} placeholder='Description' name={'description'} />

                            <MySelectInput options={categoryOptions} placeholder='Category'
                                           name={'category'} />

                            <MyDateInput placeholderText='Date' name={'date'} showTimeSelect
                                         timeCaption='time'
                                         dateFormat='MMMM d, yyyy h:mm aa'
                            />
                            <Header content={'Location Details'} sub color='teal' />

                            <MyTextInput placeholder='City' name={'city'} />

                            <MyTextInput placeholder='Venue' name={'venue'} />

                            <Button disabled={isSubmitting || !dirty || !isValid} loading={isSubmitting}
                                    floated='right' positive type='submit'
                                    content='Submit' />

                            <Button floated='right' type='button' content='Cancel' as={Link}
                                    to={'/activities'} />
                        </Form>
                    )}
                </Formik>
            </Segment>
        );
    }
)