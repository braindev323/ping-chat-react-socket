import gql from 'graphql-tag';

export const qGetMyContacts = gql`
    query GetMyContacts{
        getMyContacts {
            id
            account {
                id
                username
                first_name
                last_name
                email
                photo
                level
            }
        }
    }
`;