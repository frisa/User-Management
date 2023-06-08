import { gql } from 'apollo-angular'

const GET_AUTHENTICATIONS = gql`
query{
    authentications{
        user
        password
    }
}
`
export { GET_AUTHENTICATIONS }