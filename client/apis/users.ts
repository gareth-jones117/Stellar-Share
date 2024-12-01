import request from 'superagent'
import { User, UserData } from '../../models/user'

const rootUrl = '/api/v1'

interface GetUserFunction {
  token: string
}

export async function getAllUserInfo(): Promise<User[] | null> {
  const res =  await request.get(`${rootUrl}/users/all`) 
  return res.body as User[]
}

export async function getUser({
  token,
}: GetUserFunction): Promise<User | null> {
  return await request
    .get(`${rootUrl}/users`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => (res.body.user ? res.body.user : null))
    .catch((err) => console.log(err))
}

interface AddUserFunction {
  newUser: UserData
  token: string
}

export async function addUser({
  newUser,
  token,
}: AddUserFunction): Promise<User> {
  return request
    .post(`${rootUrl}/users`)
    .set('Authorization', `Bearer ${token}`)
    .send(newUser)
    .then((res) => res.body)
    .catch((err) => console.log(err))
}


// FRONT END API USER FUNCTIONS GO HERE

// export async function getUsers() {
//   const result = await request.get('/api/v1/users')
//   return result.body as User[]
// }

export async function getUserById(auth0Sub: string): Promise<User> {
  const result = await request.get(`/api/v1/users/${auth0Sub}`)
  return result.body as User
}

export async function getUserByEmail(email: string): Promise<User> {
  const result = await request.get(`/api/v1/users/email/${email}`)
  return result.body as User
}

export async function updateUser(
  id: string,
  updatedUser: Partial<User>,
): Promise<User | null> {
  const updated = await request.patch(rootUrl + '/users').send(updatedUser)
  if (updated) {
    return getUserById(id)
  }
  return null
}

export async function deleteUser(auth0Sub: string): Promise<boolean> {
  const deleted = await request.delete(`/api/v1/users/${auth0Sub}`)
  return deleted.ok
}
