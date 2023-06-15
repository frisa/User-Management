import { gql } from "apollo-angular";

const GET_AUTHENTICATIONS = gql`
query{
    authentications{
        user
        password
        authenticated
    }
}
`

const ADD_AUTHENTICATION = gql`
mutation addAuthentication($user: String!, $password: String!)
{
    addAuthentication(user: $user, password: $password)
    {
        user
        password
    }
}
`
export {GET_AUTHENTICATIONS, ADD_AUTHENTICATION}
