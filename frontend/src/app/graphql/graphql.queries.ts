import {gql} from 'apollo-angular'

const GET_AUTHENTICATIONS = gql`
query{
    authentications{
        id
        user
        password
    }
}
`
const ADD_AUTHENTICATIONS = gql`
mutation authenticate($user: String!, $password: String!){
    addAuthentication(user: $user, password: $password){
        user
        password
    }
}
`
export {GET_AUTHENTICATIONS, ADD_AUTHENTICATIONS}