import React from 'react'
import Link from 'next/link'
import { useQuery, useMutation, queryCache } from 'react-query'

import axios from 'axios'

import PostForm from '../components/PostForm'
// import useLogout from '../hooks/useLogout'
// import useLogin from '../hooks/useLogin'

export default function Posts() {
  const postsQuery = useQuery('posts', () =>
    axios.get('/api/posts').then((res) => res.data)
  )

  const [createPost, createPostInfo] = useMutation(
    (values) => axios.post('/api/posts', values),
    {
      onMutate: (values) => {
        queryCache.cancelQueries('posts')

        const oldUser = queryCache.getQueryData('posts')

        queryCache.setQueryData('posts', (oldUser) => {
          return [
            ...oldUser,
            {
              ...values,
              id: Date.now(),
            },
          ]
        })

        return () => queryCache.setQueryData('posts', oldUser)
      },
      onError: (error, values, rollback) => {
        // window.alert(error.response.data.message)
        if (rollback) {
          rollback()
        }
      },
      onSettled: () => queryCache.invalidateQueries('posts'),
    }
  )

  return (
    <section>
      <hr />
      <div>
        <div>
          {postsQuery.isLoading ? (
            <span>Loading...</span>
          ) : (
            <>
              <h3>Posts {postsQuery.isFetching ? <small>...</small> : null}</h3>
              <ul>
                {postsQuery.data.map((post) => (
                  <Link href="/[postId]" as={`/${post.id}`} key={post.id}>
                    <a>
                      <li key={post.id}>{post.title}</li>
                    </a>
                  </Link>
                ))}
              </ul>
              <br />
            </>
          )}
        </div>
      </div>

      <hr />

      <div>
        <h3>Create New Post</h3>
        <div>
          <PostForm
            onSubmit={createPost}
            clearOnSubmit
            submitText={
              createPostInfo.isLoading
                ? 'Saving...'
                : createPostInfo.isError
                ? 'Error!'
                : createPostInfo.isSuccess
                ? 'Saved!'
                : 'Create Post'
            }
          />
          {createPostInfo.isError ? (
            <pre>{createPostInfo.error.response.data.message}</pre>
          ) : null}
        </div>
      </div>
    </section>
  )
}


// function Auth() {
//   // const queryClient = useQueryClient()

//   const { status, data, error } = useQuery('user', async () => {
//     const res = await axios.get('/api/user')
//     const result = res.data
//     console.log('result', result)
//     return result
//   })

//   // const [login, loginInfo] = useMutation(
//   //   (values) => axios.post('/api/user', values),
//   //   {
//   //     onMutate: (values) => {
//   //       queryCache.cancelQueries('user')

//   //       const oldUser = queryCache.getQueryData('user')

//   //       queryCache.setQueryData('user', (oldUser) => {
//   //         return [
//   //           ...oldUser,
//   //           {
//   //             ...values,
//   //             id: Date.now(),
//   //           },
//   //         ]
//   //       })

//   //       return () => queryCache.setQueryData('user', oldUser)
//   //     },
//   //     onError: (error, values, rollback) => {
//   //       // window.alert(error.response.data.message)
//   //       if (rollback) {
//   //         rollback()
//   //       }
//   //     },
//   //     onSettled: () => queryCache.invalidateQueries('user'),
//   //   }
//   // )

//   // const [logout, logoutInfo] = useMutation(
//   //   (values) => axios.post('/api/user', values),
//   //   {
//   //     onMutate: (values) => {
//   //       queryCache.cancelQueries('user')

//   //       const oldUser = queryCache.getQueryData('user')

//   //       queryCache.setQueryData('user', (oldUser) => {
//   //         return [
//   //           ...oldUser,
//   //           {
//   //             ...values,
//   //             id: Date.now(),
//   //           },
//   //         ]
//   //       })

//   //       return () => queryCache.setQueryData('user', oldUser)
//   //     },
//   //     onError: (error, values, rollback) => {
//   //       // window.alert(error.response.data.message)
//   //       if (rollback) {
//   //         rollback()
//   //       }
//   //     },
//   //     onSettled: () => queryCache.invalidateQueries('user'),
//   //   }
//   // )

//   const logoutMutation = useMutation(logout, {
//     onSuccess: () => queryCache.invalidateQueries('user'),
//   })

//   const loginMutation = useMutation(login, {
//     onSuccess: () => queryCache.invalidateQueries('user'),
//   })

//   return (
//     <div>
//       <p>
//         In this example, you should open two tabs, log in or out on one tab,
//         then focus the other to see it sync up! (Pro Tip: Do NOT use incognito
//         tabs)
//       </p>
//       {status === 'loading' ? (
//         <h1>Loading...</h1>
//       ) : status === 'error' ? (
//         <span>Error: {error.message}</span>
//       ) : data.loggedIn ? (
//         <div>
//           <h1>Welcome, {data.name}</h1>
//           {/* eslint-disable-next-line jsx-a11y/alt-text */}
//           <img src={data.avatar} width={80} />
//           <div>
//             <button
//               onClick={() =>
//                 {
//                   loginMutation()
//                 }
//               }
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div>
//           <h1>Please login</h1>
//           <div>
//             <button
//               onClick={() =>
//                 {
//                   logoutMutation()
//                 }
//               }
//             >
//               Login
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// function login() {
//   document.cookie = 'swr-test-token=swr;'
// }

// function logout() {
//   document.cookie = 'swr-test-token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
// }
