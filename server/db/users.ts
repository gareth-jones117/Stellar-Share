import { Stuff } from '../../models/stuff.ts'
import { StuffReviewWithNames } from '../../models/stuff_reviews.ts'
import { UserData, User } from '../../models/user.ts'
import { UserReviewWithNames } from '../../models/user_reviews.ts'
import connection from './connection.ts'

// PUBLIC ROUTES

export async function getAllUserInfo(): Promise<UserData[]> {
  return connection('users').select(
    'id', 
    'name',
    'email',
    'picture'
  )
}

export async function getUserInfoById(id: number): Promise<User> {
  return connection('users').where('id', id).select(
    'id', 
    'name',
    'email',
    'picture'
  ).first() 
}

export async function getAllUserStuff(userId: number): Promise<Stuff[]>{
  return connection('stuff')
    .where('stuff.owner_id', userId)
    .select(
      'id', 
      'name', 
      'description', 
      'owner_id as ownerId', 
      'price', 
      'image_url as imageUrl', 
      'bond', 
      'condition'
    )
}

export async function getAllUserReviewsMadeByUser(id: number): Promise<UserReviewWithNames[]> {
  return connection('user_reviews')
    .leftJoin('users', 'user_reviews.user_id', 'users.id')
    .leftJoin('users as reviewers', 'user_reviews.reviewer_id', 'reviewers.id')
    .where('reviewers.id', id)
    .select(
      'user_reviews.id as id', 
      'users.id as userId',
      'users.name as userName',
      'reviewers.id as reviewerId', 
      'reviewers.name as reviewerName',
      'user_reviews.description as description', 
      'user_reviews.rating as rating'
    );
}

export async function getAllStuffReviewsMadeByUser(id: number): Promise<StuffReviewWithNames[]> {
  return connection('stuff_reviews')
    .leftJoin('stuff', 'stuff_reviews.stuff_id', 'stuff.id')
    .leftJoin('users as owners', 'stuff.owner_id', 'owners.id')
    .leftJoin('users as reviewers', 'stuff_reviews.reviewer_id', 'reviewers.id')
    .where('reviewers.id', id)
    .select(
      'stuff_reviews.id as id', 
      'stuff.id as stuffId',
      'stuff.name as stuffName',
      'reviewers.id as reviewerId', 
      'reviewers.name as reviewerName',
      'owners.id as ownerId',
      'owners.name as ownerName',
      'stuff_reviews.description as description', 
      'stuff_reviews.rating as rating'
    );
}

// PROTECTED ROUTES

export async function getUserByAuth0Sub(auth0Sub: string): Promise<UserData> {
  return connection('users')
    .select(
      'id',
      'name', 
      'email',
      'picture'
    )
    .where('auth0_sub', auth0Sub)
    .first()
}

export async function addUser(newUser: User): Promise<UserData[]> {
  return connection('users')
    .insert({
      'auth0_sub': newUser.auth0Sub, 
      'name': newUser.name,
      'email': newUser.email,
      'picture': newUser.picture
    }
    )
    .returning(['name', 'email'])
}

// OTHER FUNCTIONS NOT IN USE YET

// Update user info in the database
// export async function updateUser(
//   id: string,
//   updatedUser: Partial<User>,
// ): Promise<User | null> {
//   const updated = await connection('users').where('auth0_sub', id).update({
//     auth0_sub: id,
//     name: updatedUser.name,
//     email: updatedUser.email,
//     picture: updatedUser.picture,
//   })
//   if (updated) {
//     return getUserByAuth0Sub(id)
//   }
//   return null
// }

// Delete user from the database by their auth0_sub (unique identifier)
// export async function deleteUserById(id: string): Promise<void> {
//   await connection('users').where('auth0_sub', id).delete()
// }
